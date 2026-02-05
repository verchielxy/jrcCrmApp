<template>
  <uContainer style="padding-bottom: 70px;">
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="bg-white" v-if="target">
      <u-title class="p10px">客户联系人详情</u-title>
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
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const id = ref();

    const api = proxy.$api.customerContact;
    const loading = ref(false);
    const target = ref();

    const viewRows = ref([
      {
        title: '客户',
        type: 'text',
        name: 'customName',
      },
      {
        title: '姓名',
        type: 'text',
        name: 'contactsName',
      },
      {
        title: '电话',
        type: 'text',
        name: 'phone',
      },
      {
        title: '决策人',
        type: 'text',
        name: 'decisionMakerText',
      },
      {
        title: '部门',
        type: 'content',
        name: 'department',
      },
      {
        title: '职务',
        type: 'text',
        name: 'position',
      },
      {
        title: '微信',
        type: 'text',
        name: 'wechat',
      },
      {
        title: 'QQ',
        type: 'text',
        name: 'qq',
      },
      {
        title: '备注',
        type: 'content',
        name: 'remarks',
      },
      {
        title: '生日',
        type: 'text',
        name: 'birthday',
      },
      {
        title: '性别',
        type: 'text',
        name: 'sexText',
      },
      {
        title: '住址',
        type: 'content',
        name: 'addr',
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
