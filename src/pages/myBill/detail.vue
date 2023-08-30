<!--
  * @author baoyuhao
  * @date 2023/8/14 15:33:25
  * @description 
  * @version 0.8.0
-->
<template>
  <t-navbar title="账单详情" fixed left-arrow style="z-index: 2000" @left-click="handleClick"/>
  <div class="bill-detail-container">
    <div class="cellGroup">
      <t-cell-group theme="card">
        <t-cell title="支付宝" :note="billDetailInfo.bankNum"/>
        <t-cell title="结算人" :note="billDetailInfo.payUser"/>
        <t-cell title="结算时间" :note="timestampToDateTime(billDetailInfo.payTime)"/>
        <t-cell title="结算金额" :note="'¥'+billDetailInfo.settlementSum"/>
      </t-cell-group>
    </div>

    <t-divider content="账单明细"/>

    <BillCard v-for="(item,index) in billDetailInfo.commodityList" :key="index" :billDetailInfo="item"/>
    <t-loading theme="dots" size="40px" style="margin-top: 10px;" :loading="loading" v-show="loading"/>
    <t-footer text="-- 没有更多了 --" style="margin: 10px 0 20px 0;" :loading="!loading" v-show="!loading"/>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import BillCard from "@/pages/myBill/BillCard.vue";
import {timestampToDateTime} from "@/utils/date";
import {request} from "@/utils/request";
import {setObjToUrlParams} from "@/utils/request/utils";
import {BASE_URL} from "@/pages/myBill/constants";

const route = useRoute();
const router = useRouter();

/**
 * data
 */
const loading = ref(false);
const billDetailInfo = ref({});

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
  loading.value = true;
  request.get({
    url: setObjToUrlParams(BASE_URL.billDetailsList, route.query)
  }).then((res) => {
    console.log(res)
    billDetailInfo.value = res[0];
  }).catch((err) => {
    console.log(err);
  }).finally(() => {
    loading.value = false;
  })
});

/**
 * 操作钩子
 */
const handleClick = () => {
  window.history.back();
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
    width: 100%;
    margin-top: 58px;
    margin-bottom: 10px;
  }
}
</style>