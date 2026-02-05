<template>
  <view class="full-width" :class="itemClass">
    <up-button @click="show = true">
      <text>{{ faceLabel }}</text>
    </up-button>
    <up-cascader
        v-model:show="show"
        v-model="faceValue"
        :data="options"
        value-key="code"
        label-key="name"
        children-key="children"
        :mask-close-able="true"
        @change="handleChange"
    ></up-cascader>
  </view>
</template>

<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, watch, } from 'vue';
import { useStore } from 'vuex';
import pcJson from '@/static/area/pc-code.json'; // 二级联动json数据
import pcaJson from '@/static/area/pca-code.json'; // 三级联动json数据
import pcasJson from '@/static/area/pcas-code.json'; // 四级联动json数据
import {isNullOrUndefined, treeFindParents} from "@utils/tools";

export default defineComponent({
  name: 'areaSelect',
  components: {
  },
  props: {
    value: {
      type: [Number, String],
      required: true,
    },
    valueFormat: {
      type: [Function, String],
      default: 'array', // 'array' || 'string' || Function(value)
    },
    optionsJson: {
      type: String,
      default: 'pca', // pc || pca || pcas 三个选项
    },
    placeholder: {
      type: String,
      default: '请选择省市区',
    },
    itemClass: {
      type: [Array, String],
      default: undefined,
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const value = toRef(props, 'value');
    const valueFormat = toRef(props, 'valueFormat');
    const optionsJson = toRef(props, 'optionsJson');
    const placeholder = toRef(props, 'placeholder');
    const itemClass = toRef(props, 'itemClass');

    const optionsConfig = {
      pc: pcJson,
      pca: pcaJson,
      pcas: pcasJson,
    }
    const options = optionsConfig[optionsJson.value];

    const show = ref(false);
    const faceLabel = computed(()=>{
      let text = placeholder.value;
      if (faceValue.value.length > 0) {
        let arr = treeFindParents(options, 'code', value.value).reverse();
        text = arr.map(item => item.name).join(' / ');
      }
      return text;
    });
    const faceValue = ref([]);

    const faceValueRebuild = () => {
      if (!isNullOrUndefined(value.value)) {
        if (typeof (value.value) === 'array') {
          faceValue.value = value.value;
        } else {
          let arr = treeFindParents(options, 'code', value.value).reverse();

          faceValue.value = arr.map(item => item.code);
        }
      } else {
        faceValue.value = [];
      }
    }

    const handleChange = (value) => {
      if (value !== undefined) {
        if (valueFormat.value === 'string') {
          value = value[value.length - 1];
        } else if (typeof (valueFormat.value) === 'function') {
          value = valueFormat.value(value);
        }
      }

      context.emit('update:value', value);
    }

    watch(value, (nowValue, prevValue) => {
      faceValueRebuild();
    }, { immediate : true });

    return {
      isNullOrUndefined,
      value,
      placeholder,
      itemClass,
      options,
      show,
      faceLabel,
      faceValue,
      handleChange,
    };
  },
});
</script>

<style scoped lang="less">
</style>
