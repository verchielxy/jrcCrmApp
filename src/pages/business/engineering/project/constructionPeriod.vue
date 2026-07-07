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
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const id = ref();

    const api = proxy.$api.engineeringProject;
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
          title: '开始日期',
          placeholder: '请输入施工开始日期',
          type: 'datetime',
          name: 'buildStartTime',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'string' },
          ],
        },
        {
          title: '结束日期',
          placeholder: '请输入施工结束日期',
          type: 'datetime',
          name: 'buildEndTime',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'string' },
          ],
        },
      ],
    });
    const formData = ref({
      name: undefined,
      buildStartTime: undefined,
      buildEndTime: undefined,
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

      api.updateBuildDate(id.value, {
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
