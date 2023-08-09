<!--
  * @author baoyuhao
  * @date 2023/8/8 16:59:51
  * @description 首页
  * @version 0.8.0
-->
<template>
  <t-navbar style="z-index: 2000">
    <template #left>
      <t-search placeholder="搜索商品"/>
    </template>
    <template #right>
      <t-button theme="primary">
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
      <div class="goodsList" v-for="item in goodsList">
        <GoodsCard :key="item.index" :goodsInfo="item"/>
      </div>
      <t-footer text="-- 没有更多了 --" style="margin: 10px 0 20px 0;"/>
    </div>
  </t-pull-down-refresh>
  <t-tab-bar v-model="value" :split="false">
    <t-tab-bar-item v-for="item in list" :key="item.value" :value="item.value" @click="switchTab(item)">
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

/**
 * data
 */
const value = ref('home');
const list = ref([
  {value: 'home', label: '首页', icon: 'home'},
  {value: 'user', label: '我的', icon: 'user'},
]);

// 下拉刷新状态
const refreshing = ref(false);
// 搜索框的值
const searchValue = ref('');

const goodsList = ref([
  {
    index: 1,
    goodsName: '商品名称1',
    deadline: '2021-08-08 20:00:00',
    remainingAmount: '1000',
  },
  {
    index: 2,
    goodsName: '商品名称2',
    deadline: '2023-08-23 21:00:00',
    remainingAmount: '3242',
  }
]);

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
  })
};
// 下拉刷新
const handleRefresh = (value: any) => {
  refreshing.value = true;
  setTimeout(() => {
    refreshing.value = false;
  }, 1000);
};

// 触底
const handleScrolltolower = () => {
  console.log('触底');
};

/**
 * 业务相关
 */
// 搜索商品
const searchGoods = () => {
  console.log(searchValue.value);
}

// 获取商品详情
// const getDetail = (item: any) => {
//   console.log(item);
//   router.push({
//     path: '/declaration',
//     query: item
//   })
// }
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
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
