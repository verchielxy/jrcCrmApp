<template>
  <uContainer style="padding-bottom: 70px;">
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="bg-white" v-if="target">
      <u-title class="p10px">审批详情</u-title>

      <vViewRow
          :rows="viewRows"
          v-model:formData="viewData"
          labelWidth="105px"
          size="small"
          class="mb20px"
      >
      </vViewRow>
    </view>

    <view class="bg-white" v-if="targetWorkFlowData && targetWorkFlowData.length > 0">
      <u-title class="p10px">审批流转</u-title>

      <blockWorkFlow
          :workFlowData="targetWorkFlowData"
      ></blockWorkFlow>
    </view>

    <view class="operation-box" v-if="target">
      <slot name="operationBox" :target="target"></slot>
    </view>
  </uContainer>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import blockWorkFlow from "@/pages/acommon/blockWorkFlow.vue";

export default defineComponent({
  components: {
    blockWorkFlow,
  },
  props: {
    apiView: {
      type: Object,
      required: true,
    },
    id: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const apiView = props.apiView;
    const id = toRef(props, 'id');

    const loading = ref(false);
    const target = ref();
    const targetWorkFlowData = ref([]);
    const viewRows = computed(() => {
      const rows = [];

      if (target.value) {
        target.value.viewRows.map((item) => {
          rows.push({
            title: item.label,
            type: item.type === 'file' ? 'file' : 'text',
            name: item.key,
          });
        })
      }

      return rows;
    });
    const viewData = computed(() => {
      return target.value ? target.value.valueData : {};
    });

    const getTargetWorkFlowData = () => {
      loading.value = true;
      apiView(target.value.instanceId, {}).then((res) => {
        const json = res.result;

        targetWorkFlowData.value = json;

      }).finally(() => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      });
    }

    onMounted(() => {
      getTargetWorkFlowData();
    });

    onLoad((options) => {
      id.value = options.id;

      const stored = uni.getStorageSync('currentItem');
      if (stored) {
        const item = JSON.parse(stored)
        store.commit('setCurrentItem', item)
        target.value = item;
      }
    })

    return {
      id,
      loading,
      target,
      targetWorkFlowData,
      viewRows,
      viewData,
    };
  },
});
</script>

<style scoped lang="less">
.operation-box {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: #eee solid 1px;
  z-index: 999;
}
</style>
