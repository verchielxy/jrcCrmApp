<template>
  <blockSupportUpdate
      :targetId="id"
      :api="api"
  ></blockSupportUpdate>
</template>


<script>
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted} from 'vue';
import { useStore } from 'vuex';
import blockSupportUpdate from '@/pages/acommon/support/update.vue';
import { onLoad } from "@dcloudio/uni-app";

export default defineComponent({
  components: {
    blockSupportUpdate,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const id = ref();
    const api = proxy.$api.engineeringSupport;

    onMounted( () => {
    });

    onUnmounted(() => {
    })

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
