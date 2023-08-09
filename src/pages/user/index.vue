<!--
  * @author baoyuhao
  * @date 2023/8/9 14:26:23
  * @description 
  * @version 0.8.0
-->
<template>
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
import router from "@/router";

/**
 * data
 */
const value = ref('user');
const list = ref([
  {value: 'home', label: '首页', icon: 'home'},
  {value: 'user', label: '我的', icon: 'user'},
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
  });
}

/**
 * 业务相关
 */
</script>

<style lang="less" scoped>

</style>