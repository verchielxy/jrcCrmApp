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

    const api = proxy.$api.schedule;
    const loading = ref(false);
    const target = ref();
    const formShow = ref(targetId.value ? false : true);
    const categorys = ref(proxy.$constant.BUSINESS.SCHEDULE.CATEGORY);
    const categoryKey = ref(categorys.value[0].key);

    const formRows = ref({
      one: [
        {
          title: '日程分类',
          placeholder: '请选择日程分类',
          type: 'radioButton',
          name: 'category',
          list: categorys.value,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
        {
          title: '客户',
          placeholder: '请选择客户',
          type: 'select',
          name: 'customerId',
          list: [],
          search: true,
          show: computed(() => {
            return formData.value.category === categorys.value[0].key;
          }),
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
        {
          title: '项目',
          placeholder: '请选择项目',
          type: 'select',
          name: 'projectId',
          list: [],
          search: true,
          show: computed(() => {
            return formData.value.category === categorys.value[1].key;
          }),
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
        {
          title: '日程标题',
          placeholder: '请输入日程标题',
          type: 'text',
          name: 'title',
          show: computed(() => {
            return formData.value.category === categorys.value[2].key;
          }),
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
        {
          title: '日程日期',
          placeholder: '请选择日期',
          type: 'date',
          name: 'flowDate',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
        {
          title: '时间选择',
          placeholder: ['开始时间','结束时间'],
          type: 'timeRange',
          name: 'time',
          names: ['startTime', 'endTime'],
          rule: [
            { required: true, type: 'array', message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
        {
          title: '跟进方式',
          placeholder: '请选择跟进方式',
          type: 'select',
          name: 'flowType',
          list: proxy.$constant.BUSINESS.SCHEDULE.TYPE,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
        {
          title: '提醒设置',
          placeholder: '请选择提醒设置',
          type: 'select',
          name: 'remindSet',
          list: proxy.$constant.BUSINESS.SCHEDULE.REMIND,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
        {
          title: '参与人',
          placeholder: '请选择参与人',
          type: 'select',
          name: 'partners',
          list: [],
          search: true,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
        {
          title: '日程内容',
          placeholder: '请填写日程内容',
          type: 'textarea',
          name: 'content',
          span: 24,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
      ],
    });
    const formData = ref({
      category: categoryKey.value,
      relationId: computed(() => {
        let relationId;
        if (formData.value.category === 'customer') {
          relationId = formData.value.customerId;
        } else if (formData.value.category === 'project') {
          relationId = formData.value.projectId;
        }

        return relationId;
      }),
      flowDate: moment().add(1, 'day').format('YYYY-MM-DD'),
      time: [
        '09:00:00', '15:00:00'
      ],
      startTime: '09:00:00',
      endTime: '15:00:00',
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

          formData.value.time = [
            json.startTime,
            json.endTime,
          ];

          if (json.relationId) {
            if (formData.value.category === 'customer') {
              formData.value.customerId = json.relationId;
            } else if (formData.value.category === 'project') {
              formData.value.projectId = json.relationId;
            }
          }

          formShow.value = true;

        }).finally(() => {
          setTimeout(function () {
            loading.value = false;
          }, 500);
        });
      }
    }

    function normalizeTime(time) {
      // 空值统一返回 null
      if (time == null || time === '') {
        return null
      }

      // HH:mm 或 HH:mm:ss
      const match = time.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/)
      if (!match) {
        return time
      }

      const [, h, m, s] = match

      return `${h}:${m}:${s ?? '00'}`
    }

    const submitAdd = () => {
      loading.value = true;
      api.create({
        ...formData.value,
        flowType: formData.value.flowType ? formData.value.flowType : '',
        remindSet: formData.value.remindSet ? formData.value.remindSet : '',
        startTime: normalizeTime(formData.value.startTime),
        endTime: normalizeTime(formData.value.endTime),
      }).then((res) => {
        // console.log(res);
        uni.showToast({
          title: '保存成功',
          icon: 'success', // 显示绿色的勾
          duration: 2000,
          success: () => {
            // 如果需要保存后返回上一页，可以在这里写逻辑
            setTimeout(() => {
              uni.$emit('REFRESH_LIST');
              uni.navigateBack();
              // uni.redirectTo({
              //   url: '/pages/business/schedule/index'
              // });
            }, 500);
          }
        });
      }).finally(() => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      });
    };

    const submitEdit = () => {
      loading.value = true;
      api.update(targetId.value, {
        ...formData.value,
        flowType: formData.value.flowType ? formData.value.flowType : '',
        remindSet: formData.value.remindSet ? formData.value.remindSet : '',
        startTime: normalizeTime(formData.value.startTime),
        endTime: normalizeTime(formData.value.endTime),
      }).then((res) => {
        // console.log(res);
        uni.showToast({
          title: '保存成功',
          icon: 'success', // 显示绿色的勾
          duration: 2000,
          success: () => {
            // 如果需要保存后返回上一页，可以在这里写逻辑
            setTimeout(() => {
              // uni.$emit('REFRESH_LIST');
              uni.$emit('UPDATE_LIST_ITEM', {
                id: targetId.value,
                newData: {
                  ...target.value,
                  ...formData.value,
                  categoryText: categorys.value.find((item) => item.key === formData.value.category).label,
                },
              });

              uni.navigateBack()
              // uni.redirectTo({
              //   url: '/pages/business/schedule/index'
              // });
            }, 500);
          }
        });
      }).finally(() => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      });
    };

    const customerGet = () => {
      proxy.$api.customer.get(1, -1, {}).then((res) => {
        // console.log(res);
        let json = res.result;
        formRows.value.one.map(function (formRow) {
          if (formRow.name === 'customerId') {
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

    const projectGet = () => {
      proxy.$api.project.get(1, -1, {}).then((res) => {
        // console.log(res);
        let json = res.result;
        formRows.value.one.map(function (formRow) {
          if (formRow.name === 'projectId') {
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

    const parentUsersGet = () => {
      api.parentUsers(1, -1, {}).then((res) => {
        // console.log(res);
        let json = res.result;
        formRows.value.one.map(function (formRow) {
          if (formRow.name === 'partners') {
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
      customerGet();
      projectGet();
      parentUsersGet();
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
      categorys,
      categoryKey,
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
