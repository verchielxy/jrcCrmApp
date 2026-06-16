<template>
  <view class="timeline-container">
    <view v-for="(item, index) in workFlowData" :key="item.id" class="timeline-item">
      <view class="timeline-left">
        <view class="node-icon-wrap">
          <template v-if="statusConfigs[item.status]">
            <view class="icon-circle" :style="{
              borderColor: statusConfigs[item.status].color,
            }">
              <view class="inner" :style="{
                backgroundColor: statusConfigs[item.status].color,
              }">
                <u-icon :name="statusConfigs[item.status].uIcon" color="#ffffff" size="16" v-if="statusConfigs[item.status].uIcon"></u-icon>
              </view>
            </view>
          </template>

          <template v-else>
            <view class="icon-circle">
              <view class="inner">
                <view class="dot-gray"></view>
              </view>
            </view>
          </template>
        </view>

        <view
            v-if="index !== workFlowData.length - 1"
            class="timeline-line"
        ></view>
      </view>

      <view class="timeline-right">
        <view class="right-header">
          <text class="node-name">{{ item.nodeName }}</text>

          <template v-if="statusConfigs[item.status]">
            <view :class="['status-tag', 'status-tag-' + statusConfigs[item.status].key]">
              {{ statusConfigs[item.status].title }}
            </view>
          </template>
        </view>

        <view class="user-info-row" v-if="item.users && item.users.length">
          <view class="avatar" :style="{
            backgroundColor: avatarColors[index % avatarColors.length],
          }">
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

    const statusConfigs = ref({
      pending: {
        key: 'pending',
        title: '审批中',
        color: '#1677ff',
        uIcon: 'play-right-fill',
      },
      completed: {
        key: 'completed',
        title: '已通过',
        color: '#52c41a',
        uIcon: 'checkmark',
      },
      rejected: {
        key: 'rejected',
        title: '已驳回',
        color: '#ff4d4f',
        uIcon: 'close',
      },
    });
    const avatarColors = ref([
      '#1677FF',
      '#52C41A',
      '#FAAD14',
      '#EB2F96',
    ]);

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
      statusConfigs,
      avatarColors,
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
    display: block;
    width: 52rpx;
    height: 52rpx;
    border-radius: 50%;
    border-width: 2px;
    border-style: solid;
    background-color: #fff;

    .inner {
      display: flex;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      border: 2px solid #fff;
      background-color: #fff;

      .dot-gray {
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        background-color: #bfbfbf;
      }
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
      border-width: 1px;
      border-style: solid;
    }
    .status-tag-pending {
      color: #1677ff;
      background-color: #e6f4ff;
      border-color: #91caff;
    }
    .status-tag-rejected {
      color: #ff4d4f;
      background-color: #fff2f0;
      border-color: #ffccc7;
    }
    .status-tag-completed {
      color: #52c41a;
      background-color: #f6ffed;
      border-color: #b7eb8f;
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
