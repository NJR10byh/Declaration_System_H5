<!--
  * @author baoyuhao
  * @date 2023/8/14 15:33:25
  * @description 
  * @version 0.8.0
-->
<template>
  <t-navbar title="账单详情" fixed left-arrow style="z-index: 2000" @left-click="handleClick"/>
  <div class="bill-detail-container">
    <t-cell-group class="cellGroup" theme="card">
      <t-cell title="支付宝" note="17666661936"/>
      <t-cell title="结算人" note="赵灵"/>
      <t-cell title="结算时间" :note="billInfo.date"/>
      <t-cell title="结算金额" :note="'¥'+billInfo.money"/>
    </t-cell-group>

    <t-divider content="账单明细"/>

    <BillCard v-for="(item,index) in billDetailList" :key="index" :billDetailInfo="item"/>
    <t-footer text="-- 没有更多了 --" style="margin: 10px 0 20px 0;"/>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";
import {useRoute, useRouter} from "vue-router";
import BillCard from "@/pages/myBill/BillCard.vue";

const route = useRoute();
const router = useRouter();

const billInfo = route.query;
/**
 * data
 */

const billDetailList = reactive([
  {
    orderId: "8577879186728188461",
    goodsName: "皇家美素佳儿4月",
    goodsMoney: "301"
  },
  {
    orderId: "577520088807537275",
    goodsName: "皇家美素佳儿4月",
    goodsMoney: "276.5"
  },
  {
    orderId: "8577877833813490201",
    goodsName: "皇家美素佳儿4月",
    goodsMoney: "301"
  }
])

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
  console.log(billInfo);

});

/**
 * 操作钩子
 */
const handleClick = () => {
  window.history.back();
}

/**
 * 业务相关
 */
const getDetail = (item) => {
  router.push({
    path: `/billDetail`,
    query: item
  })
}
</script>

<style lang="less" scoped>
.bill-detail-container {
  width: 100vw;
  min-height: 100vh;
  background: #f3f3f3;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 20px;

  .cellGroup {
    width: 90%;
    margin-top: 58px;
    margin-bottom: 10px;
  }
}
</style>