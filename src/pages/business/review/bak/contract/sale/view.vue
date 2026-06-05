<template>
  <blockView
    :api="api"
    :id="id"
    :tab="tab"
  ></blockView>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import blockView from '../blockView.vue';

export default defineComponent({
  components: {
    blockView,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const id = ref();
    const tab = ref();

    const api = proxy.$api.reviewSaleContract;

    onMounted(() => {
    });

    onLoad((options) => {
      id.value = options.id;
      tab.value = options.tab;
    })

    return {
      id,
      tab,
      api,
    };
  },
});
</script>

<style scoped lang="less">
</style>
