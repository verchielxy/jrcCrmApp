<template>
  <uPage>
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view class="search-box bg-white p10px">
      <up-search
          placeholder="请输入项目名称"
          v-model="searchParams.name"
          :clearabled="true"
          @search="handleSearch"
          @custom="handleSearch"
      ></up-search>
    </view>

    <view class="list-box p10px">
      <up-list
          height="100%"
          @scrolltolower="loadmore"
      >
        <up-list-item class="mb10px" v-for="(item, index) in data" :key="index" @click="handleView(item)">
          <view class="data-item bg-white radius3px">
            <view class="p10px relative">
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
                <text>客户名称：</text>{{ item.customText }}
              </view>
              <view class="data-item-line">
                <text>联系人姓名：</text> {{ item.contactsText }}
              </view>
              <view class="data-item-line">
                <text>联系人电话：</text> {{ item.contactsPhone }}
              </view>
              <view class="data-item-line">
                <text>负责人：</text> {{ item.headUserText }}
              </view>
              <view class="data-item-line">
                <text>状态：</text>
                <text :class="'c-' + item.statusConstant.badge" v-if="item.statusConstant">
                  {{ item.statusConstant.label }}
                </text>
              </view>
            </view>

            <view @tap.stop>
              <up-row class="mb10px" :gutter="5">
                <up-col :span="4">
                  <up-button type="primary" size="small" @click="handleMeeting(item)">项目启动会</up-button>
                </up-col>
                <up-col :span="4">
                  <up-button type="primary" size="small" @click="handleConstructionPeriod(item)">施工实际工期</up-button>
                </up-col>
                <up-col :span="4">
                  <up-button type="primary" size="small" @click="handleUndeveloped(item)">项目提成</up-button>
                </up-col>
              </up-row>

              <up-row :gutter="5">
                <up-col :span="4"  v-if="engineeringConfig.project.canMaterialApply(item.status)">
                  <up-button type="primary" size="small" @click="handleUndeveloped(item)">物料申请</up-button>
                </up-col>
                <up-col :span="4" v-if="engineeringConfig.project.canMaterialVerify(item.status)">
                  <up-button type="primary" size="small" @click="handleUndeveloped(item)">物料到场核验</up-button>
                </up-col>
                <up-col :span="4" v-if="engineeringConfig.project.canConstructionEnd(item.status)">
                  <up-button type="error" size="small" @click="handleEnd(item)">施工结束</up-button>
                </up-col>
                <up-col :span="4" v-if="engineeringConfig.project.canConstructionAcceptance(item.status)">
                  <up-button type="primary" size="small" @click="handleUndeveloped(item)">施工验收</up-button>
                </up-col>
              </up-row>
            </view>
          </view>
        </up-list-item>

        <up-loadmore class="py20px" :status="pagination.status" @loadmore="loadmore" />
      </up-list>
    </view>
  </uPage>
</template>


<script>
import {defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount, onUnmounted} from 'vue';
import { useStore } from 'vuex';
import jumpTo from '@utils/jumpTo';
import engineeringConfig from '@/config/business/engineering';
import authentication from '@/authentication';

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const user = authentication.user();

    const loading = ref(false);
    const api = proxy.$api.engineeringProject;
    const searchParams = ref({
      name: undefined,
    });
    const pagination = reactive({
      page: 1,
      size: 10,
      total: 0,
      done: false,
      status: 'loadmore',
    });
    const data = ref([]);

    const getData = () => {
      // loading.value = true;
      pagination.status = 'loading';

      if (!loading.value) {
        uni.showLoading({
          title: '正在加载',
          mask: true
        });
      }

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

      }).catch((error) => {
        loading.value = false;
        pagination.status = 'loadmore';
      }).finally(() => {
        setTimeout(function () {
          uni.hideLoading();
          loading.value = false;
        }, 500);
      });
    }

    const loadmore = () => {
      if (!pagination.done) {
        getData();
      }
    }

    const onRefresh = () => {
      pagination.page = 1;
      pagination.done = false;
      pagination.status = 'loadmore';
      data.value = [];
      getData();
    }

    const handleSearch = () => {
      onRefresh()
    }

    const handleMeeting = (item) => {
      jumpTo({
        url: '/pages/business/engineering/project/meeting',
        params: {
          id: item.id,
        }
      })
    }

    const handleConstructionPeriod = (item) => {
      jumpTo({
        url: '/pages/business/engineering/project/constructionPeriod',
        params: {
          id: item.id,
        }
      })
    }

    const handleView = (item) => {
      jumpTo({
        url: '/pages/business/engineering/project/view/index',
        params: {
          id: item.id,
        }
      })
    }

    const handleSupport = (item) => {
      // uni.showToast({
      //   title: '该功能暂未上线，请去pc端操作...',
      //   icon: 'none',
      //   duration: 2000
      // });

      jumpTo({
        url: '/pages/business/project/list/support/index',
        params: {
          id: item.id,
        }
      })
    }

    const handleBudgetChecklist = (item) => {
      // uni.showToast({
      //   title: '该功能暂未上线，请去pc端操作...',
      //   icon: 'none',
      //   duration: 2000
      // });

      jumpTo({
        url: '/pages/business/project/list/budgetChecklist/index',
        params: {
          id: item.id,
        }
      })
    }

    const handleEnd = (item) => {
      uni.showModal({
        title: '施工结束',
        content: '确认该项目是否施工结束？',
        confirmColor: '#2979ff',
        success: (res) => {
          if (res.confirm) {
            // 调用后端接口
            uni.showLoading({
              title: '正在提交...',
              zIndex: 999,
              mask: true
            });

            api.updateFinishBuild(item.id).then((res) => {

              setTimeout(() => {
                uni.hideLoading();

                uni.showToast({
                  title: '提交成功',
                  icon: 'success', // 显示绿色的勾
                  duration: 1500,
                  mask: true,
                  success: () => {
                    onRefresh();
                  }
                });
              }, 1000);

            }).catch((error) => {
              uni.hideLoading();
            }).finally(() => {
            });
          }
        }
      });
    }

    const handleUndeveloped = (item) => {
      uni.showToast({
        title: '该功能暂未上线，请去pc端操作...',
        icon: 'none',
        duration: 2000
      });
    }

    onMounted( () => {
      loading.value = true;
      getData();

      uni.$on('REFRESH_LIST', onRefresh);

      uni.$on('UPDATE_LIST_ITEM', (params) => {
        const index = data.value.findIndex(item => item.id === params.id);
        if (index !== -1) {
          // data.value[index] = { ...params.newData };
          onRefresh();
        }
      });
    });

    onUnmounted(() => {
      uni.$off('REFRESH_LIST', onRefresh);

      uni.$off('UPDATE_LIST_ITEM');
    })

    return {
      engineeringConfig,
      user,
      loading,
      searchParams,
      pagination,
      data,
      loadmore,
      onRefresh,
      handleSearch,
      handleMeeting,
      handleConstructionPeriod,
      handleView,
      handleSupport,
      handleBudgetChecklist,
      handleEnd,
      handleUndeveloped,
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
    right: 5px;
    bottom: 5px;
  }
}

.c-default {
  color: #aaa;
}
</style>
