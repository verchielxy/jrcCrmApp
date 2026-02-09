<template>
  <view class="full-page">
    <view class="inner">
      <view class="form-box">
        <view class="title">
          <up-image src="/static/images/auth/title.png" mode="widthFix" style="width: 100%; height: auto;"></up-image>
          <view class="title-text">
            {{ configs.websiteInfos.loginTitle }}
          </view>
        </view>

        <view class="login">
          <view class="center py10px">
            <view class="image">
              <up-image :show-loading="true" shape="square" src="/static/images/auth/user.png" width="50px" height="50px">
              </up-image>
            </view>
          </view>

          <up-form :model="formData" :rules="formRules" :labelWidth="60" labelAlign="center" :labelStyle="{'color':'#fff'}" ref="formRef">
            <up-form-item prop="username">
              <up-input type="text" v-model="formData.username" placeholder="请输入用户名" color="#fff" :placeholderStyle="{'color':'#fff'}" border="bottom">
                <template #prefix>
                  <text class="c-white pr10px">
                    <MaterialSymbol class="middle-icon" name="person" :size="22" type="sharp"></MaterialSymbol>
                  </text>
                </template>
              </up-input>
            </up-form-item>
            <up-form-item prop="password">
              <up-input type="password" v-model="formData.password" placeholder="请输入密码" color="#fff" :placeholderStyle="{'color':'#fff'}" border="bottom">
                <template #prefix>
                  <text class="c-white pr10px">
                    <MaterialSymbol class="middle-icon" name="lock" :size="22" type="sharp"></MaterialSymbol>
                  </text>
                </template>
              </up-input>
            </up-form-item>
            <up-form-item prop="captcha">
              <view class="display-flex-center">
                <up-input type="text" v-model="formData.captcha" placeholder="请输入验证码" color="#fff" maxlength="4" :placeholderStyle="{'color':'#fff'}" border="bottom">
                  <template #prefix>
                    <text class="c-white pr10px">
                      <MaterialSymbol class="middle-icon" name="vpn_key" :size="22" type="sharp"></MaterialSymbol>
                    </text>
                  </template>
                </up-input>

                <view class="pl5px">
                  <a class="db cursor-pointer" @click="captchaRefresh">
                    <img height="35" :src="captcha" alt="">
                  </a>
                </view>
              </view>
            </up-form-item>
          </up-form>

          <view class="mt10px">
            <up-button type="primary" @click="handleSubmit">登 录</up-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import authentication from '@/authentication';
import configs from "@/config/configs";
import moment from 'moment';
import authConfig from '@/config/auth'

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const captchaKey = moment().format('YYYY-MM-DD HH:mm:ss');
    const captcha = ref();
    const formRef = ref();
    const formRules = ref({
      username: [
        {
          required: true,
          message: '请输入用户名',
        },
      ],
      password: [
        {
          required: true,
          message: '请输入密码',
        },
      ],
      captcha: [
        {
          required: true,
          message: '请输入验证码',
        },
      ],
    });
    const formData = reactive({
      username: '',
      password: '',
      captcha: '',
      cid: undefined,
    });

    const redirect = ref(configs.loginOptions.redirectPage);

    const captchaRefresh = () => {
      proxy.$api.auth.captcha(captchaKey).then((res) => {
        captcha.value = res.result
      }).finally(() => {
        // formData.captcha = undefined;
      });
    }

    const handleSubmit = () => {
      formRef.value.validate().then(valid => {
        if (valid) {
          login()
        } else {
          uni.$u.toast('校验失败')
        }
      }).catch(() => {
        // 处理验证错误
        uni.$u.toast('校验失败')
      });
    }

    const login = () => {
      proxy.$api.auth.signin(
          formData.username,
          formData.password,
          formData.captcha,
          captchaKey,
          formData.cid,
      ).then(async (res) => {
        // console.log(res)
        await authentication.signinHandle(res);

        uni.$u.toast('亲爱的用户，欢迎您回来');

        uni.reLaunch({
          url: redirect.value,
        })

      }).finally(() => {
        captchaRefresh();
      });
    };

    onMounted(() => {
      const pages = getCurrentPages();
      const current = pages[pages.length - 1];
      if (current.options && current.options.redirect) {
        redirect.value = decodeURIComponent(current.options.redirect);
      }

      uni.getPushClientId({
        success: (res) => {
          formData.cid = res.cid;
          // console.log(res.cid)
        },
        fail(err) {
          console.log(err)
        }
      })

      captchaRefresh();
    });

    return {
      configs,
      captcha,
      formRef,
      formRules,
      formData,
      captchaRefresh,
      handleSubmit,
    }
  },
});
</script>

<style scoped lang="less">
.full-page {
  background-image: url("@/static/images/auth/bg2.jpeg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.title {
  display: block;
  max-width: 100%;
  position: relative;
  // margin-bottom: -20px;

  .title-text {
    color: #fff;
    font-size: 17px;
    position: absolute;
    bottom: 20%;
    left: 28%;
  }
}
.image {
  display: inline-block;
  border: 2px solid #fff;
  padding: 17px;
  border-radius: 50%;
  background-color: rgba(255,255,255,0.3);
  opacity: 0.8;
}
.form-box {
  display: block;
  position: absolute;
  min-width: 310px;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);

  .login {
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 15px;
  }
}
.u-border-bottom {
  border-color: rgba(255,255,255,0.8)!important;
}
</style>
