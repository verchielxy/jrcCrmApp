<template>
  <uPage>
    <up-loading-page :loading="loading" loading-text="正在加载..."></up-loading-page>

    <view v-if="target">
      <view class="bg-white mb20px">
        <view class="p15px">
          <MaterialSymbol class="middle-icon c-primary" name="info" :size="20" type="sharp"></MaterialSymbol>
          巡检信息 {{ targetId }}
        </view>

        <up-cell-group>
          <up-cell title="计划名称">
            <template #value>
              <text class="right-text">{{ target.planName }}</text>
            </template>
          </up-cell>

          <up-cell title="计划类型">
            <template #value>
              <text class="right-text">{{ target.planTypeText }}</text>
            </template>
          </up-cell>

          <up-cell title="责任部门">
            <template #value>
              <text class="right-text">{{ target.office?.name }}</text>
            </template>
          </up-cell>

          <up-cell title="计划名称">
            <template #value>
              <text class="right-text">{{ target.planName }}</text>
            </template>
          </up-cell>
        </up-cell-group>
      </view>

      <view v-if="target.pointList && target.pointList.length > 0">
        <view class="bg-white mb20px" v-for="(point, index) in target.pointList" :key="index">
          <view style="border-bottom: 1px solid #eee;">
            <up-row align="center" style="border-top: 1px solid #eee;">
              <up-col :span="6">
                <view class="px10px">
                  <MaterialSymbol class="middle-icon c-primary" name="pin_drop" :size="20" type="sharp"></MaterialSymbol>
                  {{ point.name }}
                </view>
              </up-col>
              <up-col :span="3" style="border-left: 1px solid #eee;">
                <view class="px5px py10px center">
                  {{ point.typeText }}
                </view>
              </up-col>
              <up-col :span="3" style="border-left: 1px solid #eee;">
                <view class="px5px py10px center bg-primary c-white" @click="handleReadNfc(point.pointId)" v-if="point.checkType === 1">
                  {{ point.checkTypeText }}
                </view>
                <view class="px5px py10px center" v-else-if="point.checkType === 2">
                  {{ point.checkTypeText }}
                </view>
              </up-col>
            </up-row>
          </view>

          <view>
            <up-collapse>
              <up-collapse-item v-for="device in point.deviceList">
                <template #title>
                  <up-row align="center">
                    <up-col :span="8">
                      <text class="c-primary">
                        {{ device.name }}
                      </text>
                    </up-col>
                    <up-col :span="4" v-if="point.checkType === 1">
                      <view class="right">
                        <MaterialSymbol :class="['middle-icon', device.status ? 'c-success' : 'c-error']" name="nfc" :size="20" type="sharp"></MaterialSymbol>
                      </view>
                    </up-col>
                  </up-row>
                </template>

                <view style="margin: -12px -15px;">
                  <view class="bg-white pl20px pr10px" style="border-bottom: 1px solid #eee;" v-for="checkItem in device.checkItemList" :key="checkItem.id">
                    <up-row align="center">
                      <up-col :span="8">
                        <view class="py10px">
                          {{ checkItem.checkItemName }}
                        </view>
                      </up-col>
                      <up-col :span="4">
                        <view class="right" v-if="point.checkType === 1">
                          <view v-if="device.status">
                            <up-button type="primary" size="small" @click="handleModalShow(checkItem)">填写巡检结果</up-button>
                          </view>
                          <view v-else>
                            <text class="c-default font12px">请NFC扫描设备</text>
                          </view>
                        </view>
                        <view class="right" v-else-if="point.checkType === 2">
                          <up-button class="dib" type="primary" size="small" @click="handleModalShow(checkItem)">填写巡检结果</up-button>
                        </view>
                      </up-col>
                    </up-row>
                  </view>
                </view>
              </up-collapse-item>
            </up-collapse>
          </view>
        </view>
      </view>
    </view>

    <up-modal v-model:show="modalShow" width="350px" :buttonReverse="true" :showConfirmButton="true" :showCancelButton="true" @confirm="handleConfirm">
      <view style="width: 100%" v-if="modalItem">
        <view class="mb10px">
          <view class="mb10px">
            检查标准：
          </view>
          <view class="p10px" style="border: 1px dashed #666;">
            {{ modalItem.checkItemStandard }}
          </view>
        </view>

        <up-form :model="formData" :rules="formRules" ref="formRef" v-if="modalItem.checkItemType === 1">
          <vFormRow
              :rows="formRows.one"
              v-model:formData="formData"
              :labelWidth="45"
              :onlyText="false"
          ></vFormRow>
        </up-form>
        <up-form :model="formData" :rules="formRules" ref="formRef" v-else-if="modalItem.checkItemType === 2">
          <vFormRow
              :rows="formRows.two"
              v-model:formData="formData"
              :labelWidth="45"
              :onlyText="false"
          ></vFormRow>
        </up-form>
      </view>
    </up-modal>
  </uPage>
