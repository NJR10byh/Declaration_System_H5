<!--
  * @author baoyuhao
  * @date 2023/8/10 17:44:57
  * @description 
  * @version 0.8.0
-->
<template>
  <t-tabs v-model="tabValue" :space-evenly="false" :sticky="true">
    <t-tab-panel value="今日" :badge-props="{ count: babgeCount.today, offset: [-8, 3] }" label="今日"/>
    <t-tab-panel value="全部" :badge-props="{ count: babgeCount.all, offset: [-8, 3] }" label="全部"/>
    <t-tab-panel value="已报单" :badge-props="{ count: babgeCount.declared, offset: [-8, 3] }" label="已报单"/>
    <t-tab-panel value="待审核" :badge-props="{ count: babgeCount.waitApproval, offset: [-8, 3] }" label="待审核"/>
    <t-tab-panel value="待返款" :badge-props="{ count: babgeCount.waitBackMoney, offset: [-8, 3] }" label="待返款"/>
    <t-tab-panel value="已返款" :badge-props="{ count: babgeCount.refunded, offset: [-8, 3] }" label="已返款"/>
    <t-tab-panel value="已作废" :badge-props="{ count: babgeCount.abolished, offset: [-8, 3] }" label="已作废"/>
  </t-tabs>
  <div class="business-container">
    <div class="topSearch">
      <div style="width: 100%;padding:0 10px;">
        <t-input v-model="searchData.goodsName" placeholder="请选择商品" readonly clearable
                 style="border: 1px solid rgba(220, 220, 220, 1);border-radius: 6px;padding: 8px" @click="chooseGoods"
                 @onClear="goodsNameClear"/>
      </div>
      <div style="display: flex;justify-content:space-between;width: 100%;padding: 10px;">
        <t-search v-model="searchData.orderId" placeholder="请输入订单号" style="width: 75%" clearable/>
        <t-button theme="primary" style="width: 20%">搜索</t-button>
      </div>
      <div style="display: flex;justify-content:space-between;width: 100%;padding: 10px 20px;">
        <div>报单数量：<span style="color: var(--td-brand-color-8)">{{ pageInfo.declarationNum }}</span></div>
        <div>实付：<span style="color: var(--td-brand-color-8)">¥{{ pageInfo.relMoney }}</span></div>
        <div>返款：<span style="color: var(--td-brand-color-8)">¥{{ pageInfo.backMoney }}</span></div>
      </div>
    </div>

    <div style="width: 100%;display:flex;justify-content: center;align-items:center;"
         v-for="(item,index) in declarationList">
      <DeclarationCard :key="index" :declarationInfo="item"/>
    </div>


    <t-popup v-model="goodsListVisible" placement="bottom" style="padding: 10px;max-height: 70vh;overflow: scroll;">
      <div style="width: 100%;display: flex;justify-content: center;align-items: center;">
        <t-search v-model="searchData.orderId" placeholder="请输入搜索关键词" clearable style="width: 100%"/>
      </div>
      <t-radio-group v-model:value="searchData.goodsName">
        <t-radio name="radio" value="商品1" label="商品1" placement="right"/>
        <t-radio name="radio" value="商品2" label="商品2" placement="right"/>
        <t-radio name="radio" value="商品3" label="商品3" placement="right"/>
        <t-radio name="radio" value="商品4" label="商品4" placement="right"/>
        <t-radio name="radio" value="商品5" label="商品5" placement="right"/>
        <t-radio name="radio" value="商品6" label="商品6" placement="right"/>
        <t-radio name="radio" value="商品7" label="商品7" placement="right"/>
        <t-radio name="radio" value="商品8" label="商品8" placement="right"/>
        <t-radio name="radio" value="商品9" label="商品9" placement="right"/>
        <t-radio name="radio" value="商品10" label="商品10" placement="right"/>
        <t-radio name="radio" value="商品11" label="商品11" placement="right"/>
        <t-radio name="radio" value="商品12" label="商品12" placement="right"/>
        <t-radio name="radio" value="商品13" label="商品13" placement="right"/>
        <t-radio name="radio" value="商品14" label="商品14" placement="right"/>
        <t-radio name="radio" value="商品15" label="商品15" placement="right"/>
        <t-radio name="radio" value="商品16" label="商品16" placement="right"/>
      </t-radio-group>
    </t-popup>
    <t-loading theme="spinner" text="加载中..." :loading="loading"/>
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

const route = useRoute();

/**
 * data
 */
const barValue = ref('');
const barList = ref([
  {value: 'home', label: '首页', icon: 'home'},
  {value: 'user', label: '我的', icon: 'user'},
]);

const tabValue = ref(route.query.page);
const babgeCount = reactive({
  today: 1,
  all: 1,
  declared: 1,
  waitApproval: 0,
  waitBackMoney: 1,
  refunded: 1,
  abolished: 1
})

const searchData = reactive({
  goodsName: "商品4",
  orderId: "",
})

const pageInfo = reactive({
  declarationNum: "1",
  relMoney: "1012",
  backMoney: "2000"
})

const declarationList = reactive([
  {
    goodsName: "蒙牛早餐奶（社群专属）",
    goodsNum: "11",
    goodsDate: "03-30",
    goodsStatus: "已报单",
    relMoney: "1012",
    preBackMoney: "2000"
  },
  {
    goodsName: "蒙牛早餐奶（社群专属）",
    goodsNum: "11",
    goodsDate: "03-29",
    goodsStatus: "未报单",
    relMoney: "1012",
    preBackMoney: "2000"
  }
])

const goodsListVisible = ref(false);


const loading = ref(false);

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
});

/**
 * 操作钩子
 */
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