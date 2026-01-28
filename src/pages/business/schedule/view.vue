<template>
  <uContainer style="padding-bottom: 70px;">
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="bg-white" v-if="target">
      <u-title class="p10px">日程详情</u-title>
      <vViewRow
          :rows="viewRows"
          v-model:formData="target"
          labelWidth="105px"
          size="small"
          class="mb20px"
      >
        <template #contractReview="{ list }">
          <view>
            <view class="mb5px font12px" v-for="item in list">
              {{ item.endTime }} {{ item.approvalStage }} - <text :class="item.status ? 'c-success':'c-error'">{{ item.opinion }}</text>
            </view>
          </view>
        </template>
      </vViewRow>
    </view>
  </uContainer>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import scheduleConfig from '@/config/business/schedule';

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const id = ref();

    const api = proxy.$api.schedule;
    const loading = ref(false);
    const target = ref();

    const viewRows = ref([
      {
        title: '',
        type: 'text',
        name: 'title',
      },
      {
        title: '日期',
        type: 'text',
        name: 'flowDate',
      },
      {
        title: '时间',
        type: 'slot',
        name: 'startTimeAndEndTime',
        slot: 'startTimeAndEndTime',
      },
      {
        title: '跟进类型',
        type: 'text',
        name: 'categoryText',
      },
      {
        title: '提醒设置',
        type: 'text',
        name: 'remindSetText',
      },
      {
        title: '创建人',
        type: 'text',
        name: 'createUserName',
      },
      {
        title: '参与人',
        type: 'text',
        name: 'partnerUserName',
      },
      {
        title: '日程内容',
        type: 'content',
        name: 'content',
      },
      {
        title: '日程记录',
        type: 'content',
        name: 'flowContent',
      },
    ]);

    const getTarget = () => {
      loading.value = true;
      api.view(id.value, {}).then((res) => {
        const json = res.result;

        target.value = json;

        viewRows.value[0].title = scheduleConfig.titleName(json);

      }).finally(() => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      });
    }

    onMounted(() => {
      getTarget();
    });

    onLoad((options) => {
      id.value = options.id;
    })

    return {
      id,
      api,
      loading,
      target,
      viewRows,
    };
  },
});
</script>

<style scoped lang="less">
</style>
