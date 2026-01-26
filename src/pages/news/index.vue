<template>
  <uPage>
    <view></view>
  </uPage>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import authentication from '@/authentication';

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const user = authentication.user();

    onMounted(async () => {

      // const authenticationGuard = await authentication.build();
      //
      // if (authenticationGuard.check()) {
      //   // uni.reLaunch({
      //   //   url: '/pages/home/index'
      //   // })
      // } else {
      //   uni.reLaunch({
      //     url: '/pages/auth/signin/index'
      //   })
      // }

      //
      // if (user) {

      // } else {

      // }
    });

    return {
      user,
    };
  },
});
</script>

<style scoped lang="less">
</style>
