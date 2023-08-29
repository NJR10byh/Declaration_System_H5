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
      <t-cell title="支付宝" :note="billDetailInfo.bankNum"/>
      <t-cell title="结算人" :note="billDetailInfo.payUser"/>
      <t-cell title="结算时间" :note="timestampToDateTime(billDetailInfo.payTime)"/>
      <t-cell title="结算金额" :note="'¥'+billDetailInfo.settlementSum"/>
    </t-cell-group>

    <t-divider content="账单明细"/>

    <BillCard v-for="(item,index) in billDetailInfo.commodityList" :key="index" :billDetailInfo="item"/>
    <t-footer text="-- 没有更多了 --" style="margin: 10px 0 20px 0;"/>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";
import {useRoute, useRouter} from "vue-router";
import BillCard from "@/pages/myBill/BillCard.vue";
import {timestampToDateTime} from "@/utils/date";

const route = useRoute();
const router = useRouter();

const billInfo = route.query;
/**
 * data
 */
const billDetailInfo = reactive({
  bankNum: "622184010300710674",
  payUser: "龙",
  payTime: 1693030753,
  settlementSum: 44.0,
  commodityList: [
    {
      orderId: 333,
      commodityName: "磊哥哥",
      settlementAmount: 44.0,
      payUser: "龙"
    },
  ]
});

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