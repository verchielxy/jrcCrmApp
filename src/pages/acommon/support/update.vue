<template>
  <uContainer style="padding-bottom: 70px;">
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="bg-white" v-if="target">
      <u-title class="p10px">技术支持详情</u-title>
      <vViewRow
          :rows="viewRows"
          v-model:formData="target"
          labelWidth="105px"
          size="small"
          class="mb20px"
      >
      </vViewRow>
    </view>

    <view class="bg-white">
      <u-title class="p10px">回复</u-title>
      <view class="py10px px20px">
        <up-form :model="formData" :rules="formRules" ref="formRef">
          <vFormRow
              v-if="formShow"
              :rows="formRows.one"
              v-model:formData="formData"
              :labelWidth="80"
          ></vFormRow>
        </up-form>
      </view>
    </view>

    <view class="operation-box bg-white p20px">
      <up-button type="success" @click="handleSubmit">保存</up-button>
    </view>
  </uContainer>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
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
    targetId: {
      type: [Number, String],
      required: false,
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const api = props.api;
    const targetId = toRef(props, 'targetId');

    const loading = ref(false);
    const target = ref();
    const viewRows = ref([
      {
        title: '项目名称',
        type: 'text',
        name: 'projectName',
      },
      {
        title: '项目类型',
        type: 'text',
        name: 'projectTypeText',
      },
      {
        title: '项目评级',
        type: 'text',
        name: 'projectGradeText',
      },
      {
        title: '要求日期',
        type: 'text',
        name: 'supportDate',
      },
      {
        title: '项目负责人',
        type: 'text',
        name: 'headUserName',
      },
      {
        title: '状态',
        type: 'status',
        name: 'statusConstant',
      },
      {
        title: '需求内容',
        type: 'content',
        name: 'needDescribe',
      },
    ]);
    const formShow = ref(false);

    const formRows = ref({
      one: [
        {
          title: '支持内容',
          placeholder: '请输入支持内容',
          type: 'textarea',
          name: 'replyContent',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
      ],
    });
    const formData = ref({
      replyContent: undefined,
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

    onLoad((options) => {
    })

    return {
      api,
      targetId,
      loading,
      target,
      viewRows,
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
