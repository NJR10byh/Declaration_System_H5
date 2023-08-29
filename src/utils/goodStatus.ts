/**
 * @author baoyuhao
 * @date 2023/3/25 1:16:07
 * @description 转化状态判断
 * @version 0.1.0
 */

/**
 * 转状态文本
 * @param status
 */
export const statusCodeToText = (status: number) => {
    // 状态
    switch (status) {
        case 0:
            return "已报单";
        case 1:
            return "待审核";
        case 2:
            return "待返款";
        case 3:
            return "已返款";
        case 4:
            return "已作废";
        case 5:
            return "今日";
        case 6:
            return "全部";
    }
};

/**
 * 转状态码
 * @param statusText
 */
export const statusTextToCode = (statusText: string) => {
    switch (statusText) {
        case "已报单":
            return 0;
        case "待审核":
            return 1;
        case "待返款":
            return 2;
        case "已返款":
            return 3;
        case "已作废":
            return 4;
        case "今日":
            return 5;
        case "全部":
            return 6;
    }
}