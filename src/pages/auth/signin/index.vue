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

        <!-- 钉钉免密登录中 -->
        <view v-if="isDingtalkLoading" class="dingtalk-loading-box">
          <view class="center py20px">
            <up-loading-icon mode="circle" color="#fff" size="24"></up-loading-icon>
            <text class="c-white mt10px db">钉钉免密登录中...</text>
          </view>
          <view class="center mt15px">
            <text class="switch-link" @click="switchToPassword">使用账号密码登录</text>
          </view>
        </view>

        <!-- 密码登录表单 -->
        <view v-else-if="showPasswordForm" class="login">
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

          <view v-if="isDingtalkEnv" class="center mt15px">
            <text class="switch-link" @click="retryDingtalkLogin">钉钉免密登录</text>
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
import { isInDingtalk, getCorpId, getClientId, requestDingtalkAuthCode } from '@/utils/dingtalkSso';

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    // ============ 钉钉免密登录相关状态 ============
    const isDingtalkEnv = ref(false);
    const isDingtalkLoading = ref(false);
    const showPasswordForm = ref(false);

    // ============ 原有密码登录状态 ============
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

    // ============ 钉钉免密登录方法 ============

    /**
     * 切换到密码登录表单
     */
    const switchToPassword = () => {
      isDingtalkLoading.value = false;
      showPasswordForm.value = true;
    };

    /**
     * 重试钉钉免密登录
     */
    const retryDingtalkLogin = () => {
      showPasswordForm.value = false;
      isDingtalkLoading.value = true;
      handleDingtalkLogin();
    };

    /**
     * 处理钉钉免密登录核心流程
     */
    const handleDingtalkLogin = async () => {
      const corpId = getCorpId();
      const clientId = getClientId();

      if (!corpId || !clientId) {
        uni.$u.toast('钉钉配置缺失，请使用账号密码登录');
        switchToPassword();
        return;
      }

      try {
        const authCode = await requestDingtalkAuthCode(corpId, clientId);
        const res = await proxy.$api.auth.dingtalkLogin(authCode, corpId);

        if (res.success) {
          // 登录成功，存储 token
          await authentication.signinHandle(res);

          // 处理多部门用户
          if (res.result && res.result.multiDepart === 2) {
            const departs = res.result.departs || [];
            const userInfo = res.result.userInfo || {};
            handleMultiDepart(departs, userInfo);
          } else {
            // 单部门用户，直接跳转
            uni.$u.toast('登录成功');
            uni.reLaunch({
              url: redirect.value,
            });
          }
        } else {
          uni.$u.toast(res.message || '钉钉免密登录失败，请使用账号密码登录');
          switchToPassword();
        }
      } catch (err) {
        console.error('[dingtalk-sso]', err);
        uni.$u.toast('钉钉免密登录失败，请使用账号密码登录');
        switchToPassword();
      }
    };

    /**
     * 处理多部门用户选择
     */
    const handleMultiDepart = (departs, userInfo) => {
      if (!departs || departs.length === 0) {
        uni.reLaunch({
          url: redirect.value,
        });
        return;
      }

      const departNames = departs.map(d => d.departName);

      uni.showActionSheet({
        itemList: departNames,
        title: '请选择所属部门',
        success: (res) => {
          const selected = departs[res.tapIndex];
          proxy.$api.auth.selectDepart({
            username: userInfo.username,
            orgCode: selected.orgCode,
          }).then(() => {
            // 重新获取用户信息
            authentication.getUserInfo().then(() => {
              uni.$u.toast('登录成功');
              uni.reLaunch({
                url: redirect.value,
              });
            });
          }).catch((err) => {
            uni.$u.toast(err.message || '部门选择失败');
          });
        },
        fail: () => {
          // 用户取消选择，默认跳转
          uni.reLaunch({
            url: redirect.value,
          });
        },
      });
    };

    // ============ 原有密码登录方法 ============

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

      // 检测钉钉环境
      isDingtalkEnv.value = isInDingtalk();

      if (isDingtalkEnv.value) {
        // 在钉钉内，自动触发免密登录
        isDingtalkLoading.value = true;
        handleDingtalkLogin();
      } else {
        // 不在钉钉内，直接显示密码表单
        showPasswordForm.value = true;
      }

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
      // 钉钉相关
      isDingtalkEnv,
      isDingtalkLoading,
      showPasswordForm,
      switchToPassword,
      retryDingtalkLogin,
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
.switch-link {
  color: #fff;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
  opacity: 0.9;

  &:active {
    opacity: 0.7;
  }
}
.dingtalk-loading-box {
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  text-align: center;
}
</style>