<template>
  <uPage>
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <up-list
        class="p10px"
        @scrolltolower="scrolltolower"
    >
      <up-list-item class="mb10px" v-for="(item, index) in data" :key="index">
        <view class="data-item bg-white p10px radius3px">
          <view class="float-right-bottom">
            <up-button type="primary" @click="handleClick(item)">开始巡检</up-button>
          </view>
          <view class="data-item-line">
            <text>计划名称：</text>{{ item.planName }}
          </view>
          <view class="data-item-line">
            <text>计划类型：</text>{{ item.planTypeText }}
          </view>
          <view class="data-item-line">
            <text>责任部门：</text>{{ item.office?.name }}
          </view>
          <view class="data-item-line">
            <text>任务时间：</text>{{ item.planStartDate }}
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
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted} from 'vue';
import { useStore } from 'vuex';
import jumpTo from '@utils/jumpTo';

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const api = proxy.$api.myCheck;
    const loading = ref(false);
    const pagination = reactive({
      page: 1,
      size: 10,
      total: 0,
      done: false,
    });
    const searchParams = reactive({
      result: '未检',
      onlyMy: true
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
        url: '/pages/my/check/view',
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
