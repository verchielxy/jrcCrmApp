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
import projectBudget from "@api/business/project/budget";

export default defineComponent({
  components: {
  },
  props: {
    projectId: {
      type: [Number, String],
      required: false,
    },
    targetId: {
      type: [Number, String],
      required: false,
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const projectId = toRef(props, 'projectId');
    const targetId = toRef(props, 'targetId');

    const api = proxy.$api.projectBudget;
    const loading = ref(false);
    const target = ref();

    const formShow = ref(targetId.value ? false : true);
    const formRows = ref({
      one: [
        {
          title: '请求部门',
          placeholder: '请选择请求部门',
          type: 'checkbox',
          name: 'types',
          list: proxy.$constant.BUSINESS.DEPARTMENTS,
          placement: 'column',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'], type: 'array' },
          ],
        },
      ],
    });
    const formData = ref({
      projectId: projectId.value,
      type: undefined,
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

    const handleSubmit = () => {
      formRef.value.validate().then(valid => {
        if (valid) {
          submitAdd();
        } else {
          uni.$u.toast('校验失败')
        }
      }).catch(() => {
        // 处理验证错误
        uni.$u.toast('校验失败')
      });
    }

    onMounted(() => {
    });

    onUnmounted(() => {
    })

    onLoad((options) => {
    })

    return {
      projectId,
      targetId,
      api,
      loading,
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
