<!--
  * @author baoyuhao
  * @date 2023/8/13 21:13:11
  * @description 报单卡片
  * @version 0.8.0
-->
<template>
  <t-collapse theme="card" style="margin-top: 10px;" :expandIcon="false" class="collapse">
    <t-collapse-panel value="0">
      <template #header>
        <div class="declarationHeader">
          <div class="declarationTitle">
            <t-tag variant="outline" theme="primary">1</t-tag>
            <div>{{ declarationInfo.goodsName }}</div>
          </div>
          <div class="declarationInfo">
            <div>{{ declarationInfo.goodsNum }}</div>
            <div>{{ declarationInfo.goodsDate }}</div>
          </div>
          <div class="declarationOptions">
            <t-tag variant="outline" theme="primary" style="margin-right: 0;">{{ declarationInfo.goodsStatus }}</t-tag>
          </div>
        </div>
      </template>
      <div class="declarationContent">
        <div class="contentInfo">
          <div style="width: 50%;">订单号：</div>
          <div style="width: 50%;">微信名：</div>
        </div>
        <div class="contentInfo">
          <div style="width: 50%;">实付金额：</div>
          <div style="width: 50%;">返款折扣：</div>
        </div>
        <div class="contentInfo">
          <div style="width: 100%;">预计返款金额：</div>
        </div>
        <div class="contentInfo">
          <div style="width: 100%;">报单时间：</div>
        </div>
        <div class="contentInfo">
          <div style="width: 100%;">订单备注：</div>
        </div>
        <div class="contentInfo" style="margin-top: 20px;">
          <div style="width: 100%;">申请返款时间：</div>
        </div>
        <div class="contentInfo">
          <div style="width: 100%;">结算ID：</div>
        </div>
        <div class="contentInfo">
          <div style="width: 50%;">结算时间：</div>
          <div style="width: 50%;">结算金额：</div>
        </div>
        <div class="contentInfo">
          <div style="width: 100%;">审核备注：</div>
        </div>
        <div></div>
        <div></div>
      </div>
    </t-collapse-panel>
  </t-collapse>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";

const props = defineProps({
  declarationInfo: Object
});
/**
 * data
 */
const declarationInfo = reactive(props.declarationInfo);

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
.collapse {
  width: 95%;

  .declarationHeader {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;

    .t-tag {
      margin-right: 10px;
    }

    .declarationTitle {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .declarationInfo {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      color: #aaa;
    }

    .declarationOptions {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 10px;
    }
  }

  .declarationContent {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;

    .contentInfo {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #999;
      font-size: 15px;
      font-weight: bold;
    }
  }
}
</style>