<template>
  <blockView
    :apiView="api.view"
    :id="id"
  ></blockView>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import blockView from '@/pages/business/review/blockView/index.vue';

export default defineComponent({
  components: {
    blockView,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const id = ref();

    const api = proxy.$api.workFlow;
    const target = ref();
    const modalShow = ref(false);
    const modalType = ref(1);
    const modalTitle = ref();
    const modalParams = ref({
      reason: null,
    });

    onMounted(() => {
    });

    onLoad((options) => {
      id.value = options.id;

      const stored = uni.getStorageSync('currentItem');
      if (stored) {
        const item = JSON.parse(stored);
        store.commit('setCurrentItem', item);
        target.value = item;
      }
    })

    return {
      id,
      api,
      target,
      modalShow,
      modalType,
      modalTitle,
      modalParams,
    };
  },
});
</script>

<style scoped lang="less">
</style>
