<template>
  <blockSupport
    :api="api"
    :updateUrl="updateUrl"
    :viewUrl="viewUrl"
  ></blockSupport>
</template>


<script>
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted} from 'vue';
import { useStore } from 'vuex';
import blockSupport from '@/pages/acommon/support/index.vue';

export default defineComponent({
  components: {
    blockSupport,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const api = proxy.$api.energySupport;
    const updateUrl = ref('/pages/business/energy/support/update');
    const viewUrl = ref('/pages/business/energy/support/view');

    onMounted( () => {
    });

    onUnmounted(() => {
    })

    return {
      api,
      updateUrl,
      viewUrl,
    };
  },
});
</script>

<style scoped lang="less">
</style>
