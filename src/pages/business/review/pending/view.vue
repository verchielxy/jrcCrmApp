<template>
  <blockView
      :apiView="api.view"
      :id="id"
  >
    <template #operationBox="{ target }">
      <view class="bg-white p20px">
        <up-row :gutter="20">
          <up-col :span="6">
            <up-button type="success" @click="handleAgree">同意</up-button>
          </up-col>
          <up-col :span="6">
            <up-button @click="handleDisagree">不同意</up-button>
          </up-col>
        </up-row>
      </view>
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
    const target = ref();
    const modalShow = ref(false);
    const modalType = ref(1);
    const modalTitle = ref();
    const modalParams = ref({
      reason: null,
    });

    const handleAgree = () => {
      modalShow.value = true;
      modalType.value = 1;
      modalTitle.value = '填写审批意见';
      modalParams.value.reason = '';
    };

    const handleDisagree = () => {
      modalShow.value = true;
      modalType.value = 0;
      modalTitle.value = '填写驳回理由';
      modalParams.value.reason = '';
    };

    const handleReview = () => {
      if (modalType.value === 0 && !modalParams.value.reason) {
        uni.showToast({
          title: '不同意时，请输入不同意的理由和意见',
          icon: 'none', // 'none' 不显示图标，'error' 在某些平台显示感叹号/叉号
          duration: 2000
        });
      } else {

        uni.showLoading({
          title: '正在提交...',
          mask: true
        });

        if (modalType.value === 0) {
          api.disagree(id.value, {
            reason: modalParams.value.reason,
          }).then((res) => {
            let json = res.result;

            uni.hideLoading();

            uni.showToast({
              title: '保存成功',
              icon: 'success', // 显示绿色的勾
              duration: 2000,
              success: () => {
                // 如果需要保存后返回上一页，可以在这里写逻辑
                setTimeout(() => {
                  uni.$emit('REFRESH_LIST');
                  uni.navigateBack();
                }, 1000);
              }
            });
          }).catch((error) => {
          }).finally(() => {
          });
        } else if (modalType.value === 1) {
          api.agree(id.value, {
            message: modalParams.value.reason,
          }).then((res) => {
            let json = res.result;

            uni.hideLoading();

            uni.showToast({
              title: '保存成功',
              icon: 'success', // 显示绿色的勾
              duration: 2000,
              success: () => {
                // 如果需要保存后返回上一页，可以在这里写逻辑
                setTimeout(() => {
                  uni.$emit('REFRESH_LIST');
                  uni.navigateBack();
                }, 1000);
              }
            });
          }).catch((error) => {
          }).finally(() => {
          });
        }
      }
    };

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
      handleAgree,
      handleDisagree,
      handleReview,
    };
  },
});
</script>

<style scoped lang="less">
</style>
