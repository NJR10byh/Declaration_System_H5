<!--
  * @author baoyuhao
  * @date 2023/8/10 17:44:57
  * @description 
  * @version 0.8.0
-->
<template>
  <t-tabs v-model="tabValue" :space-evenly="false" :sticky="true" bottomLineMode="auto" @change="changeTab">
    <t-tab-panel value="今日" :badge-props="{ count: babgeCount.fiveCount, offset: [-3, 0] }" label="今日"/>
    <t-tab-panel value="全部" :badge-props="{ count: babgeCount.totalCount, offset: [-3, 0] }" label="全部"/>
    <t-tab-panel value="已报单" :badge-props="{ count: babgeCount.zeroCount, offset: [-3, 0] }" label="已报单"/>
    <t-tab-panel value="待审核" :badge-props="{ count: babgeCount.oneCount, offset: [-3, 0] }" label="待审核"/>
    <t-tab-panel value="待返款" :badge-props="{ count: babgeCount.twoCount, offset: [-3, 0] }" label="待返款"/>
    <t-tab-panel value="已返款" :badge-props="{ count: babgeCount.threeCount, offset: [-3, 0] }" label="已返款"/>
    <t-tab-panel value="已作废" :badge-props="{ count: babgeCount.fourCount, offset: [-3, 0] }" label="已作废"/>
  </t-tabs>
  <div class="business-container">
    <div class="topSearch">
      <div style="width: 100%;padding:0 10px;">
        <t-input v-model="searchData.commodityName" placeholder="请选择商品" readonly clearable
                 style="border: 1px solid rgba(220, 220, 220, 1);border-radius: 6px;padding: 8px" @click="chooseGoods"
                 @onClear="goodsNameClear"/>
      </div>
      <div style="display: flex;justify-content:space-between;width: 100%;padding: 10px;">
        <t-search v-model="searchData.orderId" placeholder="请输入订单号" style="width: 75%" clearable/>
        <t-button theme="primary" style="width: 20%" @click="getList()">搜索</t-button>
      </div>
      <div style="display: flex;justify-content:space-between;width: 100%;padding: 10px 20px;">
        <div>报单数量：<span style="color: var(--td-brand-color-8)">{{ pageInfo.reportNum }}</span></div>
        <div>实付：<span style="color: var(--td-brand-color-8)">¥{{ pageInfo.payAmount }}</span></div>
        <div>返款：<span style="color: var(--td-brand-color-8)">¥{{ pageInfo.actualPayback }}</span></div>
      </div>
    </div>

    <div style="width: 100%;display:flex;justify-content: center;align-items:center;"
         v-for="(item,index) in declarationList">
      <DeclarationCard :key="index" :declarationInfo="item"/>
    </div>

    <t-loading theme="dots" size="40px" style="margin-top: 10px;" :loading="loading"/>

    <t-popup v-model="goodsListVisible" placement="bottom" style="padding: 10px;max-height: 70vh;overflow: scroll;">
      <div style="width: 100%;display: flex;justify-content: center;align-items: center;">
        <t-search placeholder="请输入搜索关键词" clearable style="width: 100%"/>
      </div>
      <t-radio-group v-model:value="searchData.commodityName">
        <t-radio v-for="item in goodsList" :value="item" :label="item" placement="right"/>
      </t-radio-group>
    </t-popup>
  </div>
  <t-tab-bar v-model="barValue" :split="false">
    <t-tab-bar-item v-for="item in barList" :key="item.value" :value="item.value" @click="switchTab(item)">
      {{ item.label }}
      <template #icon>
        <t-icon :name="item.icon"/>
      </template>
    </t-tab-bar-item>
  </t-tab-bar>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import router from "@/router";
import DeclarationCard from "@/pages/business/DeclarationCard.vue";
import {request} from "@/utils/request";
import {BASE_URL} from "./constants";
import {statusTextToCode} from "@/utils/goodStatus";
import {Toast} from "tdesign-mobile-vue";

const route = useRoute();

/**
 * data
 */
const barValue = ref('');
const barList = ref([
  {value: 'home', label: '首页', icon: 'home'},
  {value: 'user', label: '我的', icon: 'user'}
]);

const loading = ref(false);

const tabValue = ref(route.query.page);
const babgeCount = reactive({
  totalCount: 0,
  zeroCount: 0,
  oneCount: 0,
  twoCount: 0,
  threeCount: 0,
  fourCount: 0,
  fiveCount: 0
})

const searchData = reactive({
  commodityName: "",
  orderId: "",
  status: 0,
})

const pageInfo = reactive({
  reportNum: 0,
  payAmount: 0,
  actualPayback: 0
})

const declarationList = ref([]);
const goodsList = ref([]);
const goodsListVisible = ref(false);

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
  getStatusNums();
  getList();
  getCommodityNames();
});

/**
 * 操作钩子
 */
const changeTab = (value: any) => {
  console.log(value);
  searchData.status = statusTextToCode(value.toString())
  getList();
};
// 切换tab
const switchTab = (item: any) => {
  router.push({
    path: `/${item.value}`
  });
}

const chooseGoods = () => {
  goodsListVisible.value = true;
}
const goodsNameClear = () => {
  goodsListVisible.value = false;

}
/**
 * 业务相关
 */
const getStatusNums = () => {
  request.get({
    url: BASE_URL.getStatusNums
  }).then(res => {
    Object.assign(babgeCount, res);
  }).catch(err => {
    Toast.error(err.message)
  })
}
const getList = () => {
  declarationList.value = [];
  searchData.status = statusTextToCode(tabValue.value.toString())
  loading.value = true;
  request.post({
    url: BASE_URL.showList,
    data: searchData
  }).then(res => {
    console.log(res)
    declarationList.value = res.reportVOList;
    declarationList.value.map((item, index) => {
      item.index = index + 1;
    })
    pageInfo.reportNum = res.reportNum;
    pageInfo.payAmount = res.payAmount;
    pageInfo.actualPayback = res.actualPayback;
  }).catch(err => {
    Toast.error(err.message)
  }).finally(() => {
    loading.value = false;
  });
}
const getCommodityNames = () => {
  request.get({
    url: BASE_URL.getCommodityNames,
  }).then(res => {
    console.log(res)
    goodsList.value = res;
  }).catch(err => {
    Toast.error(err.message)
  }).finally(() => {
  });
}


</script>

<style lang="less" scoped>
.business-container {
  width: 100vw;
  min-height: 100vh;
  background: #f3f3f3;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 70px;

  .topSearch {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background: #fff;
    padding-top: 10px;

    .t-input {
      padding: 5px;
    }
  }
}
</style>