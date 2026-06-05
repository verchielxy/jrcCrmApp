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

    onMounted(() => {
    });

    onLoad((options) => {
      id.value = options.id;
    })

    return {
      id,
      api,
    };
  },
});
</script>

<style scoped lang="less">
</style>
