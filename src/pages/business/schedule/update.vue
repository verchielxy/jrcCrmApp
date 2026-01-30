<template>
  <blockForm
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

    const id = ref();

    onMounted(() => {
    });

    onUnmounted(() => {
    })

    onLoad((options) => {
      id.value = options.id;
    })

    return {
      id,
    };
  },
});
</script>

<style scoped lang="less">
</style>
