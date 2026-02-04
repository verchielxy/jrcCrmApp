<template>
  <uContainer class="p10px" style="padding-bottom: 50px;">
    <view class="section" v-if="menus.main && menus.main.length > 0">
      <view class="section-title">
        <u-title>我的应用</u-title>
      </view>

      <view class="menu-ul">
        <template v-for="item in menus.main">
          <view class="menu-li" v-if="!item.hide">
            <view class="menu-item center" @click="handleClick(item)">
              <view class="menu-avatar-box mb5px">
                <view class="menu-image center" v-if="item.image">
                  <up-image :src="item.image" width="100%" height="100%" mode="aspectFill" :lazy-load="true"></up-image>
                </view>
                <view clas="menu-icon" v-else>
                  <MaterialSymbol class="middle-icon c-success" :name="item.icon" :size="40" type="sharp" />
                </view>
              </view>
              <view class="title">
                {{ item.name }}
              </view>
            </view>
          </view>
        </template>
      </view>
    </view>

    <template v-for="menu in menus.list">
      <view class="section" v-if="!menu.hide">
        <view class="section-title">
          <u-title>{{ menu.title }} {{ menu.hide }}</u-title>
        </view>

        <view class="menu-ul">
          <template v-for="item in menu.children">
            <view class="menu-li" v-if="!item.hide">
              <view class="menu-item center" @click="handleClick(item)">
                <view class="menu-avatar-box mb5px">
                  <view class="menu-image center" v-if="item.image">
                    <up-image :src="item.image" width="100%" height="100%" mode="aspectFill" :lazy-load="true"></up-image>
                  </view>
                  <view clas="menu-icon" v-else>
                    <MaterialSymbol class="middle-icon c-success" :name="item.icon" :size="50" type="sharp" />
                  </view>
                </view>
                <view class="title">
                  {{ item.name }}
                </view>
              </view>
            </view>
          </template>
        </view>
      </view>
    </template>
  </uContainer>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import authentication from '@/authentication';
import { isNullOrUndefined } from '@utils/tools';
import jumpTo from '@utils/jumpTo';

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const user = authentication.user();
    const menus = authentication.menus();

    // console.log(menus.value);

    const handleClick = (item) => {
      if (item.url) {
        uni.navigateTo({
          url: item.url,
        });
      } else if (item.scan) {
        handleScan(item);
      }
    }

    const handleScan = (item) => {
      uni.scanCode({
        onlyFromCamera: true,
        success: function(res) {
          if(res && res.result) {
            jumpTo({
              url: '/pages/equipment/view',
              params: {
                id: res.result,
              }
            })
          }
        }
      })
    }

    onMounted(async () => {

      if (isNullOrUndefined(authentication.token())) {
        uni.reLaunch({
          url: '/pages/auth/signin/index'
        })
      }

    });

    return {
      menus,
      handleClick,
    };
  },
});
</script>

<style scoped lang="less">
.section {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 10px;

  .section-title {
    padding: 10px;
  }
}

.menu-ul {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .menu-li {
    width: 25%;
  }
}
.menu-item {
  background-color: #fff;
  padding: 10px;

  .menu-avatar-box {
    display: block;

    .menu-image {
      display: block;
      margin: 0 auto;
      width: 50px;
      height: 50px;
    }

    .menu-icon {
      display: block;
      margin: 0 auto;
      width: 50px;
      height: 50px;
    }
  }

  .title {
    font-size: 14px;
  }
}
</style>