</template>


<script>
import { defineComponent, getCurrentInstance, ref, reactive, toRef, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import nfc from '@/js_sdk/hexiii-nfc/hexiii-nfc';

export default defineComponent({
  components: {
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const id = ref();

    const api = proxy.$api.myCheck;
    const loading = ref(false);
    const target = ref();
    const targetId = ref();
    const targetPointId = ref();

    const formRows = ref({
      one: [
        {
          title: '结果',
          placeholder: '请输入巡检结果',
          type: 'textarea',
          name: 'result',
          rule: [
            {required: true, message: '这里需要填写'},
          ],
        },
        {
          title: '照片',
          placeholder: '请上传照片',
          type: 'imageUpload',
          name: 'pic',
          images: [],
          limit: 1,
          valueSingle: true,
        },
      ],
      two: [
        {
          title: '结果',
          placeholder: '选择检查结果',
          type: 'select',
          name: 'result',
          list: [],
          rule: [
            {required: true, message: '这里需要填写'},
          ],
        },
        {
          title: '照片',
          placeholder: '请上传照片',
          type: 'imageUpload',
          name: 'pic',
          images: [],
          limit: 1,
          valueSingle: true,
        },
      ]
    });
    const formData = ref({
      result: undefined,
    })
    const formRules = ref({
      result: [],
    });
    const formRef = ref();
    const modalShow = ref(false);
    const modalItem = ref();

    const getTarget = () => {
      loading.value = true;
      api.view(id.value, {}).then((res) => {
        const json = res.result;

        if (json.pointList && json.pointList.length > 0) {
          json.pointList = json.pointList.map(function (point) {
            let deviceList = [];

            point.checkItemList.map(function (checkItem) {
              let device = deviceList.find(item => item.id === checkItem.deviceId);

              if (!device) {
                device = {
                  id: checkItem.deviceId,
                  name: checkItem.deviceName,
                  code: checkItem.deviceCode,
                  status: checkItem.deviceNfcStatus,
                  checkItemList: [],
                };

                deviceList.push(device);
              }

              device.checkItemList.push(checkItem);
            })

            return {
              ...point,
              deviceList: deviceList,
            }
          })
        }

        // console.log(json.pointList);

        target.value = json;
        targetId.value = json.id;

      }).finally(() => {
        setTimeout(function () {
          loading.value = false;
        }, 500);
      });
    }

    const handleReadNfc = (pointId) => {
      // uni.$u.toast('准备读取中...')
      targetPointId.value = pointId;

      nfc.readData();
    }

    const handleReadNfcCallback = (nfcId) => {

      api.checkDeviceNfc(targetId.value, targetPointId.value, nfcId).then((res) => {
        const json = res.result;

        uni.$u.toast('nfc读取成功！')

        getTarget();

      }).finally(() => {

      });

      console.log('nfcId:', nfcId);
    }

    const handleModalShow = (checkItem) => {
      formData.value.result = undefined;
      formData.value.pic = undefined;
      formRows.value.one[1].images = [];
      formRows.value.two[1].images = [];

      formRows.value.two[0].list = checkItem.checkItemOptions.map((item) => {
        return {
          label: item.content,
          key: item.id,
        }
      });
      modalItem.value = checkItem;
      modalShow.value = true;

      formRows.value.one[1].images = [ checkItem.pic ]
      formRows.value.two[1].images = [ checkItem.pic ]

      formData.value.result = checkItem.checkItemType === 1 ? checkItem.checkResult : checkItem.checkResultId;
      formData.value.pic = checkItem.pic;

      console.log(checkItem)
    }

    const handleConfirm = () => {
      formRef.value.validate().then(valid => {
        if (valid) {
          api.saveCheck(modalItem.value.id, formData.value).then((res) => {
            const json = res.result;

            getTarget();

          }).finally(() => {

          });
        } else {
          uni.$u.toast('校验失败')
        }
      }).catch(() => {
        // 处理验证错误
        uni.$u.toast('校验失败')
      });
    }

    onMounted(() => {
      getTarget();

      uni.$on('nfc-read', (res) => {

        handleReadNfcCallback(res.id);
        // console.log('收到 NFC ID:', res.id);
      });
    });

    onLoad((options) => {
      id.value = options.id;
      // name.value = decodeURIComponent(options.name)

      nfc.listenNFCStatus();
    })

    return {
      id,
      api,
      loading,
      target,
      targetId,
      targetPointId,
      formRows,
      formData,
      formRules,
      formRef,
      modalShow,
      modalItem,
      handleReadNfc,
      handleModalShow,
      handleConfirm,
    };
  },
});
</script>

<style scoped lang="less">
</style>
