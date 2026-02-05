<template>
  <uPage>
    <view class="bg-white p20px">
      <up-form :model="formData" :rules="formRules" ref="formRef">
        <vFormRow
            :rows="formRows.one"
            v-model:formData="formData"
            :labelWidth="80"
            :onlyText="false"
        ></vFormRow>

        <up-button class="mt10px" type="success" @click="handleSubmit">保存</up-button>
      </up-form>
    </view>
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

    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请确认密码'))
      } else if (value !== formData.value.password) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }

    const api = proxy.$api.auth;
    const formRows = ref({
      one: [
        {
          title: '原密码',
          placeholder: '请输入原密码',
          type: 'password',
          name: 'oldPassword',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
        {
          title: '新密码',
          placeholder: '请输入新密码',
          type: 'password',
          name: 'password',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
        {
          title: '重复密码',
          placeholder: '请输入重复密码',
          type: 'password',
          name: 'confirmPassword',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
            { validator: validateConfirmPassword }
          ],
        },
      ],
    });
    const formData = ref({
      oldPassword: undefined,
      password: undefined,
      confirmPassword: undefined,
    })
    const formRules = ref({
      oldPassword: [],
      password: [],
      confirmPassword: [],
    });
    const formRef = ref();

    const handleSubmit = () => {
      formRef.value.validate().then(valid => {
        if (valid) {
          uni.showLoading({
            title: '正在提交...',
            mask: true
          });

          proxy.$api.auth.updatePassword(formData.value).then((res) => {
            // console.log(res)
            setTimeout(() => {
              uni.hideLoading();

              uni.showToast({
                title: '密码修改成功',
                icon: 'success', // 显示绿色的勾
                duration: 1500,
                mask: true,
                success: () => {
                  setTimeout(() => {
                    uni.navigateBack();
                  }, 1500);
                }
              });
            }, 1000);
          });

        } else {
          uni.$u.toast('校验失败')
        }
      }).catch(() => {
        // 处理验证错误
        uni.$u.toast('校验失败')
      });
    }

    onMounted(async () => {

    });

    return {
      user,
      formRows,
      formData,
      formRules,
      formRef,
      handleSubmit,
    };
  },
});
</script>

<style scoped lang="less">

</style>
