<template>
  <uPage>
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <up-list
        class="p10px"
        @scrolltolower="scrolltolower"
    >
      <up-list-item class="mb10px" v-for="(item, index) in data" :key="index">
        <view class="data-item bg-white radius3px">
          <view :class="['data-item-header p15px']">
            {{ item.code }}
          </view>

          <up-cell-group>
            <up-cell title="设备名称">
              <template #value>
                <text class="right-text">{{ item.deviceText }}</text>
              </template>
            </up-cell>

            <up-cell title="设备编号">
              <template #value>
                <text class="right-text">{{ item.deviceNo }}</text>
              </template>
            </up-cell>

            <up-cell title="规格型号">
              <template #value>
                <text class="right-text">{{ item.spec }}</text>
              </template>
            </up-cell>

            <up-cell title="功能位置">
              <template #value>
                <text class="right-text">{{ item.functionAddr }}</text>
              </template>
            </up-cell>

            <up-cell title="设备运行状态">
              <template #value>
                <text class="right-text">
                  {{ item.runningStatusText }}
                </text>
              </template>
            </up-cell>

            <up-cell title="故障等级">
              <template #value>
                <text class="right-text">


                </text>
              </template>
            </up-cell>

            <up-cell title="申请人">
              <template #value>
                <text class="right-text">{{ item.applyUserText }}</text>
              </template>
            </up-cell>

            <up-cell>
              <template #title>
                {{ item.applyTime }}
              </template>
              <template #value>
                <view style="margin: -5px 0;">
                  <up-button style="width: auto;" type="primary" @click="handleClick(item)">点击审核</up-button>
                </view>
              </template>
            </up-cell>
          </up-cell-group>
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

    const api = proxy.$api.approvalRepairWorkOrder;
    const loading = ref(false);
    const pagination = reactive({
      page: 1,
      size: 10,
      total: 0,
      done: false,
    });
    const searchParams = reactive({
      status: 1,
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
        url: '/pages/approval/repairWorkOrder/view',
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
