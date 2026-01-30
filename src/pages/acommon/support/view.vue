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
      {
        title: '支持人',
        type: 'text',
        name: 'supportUserName',
      },
      {
        title: '支持时间',
        type: 'text',
        name: 'replyDate',
      },
      {
        title: '支持内容',
        type: 'content',
        name: 'replyContent',
      },
    ]);

    const loadTarget = () => {
      loading.value = true;
      api.view(targetId.value, {}).then((res) => {
        const json = res.result;

        target.value = json;

      }).finally(() => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      });
    }

    onMounted(() => {
      loadTarget();
    });

    onUnmounted(() => {
    })

    onLoad((options) => {
    })

    return {
      api,
      targetId,
      loading,
      target,
      viewRows,
    };
  },
});
</script>

<style scoped lang="less">
</style>
