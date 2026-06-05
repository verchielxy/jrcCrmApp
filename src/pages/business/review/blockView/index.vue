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

    <view class="operation-box bg-white p20px" v-if="target">
      <up-row :gutter="20">
        <up-col :span="6">
          <up-button type="success" @click="handleAgree">同意</up-button>
        </up-col>
        <up-col :span="6">
          <up-button @click="handleDisagree">不同意</up-button>
        </up-col>
      </up-row>
    </view>

    <up-modal
        :show="rejectModalShow"
        title="填写驳回理由"
        showCancelButton
        @confirm="handleReview(0)"
        @cancel="rejectModalShow = false"
    >
      <view class="full-width">
        <up-textarea
            v-model="rejectReason"
            placeholder="请输入不同意的具体原因..."
            count
            maxlength="200"
            height="100"
            :fixed="true"
        ></up-textarea>
      </view>
    </up-modal>
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
            type: 'text',
            name: item.key,
          });
        })
      }

      return rows;
    });
    const viewData = computed(() => {
      return target.value ? target.value.valueData : {};
    });
    const rejectModalShow = ref(false);
    const rejectReason = ref('');

    const getTargetWorkFlowData = () => {
      loading.value = true;
      apiView(id.value, {}).then((res) => {
        const json = res.result;

        targetWorkFlowData.value = json;

      }).finally(() => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      });
    }

    const handleAgree = () => {
      uni.showModal({
        title: '审批通过',
        content: '确认批准该条申请吗？',
        confirmColor: '#2979ff',
        success: (res) => {
          if (res.confirm) {
            // 调用后端接口
            handleReview(1);
          }
        }
      });
    };

    const handleDisagree = () => {
      rejectReason.value = ''; // 重置内容
      rejectModalShow.value = true;
    };

    const handleReview = (type) => {
      if (type === 0 && !rejectReason.value) {
        uni.showToast({
          title: '不同意时，请输入不同意的理由和意见',
          icon: 'none', // 'none' 不显示图标，'error' 在某些平台显示感叹号/叉号
          duration: 2000
        });
      } else {

        uni.showLoading({
          title: '正在提交...',
          mask: true
        });

        api.review(id.value, {
          opinion: rejectReason.value,
          result: type,
        }).then((res) => {
          let json = res.result;

          uni.hideLoading();

          uni.showToast({
            title: '保存成功',
            icon: 'success', // 显示绿色的勾
            duration: 2000,
            success: () => {
              // 如果需要保存后返回上一页，可以在这里写逻辑
              setTimeout(() => {
                uni.$emit('REFRESH_LIST');
                uni.navigateBack();
              }, 1000);
            }
          });
        }).catch((error) => {
        }).finally(() => {
          loading.value = false;
        });
      }
    };

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
      rejectReason,
      rejectModalShow,
      handleReview,
      handleAgree,
      handleDisagree,
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
}
</style>
