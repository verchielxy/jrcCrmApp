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

    const api = proxy.$api.project;
    const loading = ref(false);
    const target = ref();

    const formShow = ref(targetId.value ? false : true);
    const formRows = ref({
      one: [
        {
          title: '项目名称',
          placeholder: '请输入项目名称',
          type: 'text',
          name: 'name',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
        {
          title: '客户',
          placeholder: '请选择客户',
          type: 'select',
          name: 'customId',
          list: [],
          search: true,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'number' },
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
          title: '项目类型',
          placeholder: '请选择项目类型',
          type: 'select',
          name: 'type',
          list: proxy.$constant.BUSINESS.PROJECT.TYPE,
          search: true,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'number' },
          ],
        },
        {
          title: '项目评级',
          placeholder: '请选择项目评级',
          type: 'select',
          name: 'grade',
          list: proxy.$constant.BUSINESS.PROJECT.GRADE,
          search: true,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'number' },
          ],
        },
        {
          title: '线索日期',
          placeholder: '请输入项目线索日期',
          type: 'datetime',
          name: 'clueDate',
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
      customId: undefined,
      headUserId: undefined,
      type: undefined,
      grade: undefined,
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
        clueDate: formData.value.clueDate ? formData.value.clueDate + ':00' : undefined,
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
                uni.$emit('REFRESH_LIST');
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

    const submitEdit = () => {
      uni.showLoading({
        title: '正在提交...',
        mask: true
      });

      api.update(targetId.value, {
        ...formData.value,
        clueDate: formData.value.clueDate ? formData.value.clueDate + ':00' : undefined,
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
                  id: targetId.value,
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

    const customerGet = () => {
      proxy.$api.customer.get(1, -1, {}).then((res) => {
        // console.log(res);
        let json = res.result;
        formRows.value.one.map(function (formRow) {
          if (formRow.name === 'customId') {
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
      customerGet();
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
