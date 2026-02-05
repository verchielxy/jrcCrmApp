<template>
  <uContainer style="padding-bottom: 70px;">
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="py10px px20px bg-white">
      <up-form :model="formData" :rules="formRules" ref="formRef">
        <vFormRow
            v-if="formShow"
            :rows="formRows.one"
            v-model:formData="formData"
            :labelWidth="80"
        ></vFormRow>
      </up-form>
    </view>

    <view class="operation-box bg-white p20px">
      <up-button type="success" @click="handleSubmit">保存</up-button>
    </view>
  </uContainer>
</template>


<script>
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted} from 'vue';
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

    const targetId = toRef(props, 'targetId');

    const api = proxy.$api.customer;
    const loading = ref(false);
    const target = ref();

    const formShow = ref(targetId.value ? false : true);
    const formRows = ref({
      one: [
        {
          title: '客户名称',
          placeholder: '请输入客户名称',
          type: 'text',
          name: 'name',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
        {
          title: '负责人',
          placeholder: '请选择负责人',
          type: 'select',
          name: 'headUserId',
          list: [],
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'number' },
          ],
        },
        {
          title: '客户来源',
          placeholder: '请选择客户来源',
          type: 'select',
          name: 'source',
          list: proxy.$constant.BUSINESS.CUSTOMER.SOURCE,
          search: true,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'number' },
          ],
        },
        {
          title: '所属行业',
          placeholder: '请选择所属行业',
          type: 'select',
          name: 'industry',
          list: proxy.$constant.BUSINESS.CUSTOMER.INDUSTRY,
          search: true,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'number' },
          ],
        },
        {
          title: '省市区',
          placeholder: '请选择省市区',
          type: 'area',
          name: 'provinces',
          valueFormat: 'string',
          search: true,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'number' },
          ],
        },
        {
          title: '详细地址',
          placeholder: '请输入详细地址',
          type: 'textarea',
          name: 'addr',
        },
        {
          title: '获得时间',
          placeholder: '请输入获得时间',
          type: 'date',
          name: 'getDate',
        },
        {
          title: '备注',
          placeholder: '请输入备注',
          type: 'textarea',
          name: 'remarks',
        },
      ],
    });
    const formData = ref({
      name: undefined,
      headUserId: undefined,
      source: undefined,
      industry: undefined,
      provinces: undefined,
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
      if (targetId.value) {
        loading.value = true;
        api.view(targetId.value, {}).then((res) => {
          const json = res.result;

          target.value = json;
          formRows.value.one.map(function (item) {
            if (target.value[item.name]) {
              formData.value[item.name] = target.value[item.name];
            }
          });

          formShow.value = true;

        }).finally(() => {
          setTimeout(function () {
            loading.value = false;
          }, 500);
        });
      }
    }

    const submitAdd = () => {
      uni.showLoading({
        title: '正在提交...',
        mask: true
      });

      api.create({
        ...formData.value,
      }).then((res) => {
        // console.log(res);
        setTimeout(() => {
          uni.hideLoading();

          uni.showToast({
            title: '保存成功',
            icon: 'success', // 显示绿色的勾
            duration: 2000,
            success: () => {
              // 如果需要保存后返回上一页，可以在这里写逻辑
              uni.$emit('REFRESH_LIST');
              uni.navigateBack();
            }
          });
        }, 1000);

      }).catch((error) => {
        uni.hideLoading();
      }).finally(() => {
      });
    };

    const submitEdit = () => {
      uni.showLoading({
        title: '正在提交...',
        mask: true
      });

      api.update(targetId.value, {
        ...formData.value,
      }).then((res) => {
        // console.log(res);
        setTimeout(() => {
          uni.hideLoading();

          uni.showToast({
            title: '保存成功',
            icon: 'success', // 显示绿色的勾
            duration: 2000,
            success: () => {
              // 如果需要保存后返回上一页，可以在这里写逻辑
              uni.$emit('UPDATE_LIST_ITEM', {
                id: targetId.value,
                newData: {
                  ...target.value,
                  ...formData.value,
                },
              });

              uni.navigateBack()
            }
          });
        }, 1000);
      }).catch((error) => {
        uni.hideLoading();
      }).finally(() => {
      });
    };

    const usersGet = () => {
      api.users(1, -1, {}).then((res) => {
        // console.log(res);
        let json = res.result;
        formRows.value.one.map(function (formRow) {
          if (formRow.name === 'headUserId') {
            formRow.list = json.records.map(function (item) {
              return {
                label: item.name,
                key: item.id,
              };
            })
          }
        });
      }).finally(() => {
      });
    }

    const handleSubmit = () => {
      formRef.value.validate().then(valid => {
        if (valid) {
          if (targetId.value) {
            submitEdit();
          } else {
            submitAdd();
          }
        } else {
          uni.$u.toast('校验失败')
        }
      }).catch(() => {
        // 处理验证错误
        uni.$u.toast('校验失败')
      });
    }

    onMounted(() => {
      usersGet();
      loadTarget();
    });

    onUnmounted(() => {
    })

    onLoad((options) => {
    })

    return {
      targetId,
      api,
      loading,
      target,
      formShow,
      formRows,
      formData,
      formRules,
      formRef,
      handleSubmit,
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
