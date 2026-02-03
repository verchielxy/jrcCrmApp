<template>
  <blockBudgetChecklistView
      :targetId="id"
      :api="api"
      :api2="api2"
  ></blockBudgetChecklistView>
</template>


<script>
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted} from 'vue';
import { useStore } from 'vuex';
import blockBudgetChecklistView from '@/pages/acommon/budgetChecklist/view/index.vue';
import {onLoad} from "@dcloudio/uni-app";

export default defineComponent({
  components: {
    blockBudgetChecklistView,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const id = ref();
    const api = proxy.$api.engineeringBudget;
    const api2 = proxy.$api.engineeringBudgetItem;

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
      api2,
    };
  },
});
</script>

<style scoped lang="less">
</style>
