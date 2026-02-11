<template>
  <blockForm
      :projectId="projectId"
      :targetId="id"
  ></blockForm>
</template>


<script>
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted} from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import blockForm from "./blockForm.vue";

export default defineComponent({
  components: {
    blockForm,
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const projectId = ref();
    const id = ref();

    onMounted(() => {
    });

    onUnmounted(() => {
    })

    onLoad((options) => {
      projectId.value = options.projectId;
    })

    return {
      projectId,
      id,
    };
  },
});
</script>

<style scoped lang="less">
</style>
