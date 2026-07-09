<template>
  <uContainer style="padding-bottom: 70px;">
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="py10px px20px bg-white">
      <up-form :model="formData" :rules="formRules" ref="formRef">
        <vFormRow
            v-if="formShow"
            :rows="formRows.one"
            v-model:formData="formData"
            :labelWidth="100"
            @payTypeChange="handlePayTypeChange"
        >
          <template #payModList>
            <view v-if="formData.payType === 1">
              <template v-for="(item, index) in formData.payModList">
                <up-row class="mb10px" :gutter="10">
                  <up-col span="4">
                    <up-input
                      type="number"
                      placeholder="付款比例"
                      v-model="item.proportion"
                      :min="0"
                      :max="100"
                      :disabled="true"
                    >
                      <template #suffix>%</template>
                    </up-input>
                  </up-col>
                  <up-col span="8">
                    <up-input
                      type="number"
                      placeholder="付款金额"
                      v-model="item.amount"
                      :min="0"
                    >
                      <template #prefix>￥</template>
                    </up-input>
                  </up-col>
                </up-row>
                <view>
                  <up-input
                    type="text"
                    placeholder="备注"
                    v-model="item.remarks"
                  ></up-input>
                </view>
              </template>
            </view>

            <view v-else>
              <template v-for="(item, index) in formData.payModList">
                <up-row class="mb10px" :gutter="10">
                  <up-col span="4">
                    <up-input
                        type="number"
                        placeholder="付款比例"
                        v-model="item.proportion"
                        :min="0"
                        :max="100"
                    >
                      <template #suffix>%</template>
                    </up-input>
                  </up-col>
                  <up-col span="6">
                    <up-input
                        type="number"
                        placeholder="付款金额"
                        v-model="item.amount"
                        :min="0"
                    >
                      <template #prefix>￥</template>
                    </up-input>
                  </up-col>
                  <up-col span="2">
                    <up-button class="calc-btn" type="primary" @click="handleClickAdd"> + </up-button>
                  </up-col>
                </up-row>

                <up-row class="mb10px" :gutter="10">
                  <up-col :span="index === 0 ? 12 : 10">
                    <up-input
                        type="text"
                        placeholder="备注"
                        v-model="item.remarks"
                    ></up-input>
                  </up-col>
                  <up-col span="2" v-if="index !== 0">
                    <up-button class="calc-btn" type="error" @click="handleClickDelete(index)"> - </up-button>
                  </up-col>
                </up-row>

                <up-divider :dashed="true" lineColor="#666" v-if="(index + 1) !== formData.payModList.length"></up-divider>
              </template>
            </view>
          </template>
        </vFormRow>
      </up-form>
    </view>

    <view class="operation-box bg-white p20px">
      <up-button type="success" @click="handleSubmit">保存</up-button>
    </view>
  </uContainer>
</template>


<script>
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted, watch} from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import moment from 'moment';

