<template>
  <view class="relative" style="padding-bottom: 80px;">
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

    <view class="operation-box p20px" v-if="targetId">
      <up-row :gutter="20">
        <up-col :span="6">
          <up-button type="error" @click="handleDelete">删除</up-button>
        </up-col>
        <up-col :span="6">
          <up-button type="success" @click="handleSubmit">保存</up-button>
        </up-col>
      </up-row>
    </view>
    <view class="operation-box p20px" v-else>
      <up-button type="success" @click="handleSubmit">添加产品</up-button>
    </view>
  </view>
</template>


<script>
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted} from 'vue';
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
    budgetId: {
      type: [Number, String],
      required: true,
    },
    budget: {
      type: Object,
      required: true,
    },
    targetId: {
      type: [Number, String],
      required: false,
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const api = props.api;
    const budgetId = toRef(props, 'budgetId');
    const budget = toRef(props, 'budget');
    const targetId = toRef(props, 'targetId');

    const loading = ref(false);
    const target = ref();

    const formShow = ref(targetId.value ? false : true);
    const formRows = ref({
      one: [
        {
          title: '产品名称',
          placeholder: '请输入产品名称',
          type: 'text',
          name: 'goodsName',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
        {
          title: '规格参数',
          placeholder: '请输入规格参数',
          type: 'text',
          name: 'goodsSpec',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
        {
          title: '产品型号',
          placeholder: '请输入产品型号',
          type: 'text',
          name: 'goodsModel',
        },
        {
          title: '数量',
          placeholder: '请输入数量',
          type: 'number',
          name: 'amount',
          min: 0,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'number', },
          ],
        },
      ],
    });
    const formData = ref({
      projectId: budget.value.projectId,
      goodsName: undefined,
      goodsSpec: undefined,
      goodsModel: undefined,
      amount: undefined,
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
        api.view(targetId.value, {}, budgetId.value).then((res) => {
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
        zIndex: 999,
        mask: true
      });

      api.create({
        ...formData.value,
      }, budgetId.value).then((res) => {
        setTimeout(() => {
          uni.hideLoading();

          uni.showToast({
            title: '保存成功',
            icon: 'success', // 显示绿色的勾
            duration: 1500,
            mask: true,
            success: () => {
              // 如果需要保存后返回上一页，可以在这里写逻辑
              uni.$emit('SUBMIT_SUCCESS');
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
        zIndex: 999,
        mask: true
      });

      api.update(targetId.value, {
        ...formData.value,
      }, budgetId.value).then((res) => {

        setTimeout(() => {
          uni.hideLoading();

          uni.showToast({
            title: '保存成功',
            icon: 'success', // 显示绿色的勾
            duration: 1500,
            mask: true,
            success: () => {
              // 如果需要保存后返回上一页，可以在这里写逻辑
              uni.$emit('SUBMIT_SUCCESS');
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

    const handleDelete = () => {
      uni.showModal({
        title: '是否删除',
        content: '确认删除该条数据吗？',
        confirmColor: '#2979ff',
        success: (res) => {
          if (res.confirm) {
            // 调用后端接口
            uni.showLoading({
              title: '正在删除...',
              zIndex: 999,
              mask: true
            });

            api.delete(targetId.value, budgetId.value).then((res) => {

              setTimeout(() => {
                uni.hideLoading();

                uni.showToast({
                  title: '删除成功',
                  icon: 'success', // 显示绿色的勾
                  duration: 1500,
                  mask: true,
                  success: () => {
                    // 如果需要保存后返回上一页，可以在这里写逻辑
                    uni.$emit('SUBMIT_SUCCESS');
                  }
                });
              }, 1000);

            }).catch((error) => {
              uni.hideLoading();
            }).finally(() => {
            });
          }
        }
      });
    };

    onMounted(() => {
      loadTarget();
    });

    onUnmounted(() => {
    })

    onLoad((options) => {
    })

    return {
      api,
      budgetId,
      budget,
      targetId,
      loading,
      target,
      formShow,
      formRows,
      formData,
      formRules,
      formRef,
      handleSubmit,
      handleDelete,
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
