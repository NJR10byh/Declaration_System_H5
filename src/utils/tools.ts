/**
 * @author baoyuhao
 * @date 2023/8/29 16:45:36
 * @description
 * @version 0.1.0
 */

import {isNotEmpty} from "@/utils/validate";
import copy from 'copy-to-clipboard';
import {Toast} from "tdesign-mobile-vue";

/**
 * 复制内容到剪贴板
 * @param info
 */
export const copyInfo = (info: string) => {
    if (isNotEmpty(info)) {
        copy(info) ? Toast.success("已复制") : Toast.error("复制失败");
    } else {
        Toast.error("复制值为空")
    }
};