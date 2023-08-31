<!--
  * @author baoyuhao
  * @date 2023/8/14 14:44:50
  * @description 
  * @version 0.8.0
-->
<template>
  <t-navbar title="我的账单" fixed left-arrow style="z-index: 2000" @left-click="handleClick"/>
  <div class="my-bill-container">
    <div class="cellGroup">
      <t-cell-group theme="card">
        <t-cell v-for="(item,index) in billList" :key="index" :title="timestampToDateTime(item.payTime)"
                :note="'¥'+item.settlementSum" arrow @click="getDetail(item)"/>
      </t-cell-group>
    </div>
    <t-loading theme="dots" size="40px" style="margin-top: 10px;" :loading="loading" v-show="loading"/>
    <t-footer text="-- 没有更多了 --" style="margin: 10px 0 20px 0;" :loading="!loading" v-show="!loading"/>
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
import {h, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {request} from "@/utils/request";
import {BASE_URL} from "./constants";
import {timestampToDateTime} from "@/utils/date";
import {Toast} from "tdesign-mobile-vue";
import {ErrorCircleIcon} from "tdesign-icons-vue-next";

const router = useRouter();

/**
 * data
 */
const loading = ref(false);

const barValue = ref('');
const barList = ref([
  {value: 'home', label: '首页', icon: 'home'},
  {value: 'user', label: '我的', icon: 'user'},
]);

const billList = ref([])

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
  getMyBill();
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
const getMyBill = () => {
  billList.value = [];
  loading.value = true;
  request.get({
    url: BASE_URL.billList
  }).then(res => {
    console.log(res);
    billList.value = res;
  }).catch(err => {
    Toast({
      icon: () => h(ErrorCircleIcon),
      direction: 'column',
      message: err.message,
    });
  }).finally(() => {
    loading.value = false;
  })
}
const getDetail = (item: any) => {
  router.push({
    path: `/billDetail`,
    query: {id: item.id}
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
    width: 100%;
    margin-top: 58px;
  }
}
</style>