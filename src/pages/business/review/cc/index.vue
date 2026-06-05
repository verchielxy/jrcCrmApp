<template>
  <blockList
    :apiGet="api.cc"
    :viewUrl="viewUrl"
  ></blockList>
</template>


<script>
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted} from 'vue';
import { useStore } from 'vuex';
import blockList from "@/pages/business/review/blockList/index.vue";

export default defineComponent({
  components: {
    blockList,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const api = proxy.$api.workFlow;

    const viewUrl = ref('/pages/business/review/cc/view');

    onMounted( () => {
    });

    onUnmounted(() => {
    })

    return {
      api,
      viewUrl,
    };
  },
});
</script>

<style scoped lang="less">
</style>
