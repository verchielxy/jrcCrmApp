<template>
  <uPage>
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="tab-box bg-white">
      <up-tabs
          :list="tabs"
          :scrollable="false"
          itemStyle="flex: 1; text-align: center; padding: 8px 0;"
          :current="tabCurrentIndex"
          @click="handleTabsClick">
      </up-tabs>
    </view>

    <view class="search-box bg-white p10px">
      <up-search
          v-if="tabActive === 'list'"
          placeholder="请输入项目名称"
          v-model="searchParams.projectName"
          :clearabled="true"
          @search="handleSearch"
          @custom="handleSearch"
      ></up-search>
      <up-search
          v-else-if="tabActive === 'result'"
          placeholder="请输入项目名称"
          v-model="searchParams2.projectName"
          @search="handleSearch"
          @custom="handleSearch"
      ></up-search>
    </view>

    <view class="list-box p10px">
      <up-list
          v-if="tabActive === 'list'"
          height="100%"
          @scrolltolower="loadmore"
      >
        <up-list-item class="mb10px" v-for="(item, index) in data" :key="index">
          <view class="data-item bg-white p10px radius3px">
            <view class="float-right-bottom">
              <up-button type="primary" size="small" @click="handleClick(item)">审批</up-button>
            </view>
            <view class="mb10px font17px">
              {{ item.projectName }}
            </view>

            <view class="data-item-line">
              <text>项目类型：</text>{{ item.projectTypeText }}
            </view>
            <view class="data-item-line">
              <text>项目评级：</text>{{ item.projectGradeText }}
            </view>
          </view>
        </up-list-item>

        <up-loadmore class="py20px" :status="pagination.status" @loadmore="loadmore" />
      </up-list>

      <up-list
          v-else-if="tabActive === 'result'"
          height="100%"
          @scrolltolower="loadmore"
      >
        <up-list-item class="mb10px" v-for="(item, index) in data2" :key="index">
          <view class="data-item bg-white p10px radius3px">
            <view class="float-right-bottom">
              <up-button type="primary" size="small" plain="true" @click="handleClick(item)">查看</up-button>
            </view>
            <view class="mb10px font17px">
              {{ item.projectName }}
            </view>

            <view class="data-item-line">
              <text>项目类型：</text>{{ item.projectTypeText }}
            </view>
            <view class="data-item-line">
              <text>项目评级：</text>{{ item.projectGradeText }}
            </view>

            <view class="data-item-line">
              <text>审核结果：</text>
              <u-tag plain :type="item.statusConstant.badge" v-if="item.statusConstant">{{ item.statusConstant.label }}</u-tag>
            </view>

            <view class="data-item-line" v-if="item.status === 1">
              <text>通过时间：</text>
              {{ item.endTime }}
            </view>

            <view class="data-item-line" v-if="item.status === 0">
              <text>备注：</text>
              <text style="padding-right: 50px;">
                {{ item.opinion }}
              </text>
            </view>
          </view>
        </up-list-item>

        <up-loadmore class="py20px" :status="pagination2.status" @loadmore="loadmore" />
      </up-list>
    </view>
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

    const tabs = ref([
      {
        key: 'list',
        name: '待审核列表',
        badge: { value: 0 },
      },
      {
        key: 'result',
        name: '审核结果',
      },
    ]);
    const tabActive = ref(tabs.value[0].key);
    const tabCurrentIndex = computed(() => {
      const index = tabs.value.findIndex(item => item.key === tabActive.value);
      return index > -1 ? index : 0; // 找不到默认显示第一个
    });

    const loading = ref(false);
    const api = proxy.$api.reviewTechnology;
    const api2 = proxy.$api.reviewTechnology.result;
    const searchParams = ref({
      projectName: undefined,
    });
    const searchParams2 = ref({
      projectName: undefined,
    });
    const pagination = reactive({
      page: 1,
      size: 5,
      total: 0,
      done: false,
      status: 'loadmore',
    });
    const pagination2 = reactive({
      page: 1,
      size: 10,
      total: 0,
      done: false,
      status: 'loadmore',
    });
    const data = ref([]);
    const data2 = ref([]);

    const getData = () => {
      pagination.status = 'loading';

      api.get(pagination.page, pagination.size, searchParams.value).then((res) => {
        const json = res.result;

        if (json.records.length > 0) {
          data.value.push(...json.records);
        }

        if (json.records.length >= pagination.size) {
          pagination.page ++;
          pagination.status = 'loadmore';
        } else if (json.records.length < pagination.size) {
          pagination.done = true;
          pagination.status = 'nomore';
        }

        pagination.total = json.total;
        tabs.value[0].badge.value = json.total;

      }).catch((error) => {
        loading.value = false;
        pagination.status = 'loadmore';
      }).finally(() => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      });
    }

    const getData2 = () => {
      pagination2.status = 'loading';

      api2.get(pagination2.page, pagination2.size, searchParams2.value).then((res) => {
        const json = res.result;

        if (json.records.length > 0) {
          data2.value.push(...json.records);
        }

        if (json.records.length >= pagination2.size) {
          pagination2.page ++;
          pagination2.status = 'loadmore';
        } else if (json.records.length < pagination2.size) {
          pagination2.done = true;
          pagination2.status = 'nomore';
        }

        pagination2.total = json.total;

      }).catch((error) => {
        loading.value = false;
        pagination2.status = 'loadmore';
      }).finally(() => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      });
    }

    const loadmore = () => {
      if (tabActive.value === 'list') {
        if (!pagination.done) {
          getData();
        }
      } else if (tabActive.value === 'result') {
        if (!pagination2.done) {
          getData2();
        }
      }
    }

    const onRefresh = () => {
      pagination.page = 1;
      pagination.done = false;
      pagination.status = 'loadmore';
      pagination2.page = 1;
      pagination2.done = false;
      pagination2.status = 'loadmore';
      data.value = [];
      data2.value = [];
      getData();
      getData2();
    }

    const handleSearch = () => {
      onRefresh()
    }

    const handleTabsClick = (item) => {
      tabActive.value = item.key;
    }

    const handleClick = (item) => {
      jumpTo({
        url: '/pages/business/review/technology/view',
        params: {
          id: item.id,
          tab: tabActive.value,
        }
      })
    }

    onMounted( () => {
      loading.value = true;
      getData();
      getData2();

      uni.$on('REFRESH_LIST', onRefresh);
    });

    onUnmounted(() => {
      uni.$off('REFRESH_LIST', onRefresh)
    })

    return {
      tabs,
      tabActive,
      tabCurrentIndex,
      loading,
      searchParams,
      searchParams2,
      pagination,
      pagination2,
      data,
      data2,
      loadmore,
      onRefresh,
      handleSearch,
      handleTabsClick,
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
