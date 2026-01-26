<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>

    <uni-section title="多行文本" subTitle="指定属性 type=textarea 使用多行文本框" type="line" padding>
      <uni-easyinput type="textarea" v-model="value" placeholder="请输入内容"></uni-easyinput>
    </uni-section>

<!--    昵称：{{ nickName }}-->

  </view>
</template>

<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();

    const title = ref('hello');
    const value = ref('');
    const nickName = ref('');

    onMounted(() => {
      // uni.login({
      //   provider: "weixin",
      //   success(res) {
      //     console.log("微信登录成功，code:", res.code);
      //     const code = res.code; // 服务器需要用这个 code 获取 openid 和 session_key
      //
      //     // 调用方法获取用户信息
      //     uni.getUserInfo({
      //       provider: 'weixin',
      //       success: function (infoRes) {
      //         nickName.value = infoRes.userInfo.nickName;
      //         console.log('用户昵称为：' + infoRes.userInfo.nickName);
      //       }
      //     });
      //   },
      //   fail(err) {
      //     console.error("微信登录失败", err);
      //   }
      // });

    });

    return {
      title,
      value,
      nickName,
    };
  },
});
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
