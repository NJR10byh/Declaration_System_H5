<!--
  * @author baoyuhao
  * @date 2023/8/8 16:59:51
  * @description 首页
  * @version 0.8.0
-->
<template>
  <t-navbar :fixed="true" style="z-index: 2000">
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
      <div class="goodsList">
        <GoodsCard
            v-for="item in 10"
            :key="item"
            goodsName="商品名称"
            deadline="2021-08-08 20:00:00"
            remainingAmount="1000"
            type="1"
        />
      </div>
      <t-footer text="-- 没有更多了 --" style="margin: 10px 0 20px 0;"/>
    </div>
  </t-pull-down-refresh>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import GoodsCard from "@/pages/home/GoodsCard.vue";

/**
 * data
 */
// 下拉刷新状态
const refreshing = ref(false);
// 搜索框的值
const searchValue = ref('');

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

</script>

<style lang="less" scoped>
.home-container {
  width: 100vw;
  background: #eee;
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
