<template>
  <blockView
    :apiView="api.view"
    :id="id"
  >
    <template #operationBox="{ target }">
    </template>
  </blockView>

  <up-modal
      :show="modalShow"
      :title="modalTitle"
      showCancelButton
      @confirm="handleReview()"
      @cancel="modalShow = false"
  >
    <view class="full-width">
      <up-textarea
          v-model="modalParams.reason"
          :placeholder="modalTitle"
          count
          maxlength="200"
          height="100"
          :fixed="true"
      ></up-textarea>
    </view>
  </up-modal>
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
    const loading = ref(false);
    const target = ref();
    const modalShow = ref(false);
    const modalType = ref(1);
    const modalTitle = ref();
    const modalParams = ref({
      reason: null,
    });

    const handleReview = () => {
    }

    onMounted(() => {
    });

    onLoad((options) => {
      id.value = options.id;

      const stored = uni.getStorageSync('currentItem');
      if (stored) {
        const item = JSON.parse(stored)
        store.commit('setCurrentItem', item)
        target.value = item;
      }
    })

    return {
      id,
      api,
      modalShow,
      modalType,
      modalTitle,
      modalParams,
      handleReview,
    };
  },
});
</script>

<style scoped lang="less">
</style>
