<!--
  * @author baoyuhao
  * @date 2023/8/14 15:45:23
  * @description 
  * @version 0.8.0
-->
<template>
  <div class="bill-card-container">
    <t-cell-group class="cellGroup" theme="card">
      <t-cell title="订单号" :note="billDetailInfo.orderId"/>
      <t-cell title="商品名称" :note="billDetailInfo.goodsName"/>
      <t-cell title="结算金额" :note="'¥'+billDetailInfo.goodsMoney"/>
    </t-cell-group>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";

const props = defineProps({
  billDetailInfo: Object
});

/**
 * data
 */
const billDetailInfo = reactive(props.billDetailInfo);

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

/**
 * 业务相关
 */
</script>

<style lang="less" scoped>
.bill-card-container {
  width: 95%;
  margin-top: 10px;
}
</style>