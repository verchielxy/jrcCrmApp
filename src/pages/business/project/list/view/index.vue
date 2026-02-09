<template>
  <uContainer style="padding-bottom: 70px;">
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="bg-white" v-if="target">
      <u-title class="p10px">项目详情</u-title>
      <vViewRow
          :rows="viewRows"
          v-model:formData="target"
          labelWidth="105px"
          size="small"
          class="mb20px"
      >
        <template #provinces="{ list }">
          <view class="right">
            <text class="ml5px" v-for="item in list">
              {{ item.name }}
            </text>
          </view>
        </template>
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
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const id = ref();

    const api = proxy.$api.project;
    const loading = ref(false);
    const target = ref();

    const viewRows = ref([
      {
        title: '项目名称',
        type: 'text',
        name: 'name',
      },
      {
        title: '项目类型',
        type: 'text',
        name: 'typeText',
      },
      {
        title: '项目评级',
        type: 'text',
        name: 'gradeText',
      },
      {
        title: '客户名称',
        type: 'text',
        name: 'customName',
      },
      {
        title: '客户电话',
        type: 'text',
        name: 'contactsPhone',
      },
      {
        title: '客户名称',
        type: 'text',
        name: 'customName',
      },
      {
        title: '负责人',
        type: 'text',
        name: 'headUserName',
      },
      {
        title: '线索日期',
        type: 'text',
        name: 'clueDate',
      },
      {
        title: '备注',
        type: 'content',
        name: 'remarks',
      },
    ]);

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
    };
  },
});
</script>

<style scoped lang="less">
</style>
