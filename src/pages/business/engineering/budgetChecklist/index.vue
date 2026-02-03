<template>
  <blockBudgetChecklist
    :api="api"
    :updateUrl="updateUrl"
    :viewUrl="viewUrl"
  ></blockBudgetChecklist>
</template>


<script>
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted} from 'vue';
import { useStore } from 'vuex';
import blockBudgetChecklist from '@/pages/acommon/budgetChecklist/index.vue';

export default defineComponent({
  components: {
    blockBudgetChecklist,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const api = proxy.$api.engineeringBudget;
    const updateUrl = ref('/pages/business/engineering/budgetChecklist/update');
    const viewUrl = ref('/pages/business/engineering/budgetChecklist/view');

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
