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

export default defineComponent({
  components: {
  },
  props: {
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const id = ref();

    const api = proxy.$api.schedule;
    const loading = ref(false);
    const target = ref();
    const formShow = ref(false);

    const formRows = ref({
      one: [
        {
          title: '日程记录',
          placeholder: '请填写日程记录',
          type: 'textarea',
          name: 'flowContent',
          span: 24,
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
      ],
    });
    const formData = ref({
      flowContent: undefined,
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

    const submitEdit = () => {
      loading.value = true;
      api.flow(id.value, {
        ...formData.value,
      }).then((res) => {
        // console.log(res);
        uni.showToast({
          title: '保存成功',
          icon: 'success', // 显示绿色的勾
          duration: 2000,
          success: () => {
            // 如果需要保存后返回上一页，可以在这里写逻辑
            setTimeout(() => {
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

    const handleSubmit = () => {
      formRef.value.validate().then(valid => {
        if (valid) {
          submitEdit();
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
