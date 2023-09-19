<!--
  * @author baoyuhao
  * @date 2023/8/8 20:26:43
  * @description 商品卡片
  * @version 0.8.0
-->
<template>
  <div class="goodsCard">
    <div class="goodsInfo">
      <div class="name">{{ goodsInfo.commodity }}</div>
      <div class="deadline">截止日期：{{ timestampToDateTime(goodsInfo.endTime) }}</div>
    </div>
    <t-divider/>
    <div class="options">
      <div class="left">剩余额度：{{ goodsInfo.remainAmount }} 元</div>
      <div class="btns">
        <t-button theme="primary" variant="outline" size="small" style="margin-right: 5px;" @click="copyUrl(goodsInfo)">
          复制商品链接
        </t-button>
        <t-button theme="primary" size="small" @click="toReport(goodsInfo)">去报单</t-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";
import router from "@/router";
import {timestampToDateTime} from "@/utils/date";
import {copyInfo} from "@/utils/tools";

const props = defineProps({
  goodsInfo: Object
});

/**
 * data
 */
const goodsInfo = reactive(props.goodsInfo);

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
// 去报单
const toReport = (goodsInfo: any) => {
  console.log(goodsInfo);
  router.push({
    path: '/declaration',
    query: {id: goodsInfo.id}
  })
}

//  复制商品Url
const copyUrl = (goodsInfo: any) => {
  copyInfo(goodsInfo.shoppingUrl);
}

</script>

<style lang="less" scoped>
.goodsCard {
  width: 100%;
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 10px;

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
      font-size: 15px;
    }
  }
}
</style>