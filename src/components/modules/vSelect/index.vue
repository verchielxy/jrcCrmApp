<template>
  <view :class="['full-width relative', $attrs['class']]">
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
    <view class="targetBox" @click="() => { disabled ? show = false : show = true }"></view>
    <up-picker
        :show="show"
        :columns="[list]"
        keyName="label"
        :defaultIndex="[1]"
        @confirm="handleConfirm"
        @cancel="() => { show = false }"
        ref="pickerRef"
    ></up-picker>
  </view>
</template>

<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, } from 'vue';
import { upperCamelCase } from '@/utils/string';
import {useStore} from 'vuex';
import { isNullOrUndefined } from '@/utils/tools';
import store from '@/stores'

export default defineComponent({
  name: 'vTableButton',
  props: {
    modelValue: {
      type: [Number, String, Boolean],
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
      default: [],
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

    const inputValue = ref();
    const inputClearShow = computed(() => {
      return !isNullOrUndefined(inputValue.value) && inputValue.value;
    });
    const show = ref(false);
    const pickerRef = ref();

    const handleClear = () => {
      inputValue.value = undefined;
    }

    const handleConfirm = (array) => {
      const selectItem = array.value[0];
      inputValue.value = selectItem.label;
      context.emit('update:modelValue', selectItem.key);
      context.emit('confirm', selectItem.label, selectItem.key, selectItem);

      show.value = false;
    }

    const init = () => {
      list.value.map((item, index) => {
        if (item.key === modelValue.value) {
          inputValue.value = item.label;
          pickerRef.value?.setIndexs([index]);
        }
      });
    }

    onMounted(async () => {
      init();
    });

    return {
      isNullOrUndefined,
      modelValue,
      placeholder,
      placeholderStyle,
      list,
      inputAlign,
      fontSize,
      disabled,
      inputValue,
      inputClearShow,
      show,
      pickerRef,
      handleClear,
      handleConfirm,
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
</style>
