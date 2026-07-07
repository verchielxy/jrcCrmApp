<template>
  <view :id="componentId" :class="['full-width relative', $attrs['class']]">
    <up-input
        type="text"
        v-model="inputValue"
        :placeholder="placeholder"
        :placeholderStyle="placeholderStyle"
        :clearable="false"
        :inputAlign="inputAlign"
        :fontSize="fontSize"
        :disabled="disabled"
    >
      <template #suffix>
        <view v-if="inputClearShow">
          <MaterialSymbol class="middle-icon" name="cancel" :size="16" weight="300" type="sharp" @click="handleClear"></MaterialSymbol>
        </view>
      </template>
    </up-input>
    <view class="targetBox" @click="handleOpen"></view>

    <up-picker
        v-if="mode !== 'multiple'"
        :show="show"
        :columns="[list]"
        keyName="label"
        @confirm="handleConfirm"
        @cancel="() => { show = false }"
        ref="pickerRef"
    ></up-picker>

    <up-popup v-else :show="show" mode="bottom" round="10" @close="() => { show = false }">
      <view class="multiple-picker-container">
        <view class="multiple-header">
          <text class="cancel-btn" @click="() => { show = false }">取消</text>
          <text class="title">请选择</text>
          <text class="confirm-btn" @click="handleMultipleConfirm">确认</text>
        </view>
        <scroll-view scroll-y class="multiple-content">
          <up-checkbox-group v-model="multipleValues" placement="column">
            <up-checkbox
                v-for="item in list"
                :key="item.key"
                :label="item.label"
                :name="item.key"
                customStyle="margin-bottom: 16px"
            ></up-checkbox>
          </up-checkbox-group>
        </scroll-view>
      </view>
    </up-popup>
  </view>
</template>

<script>
import { defineComponent, getCurrentInstance, ref, computed, onMounted, watch, toRef } from 'vue';
import { useStore } from 'vuex';
import { isNullOrUndefined } from '@/utils/tools';

