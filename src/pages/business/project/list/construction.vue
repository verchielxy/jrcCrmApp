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

    const id = ref();

    const api = proxy.$api.project;
    const loading = ref(false);
    const target = ref();

    const formShow = ref(false);
    const formRows = ref({
      one: [
        {
          title: '项目名称',
          placeholder: '请输入项目名称',
          type: 'plain',
          name: 'name',
        },
        {
          title: '计划开工日期',
          placeholder: '请输入计划开工日期',
          type: 'datetime',
          name: 'startTime',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'string' },
          ],
        },
        {
          title: '计划完工日期',
          placeholder: '请输入计划完工日期',
          type: 'datetime',
          name: 'endTime',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'string' },
          ],
        },
        {
          title: '项目施工地址',
          placeholder: '请输入项目施工地址',
          type: 'text',
          name: 'address',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'string' },
          ],
        },
        {
          title: '施工质量要求',
          placeholder: '请输入施工质量要求',
          type: 'select',
          name: 'workQuality',
          list: proxy.$constant.BUSINESS.PROJECT.QUALITY,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'string' },
          ],
        },
        {
          title: '甲方负责人',
          placeholder: '请输入甲方负责人',
          type: 'text',
          name: 'firstPartyUser',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'string' },
          ],
        },
        {
          title: '甲方电话',
          placeholder: '请输入甲方电话',
          type: 'text',
          name: 'firstPartyPhone',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'string' },
          ],
        },
        {
          title: '施工转接备注',
          placeholder: '请输入施工转接备注',
          type: 'textarea',
          name: 'remarks',
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
      startTime: undefined,
      endTime: undefined,
      address: undefined,
      workQuality: undefined,
      firstPartyUser: undefined,
      firstPartyPhone: undefined,
      remarks: undefined,
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

          if (target.value.buildTransfer) {
            formData.value.id = target.value.buildTransfer.id || null;
            formData.value.insId = target.value.buildTransfer.insId || null;

            formRows.value.one.map(function (item) {
              if (target.value.buildTransfer[item.name]) {
                if (item.name === 'files') {
                  let file = target.value.buildTransfer.files;
                  if (item.name === 'files' && file) {
                    item.files = [file];
                    formData.value[item.name] = file;
                  }
                } else {
                  formData.value[item.name] = target.value.buildTransfer[item.name];
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

      api.updateConstruction(id.value, {
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
