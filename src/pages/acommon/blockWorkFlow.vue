<template>
  <view class="timeline-container">
    <view
        v-for="(item, index) in workFlowData"
        :key="item.id"
        class="timeline-item"
    >
      <view class="timeline-left">
        <view class="node-icon-wrap">
          <view v-if="item.status === 'completed'" class="icon-circle bg-green">
            <u-icon name="checkmark" color="#ffffff" size="16"></u-icon>
          </view>
          <view v-else-if="item.status === 'processing'" class="icon-circle bg-blue-loading">
            <view class="loading-quarter"></view>
          </view>
          <view v-else class="icon-circle bg-gray">
            <view class="dot-gray"></view>
          </view>
        </view>

        <view
            v-if="index !== workFlowData.length - 1"
            class="timeline-line"
        ></view>
      </view>

      <view class="timeline-right">
        <view class="right-header">
          <text class="node-name">{{ item.nodeName }}</text>

          <view
              class="status-tag"
              :class="item.status === 'completed' ? 'tag-success' : 'tag-primary'"
          >
            {{ item.status === 'completed' ? '已通过' : '审批中' }}
          </view>
        </view>

        <view class="user-info-row" v-if="item.users && item.users.length">
          <view
              class="avatar"
              :class="item.status === 'completed' ? 'avatar-orange' : 'avatar-blue'"
          >
            {{ getAvatarName(item.users[0]) }}
          </view>
          <text class="user-name">{{ item.users.join(', ') }}</text>
        </view>

        <view class="time-row" v-if="item.time">
          <u-icon name="clock" color="#c0c4cc" size="14"></u-icon>
          <text class="time-text">{{ item.time }}</text>
        </view>

        <view class="message-box" v-if="item.message">
          <u-icon name="chat" color="#2979ff" size="16"></u-icon>
          <text class="message-text">{{ item.message }}</text>
        </view>
      </view>
    </view>
  </view>
</template>


<script>
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted} from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  components: {
  },
  props: {
    workFlowData: {
      type: [Array],
      required: false,
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const workFlowData = toRef(props, 'workFlowData');

    const getAvatarName = (name) => {
      if (!name) return '';
      return name.length > 2 ? name.substring(name.length - 2) : name;
    };

    onMounted(() => {
    });

    onUnmounted(() => {
    })

    return {
      workFlowData,
      getAvatarName,
    };
  },
});
</script>

<style scoped lang="less">
.timeline-container {
  padding: 30rpx;
  background-color: #ffffff;
}

.timeline-item {
  display: flex;
  position: relative;
  margin-bottom: 10rpx;
}

.timeline-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 24rpx;
  position: relative;
  width: 60rpx;
  flex-shrink: 0;

  .node-icon-wrap {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    background-color: #ffffff;
  }

  .icon-circle {
    width: 52rpx;
    height: 52rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .bg-green {
    background-color: #52c41a;
    border: 4rpx solid #a0d911;
  }

  .bg-blue-loading {
    border: 6rpx solid #e6f7ff;
    border-top: 6rpx solid #1890ff;
    animation: rotate 1.5s linear infinite;
  }

  .bg-gray {
    background-color: #f5f5f5;
    border: 2rpx solid #d9d9d9;
    .dot-gray {
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      background-color: #bfbfbf;
    }
  }

  .timeline-line {
    width: 4rpx;
    position: absolute;
    top: 56rpx;
    bottom: -10rpx;
    background-color: #e8e8e8;
    z-index: 1;
  }
}

.timeline-right {
  flex: 1;
  padding-bottom: 40rpx;
  display: flex;
  flex-direction: column;

  .right-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 52rpx;

    .node-name {
      font-size: 32rpx;
      font-weight: bold;
      color: #1f1f1f;
    }

    .status-tag {
      font-size: 24rpx;
      padding: 4rpx 16rpx;
      border-radius: 8rpx;
      font-weight: 500;
    }
    .tag-success {
      background-color: #f6ffed;
      color: #52c41a;
      border: 1px solid #b7eb8f;
    }
    .tag-primary {
      background-color: #e6f7ff;
      color: #1890ff;
      border: 1px solid #91d5ff;
    }
  }

  .user-info-row {
    display: flex;
    align-items: center;
    margin-top: 16rpx;

    .avatar {
      width: 48rpx;
      height: 48rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      color: #ffffff;
      font-weight: 500;
      margin-right: 16rpx;
    }
    .avatar-orange { background-color: #fa8c16; }
    .avatar-blue { background-color: #1890ff; }

    .user-name {
      font-size: 28rpx;
      color: #595959;
    }
  }

  .time-row {
    display: flex;
    align-items: center;
    margin-top: 12rpx;

    .time-text {
      font-size: 26rpx;
      color: #bfbfbf;
      margin-left: 8rpx;
    }
  }

  .message-box {
    display: flex;
    align-items: center;
    margin-top: 20rpx;
    background-color: #e6f7ff;
    border: 1px solid #bae7ff;
    border-radius: 16rpx;
    padding: 16rpx 24rpx;

    .message-text {
      font-size: 28rpx;
      color: #1890ff;
      margin-left: 12rpx;
      font-weight: 500;
    }
  }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
