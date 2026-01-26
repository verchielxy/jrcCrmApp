<template>
  <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

  <uPage>
    <view class="bg-white mb20px" v-if="target">
      <up-cell-group>
        <up-cell title="设备图片">
          <template #value>
            <up-image :show-loading="true" shape="square" :src="$imageUrl(target.pic)" width="80px" height="80px"></up-image>
          </template>
        </up-cell>

        <up-cell title="设备名称">
          <template #value>
            <text class="right-text">{{ target.name }}</text>
          </template>
        </up-cell>

        <up-cell title="设备编号">
          <template #value>
            <text class="right-text">{{ target.deviceNo }}</text>
          </template>
        </up-cell>

        <up-cell title="设备序列号">
          <template #value>
            <text class="right-text">{{ target.sn }}</text>
          </template>
        </up-cell>

        <up-cell title="NFC">
          <template #value>
            <text class="right-text">{{ target.nfcId }}</text>
          </template>
        </up-cell>

        <up-cell title="设备类别">
          <template #value>
            <text class="right-text">{{ target.cateText }}</text>
          </template>
        </up-cell>

        <up-cell title="设备品牌">
          <template #value>
            <text class="right-text">{{ target.brand }}</text>
          </template>
        </up-cell>

        <up-cell title="规格型号">
          <template #value>
            <text class="right-text">{{ target.spec }}</text>
          </template>
        </up-cell>

        <up-cell title="功能位置">
          <template #value>
            <text class="right-text">{{ target.functionAddr }}</text>
          </template>
        </up-cell>

        <up-cell title="等级">
          <template #value>
            <text class="right-text">{{ target.levelText }}</text>
          </template>
        </up-cell>

        <up-cell title="运行状态">
          <template #value>
            <text class="right-text">
              <u-tag plain :type="target.runningStatusConstant.badge">{{ target.runningStatusText }}</u-tag>
            </text>
          </template>
        </up-cell>

        <up-cell title="使用状态">
          <template #value>
            <u-tag plain :type="target.useStatusConstant.badge">{{ target.useStatusText }}</u-tag>
          </template>
        </up-cell>

        <up-cell title="单位">
          <template #value>
            <text class="right-text">{{ target.unitText }}</text>
          </template>
        </up-cell>

        <up-cell title="所属部门">
          <template #value>
            <text class="right-text">{{ target.belongOfficeText }}</text>
          </template>
        </up-cell>

        <up-cell title="负责人">
          <template #value>
            <text class="right-text">{{ target.headUserText }}</text>
          </template>
        </up-cell>

        <up-cell title="特种设备">
          <template #value>
            <text class="right-text">{{ target.isSpecialText }}</text>
          </template>
        </up-cell>

        <up-cell title="计量设备">
          <template #value>
            <text class="right-text">{{ target.isMeteringText }}</text>
          </template>
        </up-cell>

        <up-cell title="供应商">
          <template #value>
            <text class="right-text">{{ target.supplier }}</text>
          </template>
        </up-cell>

        <up-cell title="设备来源">
          <template #value>
            <text class="right-text">{{ target.deviceFrom }}</text>
          </template>
        </up-cell>

        <up-cell title="资产编号">
          <template #value>
            <text class="right-text">{{ target.propertyNo }}</text>
          </template>
        </up-cell>

        <up-cell title="采购金额">
          <template #value>
            <text class="right-text">{{ target.buyMoney }}</text>
          </template>
        </up-cell>

        <up-cell title="购置日期">
          <template #value>
            <text class="right-text">{{ target.buyDate }}</text>
          </template>
        </up-cell>

        <up-cell title="保修期截止">
          <template #value>
            <text class="right-text">{{ target.guaranteeDate }}</text>
          </template>
        </up-cell>

        <up-cell title="启用日期">
          <template #value>
            <text class="right-text">{{ target.useDate }}</text>
          </template>
        </up-cell>

        <up-cell title="报废日期">
          <template #value>
            <text class="right-text">{{ target.expectDeadDate }}</text>
          </template>
        </up-cell>

        <up-cell title="折旧方法">
          <template #value>
            <text class="right-text">{{ target.depreciationText }}</text>
          </template>
        </up-cell>

        <up-cell title="技术参数">
          <template #value>
            <text class="right-text">{{ target.parameter }}</text>
          </template>
        </up-cell>

        <up-cell title="生产日期">
          <template #value>
            <text class="right-text">{{ target.other?.produceDate }}</text>
          </template>
        </up-cell>

        <up-cell title="功率">
          <template #value>
            <text class="right-text">{{ target.other?.power }}</text>
          </template>
        </up-cell>

        <up-cell title="重量">
          <template #value>
            <text class="right-text">{{ target.other?.weight }}</text>
          </template>
        </up-cell>

        <up-cell title="体积">
          <template #value>
            <text class="right-text">{{ target.other?.volume }}</text>
          </template>
        </up-cell>

        <up-cell title="备注">
          <template #value>
            <text class="right-text">{{ target.other?.remarks }}</text>
          </template>
        </up-cell>

      </up-cell-group>
    </view>

    <view v-if="target && target.pointList && target.pointList.length > 0">
      <view class="bg-white p15px" style="border-bottom: 1px solid #eee;">
        <MaterialSymbol class="middle-icon c-primary" name="pin_drop" :size="20" type="sharp"></MaterialSymbol>
        巡检点
      </view>

      <up-list style="height: auto;">
        <up-list-item class="mb10px" v-for="(item, index) in target.pointList" :key="index">
          <view class="data-item bg-white">
            <view class="p15px">
              <MaterialSymbol class="middle-icon c-success" name="location_on" :size="20" type="sharp"></MaterialSymbol>
              {{ item.name }}
            </view>
            <up-row align="center" style="border-top: 1px solid #eee;">
              <up-col :span="4">
                <view class="px5px py10px center">
                  {{ item.typeText }}
                </view>
              </up-col>
              <up-col :span="4" style="border-left: 1px solid #eee;">
                <view class="px5px py10px center">
                  {{ item.checkTypeText }}
                </view>
              </up-col>
              <up-col :span="4" style="border-left: 1px solid #eee;">
                <view class="center">
                  <up-button type="primary" :plain="true" @click="handleClick(item)">开始巡检</up-button>
                </view>
              </up-col>
            </up-row>
          </view>
        </up-list-item>
      </up-list>
    </view>
  </uPage>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const id = ref();

    const api = proxy.$api.equipment;
    const loading = ref(false);
    const target = ref();

    const getTarget = () => {
      loading.value = true;
      api.view(id.value, {}).then((res) => {
        const json = res.result;

        target.value = json;

      }).finally(() => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      });
    }

    const handleClick = (item) => {

    }

    onMounted(() => {
      getTarget();
    });

    onLoad((options) => {
      id.value = options.id;
      // name.value = decodeURIComponent(options.name)
    })

    return {
      id,
      api,
      loading,
      target,
      handleClick,
    };
  },
});
</script>

<style scoped lang="less">
</style>
