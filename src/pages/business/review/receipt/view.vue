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
      </vViewRow>
    </view>

    <view class="bg-white mt20px" v-if="target">
      <u-title class="p10px">产品信息</u-title>
      <view class="p10px" v-if="tableData.length > 0">
        <u-table2
            :data="tableData"
            :columns="tableColumns"
            stripe
            border
        >
        </u-table2>
      </view>
      <view class="center px10px py3em" v-else>
        没有产品
      </view>
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
import purchaseConfig from '@/config/business/purchase';

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const id = ref();
    const tab = ref();

    const api = proxy.$api.reviewReceipt;
    const loading = ref(false);
    const target = ref();
    const rejectModalShow = ref(false);
    const rejectReason = ref('');
    const products = ref([]);
    const tableColumns = ref([
      {
        title: '产品名称',
        key: 'productName',
        dataIndex: 'productName',
        width: 250,
      },
      {
        title: '产品分类',
        key: 'productCategoryName',
        dataIndex: 'productCategoryName',
        width: 120,
      },
      {
        title: '产品品牌',
        key: 'productBrandName',
        dataIndex: 'productBrandName',
        width: 120,
      },
      {
        title: '规格参数',
        key: 'productSpec',
        dataIndex: 'productSpec',
        width: 200,
      },
      {
        title: '产品型号',
        key: 'productModel',
        dataIndex: 'productModel',
        width: 200,
      },
      {
        title: '单价',
        key: 'price',
        dataIndex: 'price',
        width: 80,
      },
      {
        title: '数量',
        key: 'amount',
        dataIndex: 'amount',
        width: 80,
      },
      {
        title: '总价',
        key: 'totalMoney',
        dataIndex: 'totalMoney',
        width: 90,
      },
    ]);
    const tableData = ref([]);

    const viewRows = ref([
      {
        title: '单据编号',
        type: 'text',
        name: 'buyNo',
      },
      {
        title: '项目名称',
        type: 'text',
        name: 'projectName',
      },
      {
        title: '采购确认单号',
        type: 'text',
        name: 'orderNo',
      },
      {
        title: '供应商',
        type: 'text',
        name: 'supplierName',
      },
      {
        title: '支付时间',
        type: 'text',
        name: 'payTime',
      },
      {
        title: '付款金额',
        type: 'text',
        name: 'payMoney',
      },
      {
        title: '已付金额',
        type: 'text',
        name: 'paidMoney',
      },
      {
        title: '剩余金额',
        type: 'text',
        name: 'leftMoney',
      },
      {
        title: '付款比例',
        type: 'text',
        name: 'payPercent',
      },
      {
        title: '税率',
        type: 'text',
        name: 'tax',
      },
      {
        title: '付款细节',
        type: 'text',
        name: 'payDetails',
      },
      {
        title: '收款方信息',
        type: 'text',
        name: 'payeeInfo',
      },
      {
        title: '紧急程度',
        type: 'text',
        name: 'urgencyLevelText',
      },
      {
        title: '产品数量',
        type: 'text',
        name: 'amount',
      },
      {
        title: '创建人',
        type: 'text',
        name: 'createByName',
      },
      {
        title: '创建日期',
        type: 'text',
        name: 'createTime',
      },
      {
        title: '备注',
        type: 'text',
        name: 'remarks',
      },
    ]);

    const getTarget = () => {
      loading.value = true;
      api.view(id.value, {}).then((res) => {
        const json = res.result;

        target.value = json;

        if (target.value.itemList && target.value.itemList.length > 0) {
          tableData.value = purchaseConfig.order.productRebuild(products.value, [], target.value.itemList);
        }

      }).finally(() => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      });
    }

    const productGet = () => {
      api.products(1, -1, {}).then((res) => {
        // console.log(res);
        let json = res.result;
        products.value = json.records.map(function (product) {
          return {
            ...product,
          };
        })
      }).finally(() => {
        getTarget();
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
      productGet();
    });

    onLoad((options) => {
      id.value = options.id;
      tab.value = options.tab;
    })

    return {
      id,
      tab,
      api,
      loading,
      target,
      rejectReason,
      rejectModalShow,
      products,
      tableColumns,
      tableData,
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
