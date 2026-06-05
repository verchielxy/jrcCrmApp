<template>
  <uContainer style="padding-bottom: 70px;">
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="bg-white" v-if="target">
      <u-title class="p10px">审批详情</u-title>
      <vViewRow
          :rows="viewRows"
          v-model:formData="target"
          labelWidth="105px"
          size="small"
          class="mb20px"
      >
        <template #payModList="{ list }">
          <view>
            <view class="mb5px font12px" v-for="item in list">
              <template v-if="target.payType === 1">
                <text class="c-info mr5px">[一次性付清]</text>
                <text>付款比例：{{ item.proportion }}</text>
                <text>付款金额：{{ item.amount }}</text>
                <text>备注：{{ item.remarks }}</text>
              </template>

              <template v-else-if="target.payType === 2">
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

    <view class="operation-box bg-white p20px" v-if="target">
      <up-row :gutter="20" v-if="tab === 'list'">
        <up-col :span="6">
          <up-button type="success" @click="handleAgree">同意</up-button>
        </up-col>
        <up-col :span="6">
          <up-button @click="handleDisagree">不同意</up-button>
        </up-col>
      </up-row>
      <view class="center" v-else>
        <u-tag type="success" v-if="target.status === 3">审核通过</u-tag>
        <u-tag type="error" v-else-if="target.status === 2">审核失败</u-tag>
      </view>
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

export default defineComponent({
  components: {
  },
  props: {
    api: {
      type: Object,
      required: true,
    },
    id: {
      type: [Number, String],
      required: true,
    },
    tab: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const api = props.api;
    const id = toRef(props, 'id');
    const tab = toRef(props, 'tab');

    const loading = ref(false);
    const target = ref();
    const rejectModalShow = ref(false);
    const rejectReason = ref('');

    const viewRows = ref([
      {
        title: '项目名称',
        type: 'text',
        name: 'projectText',
      },
      {
        title: '项目类型',
        type: 'text',
        name: 'projectTypeText',
      },
      {
        title: '项目评级',
        type: 'text',
        name: 'projectGradeText',
      },
      {
        title: '负责人',
        type: 'text',
        name: 'headUserText',
      },
      {
        title: '客户名称',
        type: 'text',
        name: 'customText',
      },
      {
        title: '联系人',
        type: 'text',
        name: 'contactName',
      },
      {
        title: '电话',
        type: 'text',
        name: 'contactPhone',
      },
      {
        title: '项目预算金额',
        type: 'text',
        name: 'budgetMoney',
      },
      {
        title: '合同金额',
        type: 'text',
        name: 'dealMoney',
      },
      {
        title: '税额',
        type: 'text',
        name: 'taxMoney',
      },
      {
        title: '1%税率金额',
        type: 'text',
        name: 'taxRate4',
      },
      {
        title: '6%税率金额',
        type: 'text',
        name: 'taxRate1',
      },
      {
        title: '9%税率金额',
        type: 'text',
        name: 'taxRate2',
      },
      {
        title: '13%税率金额',
        type: 'text',
        name: 'taxRate3',
      },
      {
        title: '付款类型',
        type: 'text',
        name: 'payTypeText',
      },
      {
        title: '合同下载',
        type: 'download',
        name: 'download',
      },
      {
        title: '合同付款方式',
        type: 'slotList',
        name: 'payModList',
        slot: 'payModList',
      },
      {
        title: '备注',
        type: 'content',
        name: 'remarks',
      },
      {
        title: '合同主要内容',
        type: 'content',
        name: 'contractContent',
      },
      {
        title: '审核进度',
        type: 'slotList',
        name: 'opLogList',
        slot: 'contractReview',
      },
    ]);

    const getTarget = () => {
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
      getTarget();
    });

    onLoad((options) => {
      id.value = options.id;
      tab.value = options.tab;
    })

    return {
      api,
      id,
      tab,
      loading,
      target,
      rejectReason,
      rejectModalShow,
      viewRows,
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
