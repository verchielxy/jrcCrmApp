<template>
  <uContainer style="padding-bottom: 20px;">
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view v-if="target">
      <view class="bg-white mb10px">
        <u-title class="p10px">项目详情</u-title>
        <vViewRow
            :rows="viewRows"
            v-model:formData="target"
            labelWidth="105px"
            size="small"
            class="mb20px"
        >
          <template #provinces="{ list }">
            <view class="right">
              <text class="ml5px" v-for="item in list">
                {{ item.name }}
              </text>
            </view>
          </template>
        </vViewRow>
      </view>

      <view class="bg-white mb10px">
        <u-title class="p10px">销售合同</u-title>
        <vViewRow
            :rows="viewContractRows"
            v-model:formData="target"
            labelWidth="105px"
            size="small"
            class="mb20px"
        >
          <template #payModList="{ list }">
            <view>
              <view class="mb5px font12px" v-for="item in list">
                <template v-if="target.contractPayType === 1">
                  <text class="c-info mr5px">[一次性付清]</text>
                  <text>付款比例：{{ item.proportion }}</text>
                  <text>付款金额：{{ item.amount }}</text>
                  <text>备注：{{ item.remarks }}</text>
                </template>

                <template v-else-if="target.contractPayType === 2">
                  <text class="c-info mr5px">[第{{ item.sort }}次付款]</text>
                  <text>付款比例：{{ item.proportion }}</text>
                  <text>付款金额：{{ item.amount }}</text>
                  <text>备注：{{ item.remarks }}</text>
                </template>
              </view>
            </view>
          </template>

          <template #contractReview="{ list }">
            <view>
              <up-button
                  v-if="viewContractWorkFlow && viewContractWorkFlow.length > 0"
                  type="primary"
                  @click="workFlowModalData = viewContractWorkFlow; workFlowModalShow = true;"
              >点击查看</up-button>
            </view>
          </template>
        </vViewRow>
      </view>

      <view class="bg-white mb10px">
        <u-title class="p10px">技术协议</u-title>
        <vViewRow
            :rows="viewTechnologyRows"
            v-model:formData="target"
            labelWidth="105px"
            size="small"
            class="mb20px"
        >
          <template #protocolReview="{ list }">
            <view>
              <up-button
                  v-if="viewTechnologyWorkFlow && viewTechnologyWorkFlow.length > 0"
                  type="primary"
                  @click="workFlowModalData = viewTechnologyWorkFlow; workFlowModalShow = true;"
              >点击查看</up-button>
            </view>
          </template>
        </vViewRow>
      </view>

      <view class="bg-white mb10px">
        <u-title class="p10px">施工转接</u-title>
        <vViewRow
            :rows="viewConstructionRows"
            v-model:formData="target"
            labelWidth="105px"
            size="small"
            class="mb20px"
        >
          <template #buildTransferReview="{ list }">
            <view>
              <up-button
                  v-if="viewConstructionWorkFlow && viewConstructionWorkFlow.length > 0"
                  type="primary"
                  @click="workFlowModalData = viewConstructionWorkFlow; workFlowModalShow = true;"
              >点击查看</up-button>
            </view>
          </template>
        </vViewRow>
      </view>
    </view>
  </uContainer>

  <up-modal
      :show="workFlowModalShow"
      @confirm="workFlowModalShow = false"
  >
    <scroll-view
        scroll-y
        class="modal-scroll-area"
    >
      <view style="padding: 10px;">
        <blockWorkFlow
            :workFlowData="workFlowModalData"
        ></blockWorkFlow>
        <blockWorkFlow
            :workFlowData="workFlowModalData"
        ></blockWorkFlow>
        <blockWorkFlow
            :workFlowData="workFlowModalData"
        ></blockWorkFlow>
      </view>
    </scroll-view>
  </up-modal>
</template>


<script>
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted} from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import dataViewRowsIndex from './dataViewRows/index';
import dataViewRowsContract from './dataViewRows/contract';
import dataViewRowsTechnology from './dataViewRows/technology';
import dataViewRowsConstruction from './dataViewRows/construction';
import blockWorkFlow from "@/pages/acommon/blockWorkFlow.vue";

export default defineComponent({
  components: {
    blockWorkFlow,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const id = ref();

    const api = proxy.$api.project;
    const loading = ref(false);
    const target = ref();

    const viewRows = ref(dataViewRowsIndex);
    const viewContractRows = ref(dataViewRowsContract);
    const viewTechnologyRows = ref(dataViewRowsTechnology);
    const viewConstructionRows = ref(dataViewRowsConstruction);

    const workFlowModalShow = ref(false);
    const workFlowModalData = ref([]);
    const viewContractWorkFlow = ref([]);
    const viewTechnologyWorkFlow = ref([]);
    const viewConstructionWorkFlow = ref([]);

    const loadTarget = () => {
      loading.value = true;
      api.view(id.value, {}).then((res) => {
        const json = res.result;

        target.value = json;

        if (target.value.contractTaskId) {
          workFlowContractGet();
        }

        if (target.value.protocolTaskId) {
          workFlowTechnologyGet();
        }

        if (target.value.buildTransferTaskId) {
          workFlowConstructionGet();
        }

      }).finally(() => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      });
    }

    const workFlowContractGet = () => {
      proxy.$api.workFlow.view(target.value.contractTaskId, {}).then((res) => {
        const json = res.result;

        viewContractWorkFlow.value = json;

      }).finally(() => {

      });
    }

    const workFlowTechnologyGet = () => {
      proxy.$api.workFlow.view(target.value.protocolTaskId, {}).then((res) => {
        const json = res.result;

        viewTechnologyWorkFlow.value = json;

      }).finally(() => {

      });
    }

    const workFlowConstructionGet = () => {
      proxy.$api.workFlow.view(target.value.buildTransferTaskId, {}).then((res) => {
        const json = res.result;

        viewConstructionWorkFlow.value = json;

      }).finally(() => {

      });
    }

    onMounted(() => {
      loadTarget();
    });

    onUnmounted(() => {
    })

    onLoad((options) => {
      id.value = options.id;
    })

    return {
      id,
      api,
      loading,
      target,
      viewRows,
      viewContractRows,
      viewTechnologyRows,
      viewConstructionRows,
      workFlowModalShow,
      workFlowModalData,
      viewContractWorkFlow,
      viewTechnologyWorkFlow,
      viewConstructionWorkFlow,
    };
  },
});
</script>

<style scoped lang="less">
::v-deep .u-modal__content {
  display: block;
  padding: 0 !important; /* 强制将默认的 25px padding 清空 */
}
.modal-scroll-area {
  max-height: 60vh;
  width: 100%;
}
</style>
