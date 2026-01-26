<template>
  <uPage>
    <view class="section">
      <view class="section-title p10px bg-info c-white">
        我的应用
      </view>

      <view class="menu-ul">
        <view class="menu-li" v-for="item in menus.main">
          <view class="menu-block center" @click="handleClick(item)">
            <MaterialSymbol class="middle-icon mt20px c-success" :name="item.icon" :size="40" type="sharp"></MaterialSymbol>
            <view class="title mt5px">
              {{ item.name }}
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="section" v-for="menu in menus.list">
      <view class="section-title p10px bg-info c-white">
        {{ menu.title }}
      </view>

      <view class="menu-ul">
        <view class="menu-li" v-for="item in menu.children">
          <view class="menu-block center" @click="handleClick(item)">
            <MaterialSymbol class="middle-icon mt20px c-success" :name="item.icon" :size="40" type="sharp"></MaterialSymbol>
            <view class="title mt5px">
              {{ item.name }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </uPage>
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

    console.log(menus.value);

    // const menus = ref([
    //   {
    //     title: '设备与巡检',
    //     list: [
    //       {
    //         name: '设备列表',
    //         icon: 'component_exchange',
    //         url: '/pages/equipment/index',
    //       },
    //       {
    //         name: '设备扫码',
    //         icon: 'qr_code_scanner',
    //         scan: true,
    //       },
    //       {
    //         name: '我的巡检',
    //         icon: 'content_paste_search',
    //         url: '/pages/my/check/index',
    //       },
    //       {
    //         name: '巡检记录',
    //         icon: 'event_note',
    //         url: '/pages/check/index',
    //       },
    //     ],
    //   },
    //   {
    //     title: '保养与维修',
    //     list: [
    //       {
    //         name: '我的保养',
    //         icon: 'model_training',
    //         url: '/pages/my/maintain/index',
    //       },
    //       {
    //         name: '保养记录',
    //         icon: 'list_alt',
    //         url: '/pages/maintain/index',
    //       },
    //       {
    //         name: '我的维修',
    //         icon: 'handyman',
    //         url: '/pages/my/repair/index',
    //       },
    //       {
    //         name: '维修记录',
    //         icon: 'receipt_long',
    //         url: '/pages/repair/index',
    //       },
    //     ]
    //   },
    //   {
    //     title: '待我审批',
    //     list: [
    //       {
    //         name: '调拨转移',
    //         icon: 'move_down',
    //         url: '/pages/approval/changeTransfer/index',
    //       },
    //       {
    //         name: '设备处置',
    //         icon: 'move_to_inbox',
    //         url: '/pages/approval/changeDisposal/index',
    //       },
    //       {
    //         name: '设备报废',
    //         icon: 'fmd_bad',
    //         url: '/pages/approval/changeScrapped/index',
    //       },
    //       {
    //         name: '设备变卖',
    //         icon: 'paid',
    //         url: '/pages/approval/changeSold/index',
    //       },
    //       {
    //         name: '保养计划',
    //         icon: 'model_training',
    //         url: '/pages/approval/maintainPlan/index',
    //       },
    //       {
    //         name: '保养工单',
    //         icon: 'list_alt',
    //         url: '/pages/approval/maintainWorkOrder/index',
    //       },
    //       {
    //         name: '维修计划',
    //         icon: 'handyman',
    //         url: '/pages/approval/repairPlan/index',
    //       },
    //       {
    //         name: '维修工单',
    //         icon: 'receipt_long',
    //         url: '/pages/approval/repairWorkOrder/index',
    //       },
    //     ]
    //   },
    // ]);

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
  .section-title {

  }
}

.menu-ul {
  display: flex;
  flex-wrap: wrap;
  // justify-content: center;
  align-items: center;
  padding: 10px;
  padding-right: 0;

  .menu-li {
    width: 25%;
    padding-right: 10px;
    margin-bottom: 10px;
  }
}
.menu-block {
  background-color: #fff;
  padding: 10px;
  padding-top: 20px;

  .title {
    font-size: 15px;
  }
}
</style>