export default defineComponent({
  name: 'vSelect',
  props: {
    modelValue: {
      type: [Number, String, Boolean, Array],
      default: undefined,
    },
    placeholder: {
      type: String,
      default: undefined,
    },
    placeholderStyle: {
      type: String,
      default: undefined,
    },
    list: {
      type: Array,
      default: () => [],
    },
    inputAlign: {
      type: String,
      default: undefined,
    },
    fontSize: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: 'single',
    },
    maxTagCount: {
      type: [Number, String],
      default: 'responsive', // 数字 或 'responsive'
    }
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const modelValue = toRef(props, 'modelValue');
    const placeholder = toRef(props, 'placeholder');
    const placeholderStyle = toRef(props, 'placeholderStyle');
    const list = toRef(props, 'list');
    const inputAlign = toRef(props, 'inputAlign');
    const fontSize = toRef(props, 'fontSize');
    const disabled = toRef(props, 'disabled');
    const mode = toRef(props, 'mode');
    const maxTagCount = toRef(props, 'maxTagCount');

    const componentId = ref(`v-select-${Math.random().toString(36).substr(2, 9)}`);
    const inputValue = ref();
    const show = ref(false);
    const pickerRef = ref();
    const multipleValues = ref([]);

    const inputClearShow = computed(() => {
      return !isNullOrUndefined(inputValue.value) && inputValue.value !== '';
    });

    /**
     * 1. 核心优化：计算字符串的虚拟视觉宽度
     * 中文字符权重 1.2，英文字母/数字/符号权重 0.65
     */
    const getVisualLength = (str) => {
      if (!str) return 0;
      let len = 0;
      for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        // 单字节（半角）与双字节（全角/中文）区分
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
          len += 0.65;
        } else {
          len += 1.2;
        }
      }
      return len;
    };

    /**
     * 2. 核心优化：基于当前屏幕和字符长度动态计算多选文本
     */
    const formatMultipleLabel = (labels) => {
      if (!labels || labels.length === 0) return '';

      // 如果明确指定了数字，直接按数量截断
      if (typeof maxTagCount.value === 'number') {
        if (labels.length <= maxTagCount.value) return labels.join(', ');
        return `${labels.slice(0, maxTagCount.value).join(', ')}...`;
      }

      // 如果是 'responsive' 自适应模式
      if (maxTagCount.value === 'responsive') {
        try {
          // 获取设备可用屏幕宽度
          const sysInfo = uni.getWindowInfo ? uni.getWindowInfo() : uni.getSystemInfoSync();
          const windowWidth = sysInfo.windowWidth || 375;

          // 预估 Input 框的可用宽度（扣除页面左右 padding、右侧图标区域等，保守估计占屏幕宽度的 50%-60%）
          const estimatedInputWidth = windowWidth * 0.55;

          // 这里的基准值：以 14px 字体为例，一个中文大约占 14px 宽度
          const currentFontSize = parseInt(fontSize.value) || 14;
          const maxAllowableVisualLen = estimatedInputWidth / currentFontSize;

          let currentVisualLen = 0;
          let fitCount = 0;

          for (let i = 0; i < labels.length; i++) {
            // 加上逗号分隔符的虚拟长度（如果是第一个元素则不加）
            const separatorLen = i === 0 ? 0 : 0.8;
            const itemLen = getVisualLength(labels[i]) + separatorLen;

            if (currentVisualLen + itemLen <= maxAllowableVisualLen) {
              currentVisualLen += itemLen;
              fitCount++;
            } else {
              break; // 超过当前 input 估算容量，停止向后塞入
            }
          }

          // 至少保证能显示 1 个，哪怕这 1 个本身就很长
          if (fitCount === 0) fitCount = 1;

          if (fitCount >= labels.length) {
            return labels.join(', ');
          } else {
            return `${labels.slice(0, fitCount).join(', ')}...`;
          }
        } catch (e) {
          // 降级兜底方案
          return labels.length > 1 ? `${labels[0]}...` : labels[0];
        }
      }

      return labels.join(', ');
    };

    const handleOpen = () => {
      if (disabled.value) {
        show.value = false;
        return;
      }
      if (mode.value === 'multiple') {
        multipleValues.value = Array.isArray(modelValue.value) ? [...modelValue.value] : [];
      }
      show.value = true;
    };

    const handleClear = () => {
      inputValue.value = undefined;
      const emptyValue = mode.value === 'multiple' ? [] : undefined;
      context.emit('update:modelValue', emptyValue);
      context.emit('confirm', mode.value === 'multiple' ? [] : undefined);
    };

    const handleConfirm = (array) => {
      const selectItem = array.value[0];
      inputValue.value = selectItem.label;
      context.emit('update:modelValue', selectItem.key);
      context.emit('confirm', selectItem.label, selectItem.key, selectItem);
      show.value = false;
    };

    const handleMultipleConfirm = () => {
      const selectedKeys = multipleValues.value;
      const selectedItems = list.value.filter(item => selectedKeys.includes(item.key));
      const labels = selectedItems.map(item => item.label);

      inputValue.value = formatMultipleLabel(labels);

      context.emit('update:modelValue', selectedKeys);
      context.emit('confirm', labels, selectedKeys, selectedItems);
      show.value = false;
    };

    const init = () => {
      if (!list.value || list.value.length === 0) return;

      if (mode.value === 'multiple') {
        const currentKeys = Array.isArray(modelValue.value) ? modelValue.value : [];
        const selectedItems = list.value.filter(item => currentKeys.includes(item.key));
        const labels = selectedItems.map(item => item.label);
        inputValue.value = formatMultipleLabel(labels);
      } else {
        list.value.map((item, index) => {
          if (item.key === modelValue.value) {
            inputValue.value = item.label;
            pickerRef.value?.setIndexs([index]);
          }
        });
      }
    };

    onMounted(async () => {
      init();
    });

    watch(list, () => {
      init();
    }, { immediate: true });

    watch(modelValue, () => {
      init();
    });

    return {
      componentId,
      isNullOrUndefined,
      modelValue,
      placeholder,
      placeholderStyle,
      list,
      inputAlign,
      fontSize,
      disabled,
      mode,
      maxTagCount,
      inputValue,
      inputClearShow,
      show,
      pickerRef,
      multipleValues,
      handleOpen,
      handleClear,
      handleConfirm,
      handleMultipleConfirm,
    };
  },
});
</script>

<style scoped lang="less">
.targetBox {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 35px;
  z-index: 9;
}

.multiple-picker-container {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  max-height: 70vh;

  .multiple-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    border-bottom: 1px solid #f5f5f5;
    font-size: 16px;

    .cancel-btn {
      color: #909193;
    }
    .title {
      font-weight: bold;
      color: #303133;
    }
    .confirm-btn {
      color: #3c9cff;
    }
  }

  .multiple-content {
    padding: 20px 16px;
    max-height: 500rpx;
    box-sizing: border-box;
  }
}
</style>
