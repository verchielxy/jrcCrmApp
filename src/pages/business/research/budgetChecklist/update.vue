<template>
  <blockBudgetChecklistUpdate
      :targetId="id"
      :api="api"
      :api2="api2"
  ></blockBudgetChecklistUpdate>
</template>


<script>
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted} from 'vue';
import { useStore } from 'vuex';
import blockBudgetChecklistUpdate from '@/pages/acommon/budgetChecklist/update/index.vue';
import { onLoad } from "@dcloudio/uni-app";

export default defineComponent({
  components: {
    blockBudgetChecklistUpdate,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const id = ref();
    const api = proxy.$api.researchBudget;
    const api2 = proxy.$api.researchBudgetItem;

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
