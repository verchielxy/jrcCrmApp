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

    const api = proxy.$api.auth;
    const target = ref();
    const formRows = ref({
      one: [
        {
          title: '用户头像',
          placeholder: '请上传用户头像',
          type: 'imageUpload',
          name: 'avatar',
          images: [],
          limit: 1,
          valueSingle: false,
        },
        // {
        //   title: '文件',
        //   placeholder: '请上传文件',
        //   type: 'fileUpload',
        //   name: 'file',
        //   files: [],
        //   limit: 1,
        //   valueSingle: false,
        // },
        {
          title: '用户姓名',
          placeholder: '请输入用户姓名',
          type: 'text',
          name: 'realname',
          rule: [
            { required: true, message: '这里需要填写', trigger: ['blur', 'change'] },
          ],
        },
        {
          title: '用户年龄',
          placeholder: '请输入用户年龄',
          type: 'number',
          name: 'age',
        },
        {
          title: '性别',
          placeholder: '请输入性别',
          type: 'radio',
          name: 'sex',
          list: proxy.$constant.USER.SEX,
        },
        // {
        //   title: '学历',
        //   placeholder: '请选择学历',
        //   type: 'radio',
        //   name: 'education',
        //   list: proxy.$constant.USER.EDUCATION,
        //   placement: 'column',
        // },
        // {
        //   title: '职业',
        //   placeholder: '请选择职业',
        //   type: 'select',
        //   name: 'work',
        //   list: proxy.$constant.USER.WORK,
        // },
        {
          title: '生日',
          placeholder: '请输入生日',
          type: 'date',
          name: 'birthday',
        },
        {
          title: '简介',
          placeholder: '请输入用户简介',
          type: 'textarea',
          name: 'desc',
        },
        // {
        //   title: '开关',
        //   type: 'switch',
        //   name: 'switch',
        // },
        // {
        //   title: '数字',
        //   type: 'numberBox',
        //   name: 'numberBox',
        // },
      ],
    });
    const formData = ref({
      realname: undefined,
    })
    const formRules = ref({
      realname: [],
    });
    const formRef = ref();

    const loadTarget = () => {
      api.user().then((res) => {
        const json = res.result;
        target.value = json.userInfo;

        formRows.value.one.map(function (item) {
          if (item.name === 'avatar' && target.value.avatar) {
            formRows.value.one[0].images = [target.value.avatar];
            formData.value.avatar = target.value.avatar;
          }

          formData.value[item.name] = target.value[item.name];
        });

      }).finally(() => {
      });
    };

    const handleSubmit = () => {
      formRef.value.validate().then(valid => {
        if (valid) {
          // console.log('表单数据信息：', valid);

          uni.$u.toast('个人信息修改成功');

          uni.navigateBack({})

        } else {
          uni.$u.toast('校验失败')
        }
      }).catch(() => {
        // 处理验证错误
        uni.$u.toast('校验失败')
      });
    }

    onMounted(async () => {
      loadTarget();
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
