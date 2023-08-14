<!--
  * @author baoyuhao
  * @date 2023/8/14 14:44:50
  * @description 
  * @version 0.8.0
-->
<template>
  <t-navbar title="我的账单" fixed left-arrow style="z-index: 2000" @left-click="handleClick"/>
  <div class="my-bill-container">
    <t-cell-group class="cellGroup" theme="card">
      <t-cell v-for="(item,index) in billList" :key="index" :title="item.date" :note="'¥'+item.money" arrow
              @click="getDetail(item)"/>
    </t-cell-group>
    <t-footer text="-- 没有更多了 --" style="margin: 10px 0 20px 0;"/>
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
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();

/**
 * data
 */
const barValue = ref('');
const barList = ref([
  {value: 'home', label: '首页', icon: 'home'},
  {value: 'user', label: '我的', icon: 'user'},
]);

const billList = reactive([
  {
    date: "2021-08-14 14:44:50",
    money: "1012",
  },
  {
    date: "2021-08-15 17:12:20",
    money: "4576",
  }
])

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
const handleClick = () => {
  window.history.back();
}
// 切换tab
const switchTab = (item: any) => {
  router.push({
    path: `/${item.value}`
  })
};

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
.my-bill-container {
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
  }
}
</style>