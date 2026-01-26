<template>
  <uPage class="my-page">
    <view class="user-info px20px">
      <view class="c-white full-width">
        <view class="flex-row">
          <view class="left-fixed">
            <up-avatar :src="$imageUrl(user.avatar)" size="70"></up-avatar>
          </view>
          <view class="right-auto">
            <view>
              <text class="font-bold font18px mr10px">
                {{ user.realname }}
              </text>
              <text class="pull-right">
                <up-tag :text="user.department?.departName" size="mini" type="success"></up-tag>
              </text>
            </view>
            <view>
              <text class="text-xl">ID：{{ user.username }}</text>
              <text class="pull-right">
                <up-tag :text="user.role?.roleName" size="mini" type="warning"></up-tag>
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="bg-white">
      <up-cell-group>
        <up-cell title="用户账号" isLink url="/pages/base/profile/edit">
          <template #value>
            <text class="right-text">{{ user.username }}</text>
          </template>
        </up-cell>

        <up-cell title="用户密码" isLink url="/pages/base/profile/updatePassword">
          <template #value>
            <text class="right-text">修改密码</text>
          </template>
        </up-cell>

        <up-cell title="用户部门">
          <template #value>
            <text class="right-text">{{ user.department.departName }}</text>
          </template>
        </up-cell>

        <up-cell title="用户角色">
          <template #value>
            <text class="right-text">{{ user.role.roleName }}</text>
          </template>
        </up-cell>

        <up-cell title="用户姓名">
          <template #value>
            <text class="right-text">{{ user.realname }}</text>
          </template>
        </up-cell>

        <up-cell title="登录日志" isLink>
          <template #value>
            <text class="right-text">查看日志</text>
          </template>
        </up-cell>

        <up-cell title="软件版本" isLink>
          <template #value>
            <text class="right-text">1.0.0</text>
          </template>
        </up-cell>
      </up-cell-group>

      <view class="p20px">
        <up-button type="primary" text="退出" @click="handleLogout"></up-button>
      </view>
    </view>
  </uPage>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import authentication from '@/authentication';
import { onPullDownRefresh } from '@dcloudio/uni-app';

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const user = authentication.user();

    const handlePassword = () => {
      uni.navigateTo({
        url: '/pages/base/updatePassword/index',
      })
    }

    const handleLogout = () => {
      authentication.signoutHandle();
    }

    onMounted(async () => {

    });

    onPullDownRefresh(async () => {
      // console.log('用户下拉了页面！')

      await authentication.getUserInfo();

      // 模拟异步刷新，比如重新请求数据
      setTimeout(() => {
        // 刷新完成，停止下拉动画
        uni.stopPullDownRefresh()
      }, 1000)
    })

    return {
      user,
      handleLogout,
      handlePassword,
    };
  },
});
</script>

<style scoped lang="less">
.my-page {
  /deep/ .u-cell__title-text {
    color: #333333;
  }
  .right-text {
    font-size: 14px;
    color: #717171;
  }

  .user-info {
    display: flex;
    align-items: center;
    height: 140px;
    background: linear-gradient(to right, #365fff, #36bbff);
  }

  .flex-row {
    display: flex;
    align-items: center;
  }
  .left-fixed {
    width: 90px; /* 或 min-width/固定 px */
  }
  .right-auto {
    flex: 1;
  }
}

</style>
