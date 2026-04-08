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
        <u-title class="p10px">合同</u-title>
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
              <view class="mb5px font12px" v-for="item in list">
                {{ item.endTime }} {{ item.approvalStage }} - <text :class="item.status ? 'c-success':'c-error'">{{ item.opinion }}</text>
              </view>
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
              <view class="mb5px font12px" v-for="item in list">
                {{ item.endTime }} {{ item.approvalStage }} - <text :class="item.status ? 'c-success':'c-error'">{{ item.opinion }}</text>
              </view>
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
              <view class="mb5px font12px" v-for="item in list">
                {{ item.endTime }} {{ item.approvalStage }} - <text :class="item.status ? 'c-success':'c-error'">{{ item.opinion }}</text>
              </view>
            </view>
          </template>
        </vViewRow>
      </view>
    </view>
  </uContainer>
</template>


<script>
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted} from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import dataViewRowsIndex from './dataViewRows/index';
import dataViewRowsContract from './dataViewRows/contract';
import dataViewRowsTechnology from './dataViewRows/technology';
import dataViewRowsConstruction from './dataViewRows/construction';

export default defineComponent({
  components: {
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

    const loadTarget = () => {
      loading.value = true;
      api.view(id.value, {}).then((res) => {
        const json = res.result;

        target.value = json;

      }).finally(() => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
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
    };
  },
});
</script>

<style scoped lang="less">
</style>