export default defineComponent({
  components: {
  },
  props: {
    targetId: {
      type: [Number, String],
      required: false,
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const id = ref();

    const api = proxy.$api.project;
    const loading = ref(false);
    const target = ref();

    const formShow = ref(false);
    const formRows = ref({
      one: [
        {
          title: '项目名称',
          type: 'plain',
          name: 'name',
        },
        {
          title: '税额（￥）',
          type: 'plain',
          name: 'taxMoney',
        },
        {
          title: '合同金额',
          placeholder: '请输入合同金额',
          type: 'number',
          name: 'dealMoney',
          min: 0,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'string' },
          ],
        },
        {
          title: '核算金额',
          placeholder: '请输入核算金额',
          type: 'number',
          name: 'verifyMoney',
          min: 0,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'string' },
          ],
        },
        {
          title: '1%税率金额',
          placeholder: '请输入1%税率金额',
          type: 'number',
          name: 'taxRate4',
          min: 0,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'string' },
          ],
        },
        {
          title: '6%税率金额',
          placeholder: '请输入6%税率金额',
          type: 'number',
          name: 'taxRate1',
          min: 0,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'string' },
          ],
        },
        {
          title: '9%税率金额',
          placeholder: '请输入9%税率金额',
          type: 'number',
          name: 'taxRate2',
          min: 0,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'string' },
          ],
        },
        {
          title: '13%税率金额',
          placeholder: '请输入13%税率金额',
          type: 'number',
          name: 'taxRate3',
          min: 0,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'string' },
          ],
        },
        {
          title: '付款类型',
          placeholder: '请选择付款类型',
          type: 'radioButton',
          name: 'payType',
          list: proxy.$constant.BUSINESS.PROJECT_CONTRACT.PAY_TYPE,
          changeEvent: {
            name: 'payTypeChange',
          },
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'number' },
          ],
        },
        {
          title: '合同付款方式',
          type: 'slot',
          name: 'payModList',
        },
        {
          title: '合同主要内容',
          placeholder: '请输入合同主要内容',
          type: 'textarea',
          name: 'content',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'string' },
          ],
        },
        {
          title: '附件',
          placeholder: '请上传附件',
          type: 'fileUpload',
          name: 'files',
          files: [],
          limit: 1,
          valueSingle: true,
          uploadAccepts: ['doc','docx','pdf'],
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'string' },
          ],
        },
      ],
    });
    const formData = ref({
      name: undefined,
      taxMoney: '0',
      dealMoney: undefined,
      verifyMoney: undefined,
      taxRate4: 0,
      taxRate1: 0,
      taxRate2: 0,
      taxRate3: 0,
      payType: 1,
      payModList: [
        {
          payMod: 1,
          proportion: 100,
          amount: 0,
          remarks: '',
        },
      ],
      contractContent: undefined,
      files: undefined,
    });
    const formRules = computed(() => {
      let rule = {};

      formRows.value.one.map((item) => {
        if (item.rule && item.rule.length > 0) {
          rule[item.name] = [];
        }
      })

      return rule;
    });
    const formRef = ref();

    const loadTarget = () => {
      if (id.value) {
        loading.value = true;
        api.view(id.value, {}).then((res) => {
          const json = res.result;

          target.value = json;

          formRows.value.one.map(function (item) {
            if (target.value[item.name]) {
              formData.value[item.name] = target.value[item.name];
            }
          });

          if (target.value.contract) {
            // 加载合同的 id 和 insId，用于后端区分首次上传 / 驳回后重新提交
            formData.value.id = target.value.contract.id || null;
            formData.value.insId = target.value.contract.insId || null;

            formRows.value.one.map(function (item) {
              if (target.value.contract[item.name]) {
                if (item.name === 'files') {
                  let file = target.value.contract.files;
                  if (item.name === 'files' && file) {
                    item.files = [file];
                    formData.value[item.name] = file;
                  }
                } else {
                  formData.value[item.name] = target.value.contract[item.name];
                }
              }
            });
          }

          formShow.value = true;

        }).finally(() => {
          setTimeout(function () {
            loading.value = false;
          }, 500);
        });
      }
    }

    const submitEdit = () => {
      uni.showLoading({
        title: '正在提交...',
        mask: true
      });

      api.updateContract(id.value, {
        ...formData.value,
      }).then((res) => {
        // console.log(res);
        setTimeout(() => {
          uni.hideLoading();

          uni.showToast({
            title: '保存成功',
            icon: 'success', // 显示绿色的勾
            duration: 1500,
            mask: true,
            success: () => {
              // 如果需要保存后返回上一页，可以在这里写逻辑
              setTimeout(() => {
                uni.$emit('UPDATE_LIST_ITEM', {
                  id: id.value,
                  newData: {
                    ...target.value,
                    ...formData.value,
                  },
                });
                uni.navigateBack();
              }, 1500);
            }
          });
        }, 1000);
      }).catch((error) => {
        uni.hideLoading();
      }).finally(() => {
      });
    };

    const handleSubmit = () => {
      formRef.value.validate().then(valid => {
        if (valid) {
          if (id.value) {
            submitEdit();
          }
        } else {
          uni.$u.toast('校验失败')
        }
      }).catch(() => {
        // 处理验证错误
        uni.$u.toast('校验失败')
      });
    }

    const handleClickAdd = () => {
      formData.value.payModList = [
        ...formData.value.payModList,
        {
          sort: formData.value.payModList.length + 1,
          proportion: 0,
          amount: 0,
          remarks: '',
        }
      ];
    }

    const handleClickDelete = (index) => {
      formData.value.payModList.splice(index, 1);
    }

    const handlePayTypeChange = () => {
      if (formData.value.payType === 1) {
        if (formData.value.payModList[0]) {
          formData.value.payModList[0].proportion = 100;
        }
        formData.value.payModList = formData.value.payModList.slice(0, 1);
      }
    };

    const handleFormChange = () => {
      let requestParams = {
        dealMoney: formData.value.dealMoney,
        taxRate1: formData.value.taxRate1,
        taxRate2: formData.value.taxRate2,
        taxRate3: formData.value.taxRate3,
      };

      proxy.$api.commonApi.taxCount(requestParams).then((res) => {
        // console.log(res);
        let json = res.result;
        formData.value.taxMoney = json;
        // formData.value.taxMoney = formData.value.dealMoney + formData.value.taxRate1 + formData.value.taxRate2 + formData.value.taxRate2;
      }).catch((error) => {
        formData.value.taxMoney = '0';
      }).finally(() => {

      });
    };

    watch(formData, (newValue, oldValue) => {
        handleFormChange();
      }, { deep: true }
    );

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
      formShow,
      formRows,
      formData,
      formRules,
      formRef,
      handleSubmit,
      handleClickAdd,
      handleClickDelete,
      handlePayTypeChange,
      handleFormChange,
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

.calc-btn {
  height: 36px!important;
}
</style>
