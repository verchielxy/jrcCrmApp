<template>
  <div>
    123
  </div>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    onMounted(() => {
    });

    return {
    };
  },
});
</script>

<style scoped lang="less">
</style>
