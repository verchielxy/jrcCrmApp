<template>
  <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

  <uPage>
    <up-list class="p10px" @scrolltolower="scrolltolower">
      <up-list-item class="mb10px" v-for="(item, index) in data" :key="index">
        <view class="data-item bg-white radius3px" @click="handleClick(item)">
          <view :class="['data-item-header p10px bg-info c-white', item.rankConstant ? 'bg-' + item.rankConstant.color : '']">
            {{ item.name }}
          </view>
          <view class="display-flex p10px">
            <view class="data-item-avatar">
              <up-image :show-loading="true" shape="square" :src="$imageUrl(item.pic)" width="80px" height="80px"></up-image>
            </view>
            <view class="pl10px" style="flex: 1;">
              <view>设备编号：{{ item.deviceNo }}</view>
              <view>设备类别：{{ item.cateText }}</view>
              <view>设备品牌：{{ item.brand }}</view>
              <view>规格型号：{{ item.spec }}</view>
            </view>
          </view>
          <view class="px10px mb10px">
            功能位置：{{ item.functionAddr }}
          </view>
          <view>
            <up-row align="center" style="border-top: 1px solid #eee;">
              <up-col :span="4" style="border-right: 1px solid #eee;">
                <view class="px2px py10px center">
                  {{ item.levelText }}
                </view>
              </up-col>
              <up-col :span="4" style="border-right: 1px solid #eee;">
                <view class="px2px py10px center">
                  {{ item.runningStatusText }}
                </view>
              </up-col>
              <up-col :span="4">
                <view class="px2px py10px center">
                  {{ item.useStatusText }}
                </view>
              </up-col>
            </up-row>
          </view>
        </view>
      </up-list-item>

      <up-list-item class="center" v-if="pagination.total === data.length">
        没有更多了
      </up-list-item>
    </up-list>
  </uPage>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import jumpTo from '@utils/jumpTo';

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const api = proxy.$api.equipment;
    const loading = ref(false);
    const pagination = reactive({
      page: 1,
      size: 10,
      total: 0,
      done: false,
    });
    const searchParams = reactive({
      // status: 1,
    });
    const data = ref([]);

    const getData = () => {
      loading.value = true;
      api.get(pagination.page, pagination.size, searchParams).then((res) => {
        const json = res.result;

        if (json.records.length > 0) {
          data.value.push(...json.records);
        }

        if (json.records.length >= pagination.size) {
          pagination.page ++;
        }

        if (json.records.length < pagination.size) {
          pagination.done = true;
        }

        pagination.total = json.total;
      }).finally(() => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      });
    }

    const scrolltolower = () => {
      if (!pagination.done) {
        getData();
      }
    };

    const handleClick = (item) => {
      jumpTo({
        url: '/pages/equipment/view',
        params: {
          id: item.id,
        }
      })
    }

    const onRefresh = () => {
      pagination.page = 1;
      pagination.done = false;
      data.value = [];
      getData();
    }

    onMounted( () => {
      getData();

      uni.$on('refreshFromDetail', onRefresh);
    });

    onUnmounted(() => {
      uni.$off('refreshFromDetail', onRefresh)
    })

    return {
      api,
      loading,
      pagination,
      searchParams,
      data,
      scrolltolower,
      handleClick,
    };
  },
});
</script>

<style scoped lang="less">
.data-item {
  position: relative;

  .data-item-line {
    margin-bottom: 10px;
  }
  .data-item-line:last-child {
    margin-bottom: 0;
  }
  .float-right-bottom {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}
</style>
