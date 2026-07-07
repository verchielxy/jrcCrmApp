<template>
  <uContainer style="padding-bottom: 20px;">
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view v-if="target">
      <view class="bg-white mb10px">
        <u-title class="p10px">项目详情</u-title>
        <vViewRow
            :rows="viewRows"
            v-model:formData="target"
            labelWidth="105px"
            size="small"
            class="mb20px"
        >
        </vViewRow>
      </view>

      <view class="bg-white mb10px">
        <u-title class="p10px">项目启动会</u-title>
        <vViewRow
            :rows="viewMeetingRows"
            v-model:formData="target.meeting"
            labelWidth="105px"
            size="small"
            class="mb20px"
        >
        </vViewRow>
      </view>
    </view>
  </uContainer>
</template>


<script>
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted} from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import dataViewRowsIndex from './dataViewRows';
import dataViewRowsMeeting from './dataViewRows/meeting';

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const id = ref();

    const api = proxy.$api.engineeringProject;
    const loading = ref(false);
    const target = ref();

    const viewRows = ref(dataViewRowsIndex);
    const viewMeetingRows = ref(dataViewRowsMeeting);

    const loadTarget = () => {
      loading.value = true;
      api.view(id.value, {}).then((res) => {
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
      id.value = options.id;
    })

    return {
      id,
      api,
      loading,
      target,
      viewRows,
      viewMeetingRows,
    };
  },
});
</script>

<style scoped lang="less">
::v-deep .u-modal__content {
  display: block;
  padding: 0 !important; /* 强制将默认的 25px padding 清空 */
}
.modal-scroll-area {
  max-height: 60vh;
  width: 100%;
}
</style>
