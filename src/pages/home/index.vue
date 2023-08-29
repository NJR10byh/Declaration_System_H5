<!--
  * @author baoyuhao
  * @date 2023/8/8 16:59:51
  * @description 首页
  * @version 0.8.0
-->
<template>
  <t-navbar style="z-index: 2000">
    <template #left>
      <t-search placeholder="搜索商品" v-model="searchValue"/>
    </template>
    <template #right>
      <t-button theme="primary" @click="searchGoods">
        <template #icon>
          <t-icon name="search"></t-icon>
        </template>
        搜索
      </t-button>
    </template>
  </t-navbar>
  <t-pull-down-refresh
      v-model="refreshing"
      :loading-bar-height="66"
      :loading-texts="['下拉刷新', '松开刷新', '正在刷新', '刷新完成']"
      @refresh="handleRefresh"
      @scrolltolower="handleScrolltolower"
  >
    <div class="home-container">
      <div class="goodsList" v-for="(item,index) in goodsList">
        <GoodsCard :key="index" :goodsInfo="item"/>
      </div>
      <t-footer text="-- 没有更多了 --" style="margin: 10px 0 20px 0;"/>
    </div>
  </t-pull-down-refresh>
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
import {onMounted, ref} from "vue";
import GoodsCard from "@/pages/home/GoodsCard.vue";
import router from "@/router";
import {request} from "@/utils/request";
import {BASE_URL} from "./constants";
import {setObjToUrlParams} from "@/utils/request/utils";

/**
 * data
 */
const barValue = ref('home');
const barList = ref([
  {value: 'home', label: '首页', icon: 'home'},
  {value: 'user', label: '我的', icon: 'user'},
]);

// 下拉刷新状态
const refreshing = ref(false);
// 搜索框的值
const searchValue = ref('');

const goodsList = ref([]);

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
  // 获取商品列表
  getGoodsList();
});

/**
 * 操作钩子
 */
// 切换tab
const switchTab = (item: any) => {
  router.push({
    path: `/${item.value}`
  })
};
// 下拉刷新
const handleRefresh = (value: any) => {
  refreshing.value = true;
  getGoodsList();
};

// 触底
const handleScrolltolower = () => {
  console.log('触底');
};

/**
 * 业务相关
 */
const getGoodsList = () => {
  goodsList.value = [];
  request.get({
    url: setObjToUrlParams(BASE_URL.queryList, {keyWord: searchValue.value})
  }).then(res => {
    console.log(res);
    goodsList.value = res;
  }).catch(err => {
    console.log(err);
  }).finally(() => {
    refreshing.value = false;
  })
}
// 搜索商品
const searchGoods = () => {
  getGoodsList();
}
</script>

<style lang="less" scoped>
.home-container {
  width: 100vw;
  min-height: 100vh;
  background: #f3f3f3;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: var(--td-navbar-height, 48px);

  .searchBar {
    width: 100%;
    background-color: #fff;
    //padding: 8px 16px;
    position: fixed;
    top: 0;
    left: 0;
  }

  .goodsList {
    width: 100%;
    padding: 6px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
