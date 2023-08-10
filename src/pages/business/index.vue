<!--
  * @author baoyuhao
  * @date 2023/8/10 17:44:57
  * @description 
  * @version 0.8.0
-->
<template>
  <div class="demo-tab-bar">
    <t-tabs v-model="tabValue">
      <t-tab-panel value="今日" :badge-props="{ count: babgeCount.today, offset: [-8, 3] }" label="今日"/>
      <t-tab-panel value="全部" :badge-props="{ count: babgeCount.all, offset: [-8, 3] }" label="全部"/>
      <t-tab-panel value="已报单" :badge-props="{ count: babgeCount.declared, offset: [-8, 3] }" label="已报单"/>
      <t-tab-panel value="待审核" :badge-props="{ count: babgeCount.waitApproval, offset: [-8, 3] }" label="待审核"/>
      <t-tab-panel value="待返款" :badge-props="{ count: babgeCount.waitBackMoney, offset: [-8, 3] }" label="待返款"/>
      <t-tab-panel value="已返款" :badge-props="{ count: babgeCount.waitBackMoney, offset: [-8, 3] }" label="已返款"/>
      <t-tab-panel value="已作废" :badge-props="{ count: babgeCount.waitBackMoney, offset: [-8, 3] }" label="已作废"/>
    </t-tabs>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";

/**
 * data
 */
const tabValue = ref("全部");
const babgeCount = reactive({
  today: 0,
  all: 0,
  declared: 0,
  waitApproval: 0,
  waitBackMoney: 0
})

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

</style>