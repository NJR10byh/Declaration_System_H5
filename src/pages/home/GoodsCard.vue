<!--
  * @author baoyuhao
  * @date 2023/8/8 20:26:43
  * @description 商品卡片
  * @version 0.8.0
-->
<template>
  <div class="goodsCard">
    <div class="goodsInfo">
      <div class="name">{{ goodsName }}</div>
      <div class="deadline">截止日期：{{ deadline }}</div>
    </div>
    <t-divider/>
    <div class="options">
      <div class="left">剩余额度：{{ remainingAmount }}</div>
      <div class="btns">
        <t-button theme="primary" variant="outline" size="small" style="margin-right: 5px;">复制</t-button>
        <t-button theme="primary" size="small">去报单</t-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";

/**
 * data
 */
const props = defineProps({
  goodsName: String,
  deadline: String,
  remainingAmount: String,
  type: String,
});

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
.goodsCard {
  width: 100%;
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  margin-top: 10px;

  &:first-child {
    margin-top: 0;
  }

  .goodsInfo {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .name {
      width: 100%;
      font-size: 16px;
      font-weight: bold;
    }

    .deadline {
      width: 100%;
      font-size: 12px;
      color: #999;
      margin-top: 3px;
    }
  }

  .options {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      font-size: 16px;
    }
  }
}
</style>