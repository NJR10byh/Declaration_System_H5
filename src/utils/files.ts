/**
 * @author baoyuhao
 * @date 2023/7/7 15:42:07
 * @description
 * @version 0.1.0
 */

import {request} from "@/utils/request";
import {isNotEmpty} from "@/utils/validate";
import {Message} from "tdesign-mobile-vue";

/**
 * 下载文件
 * @param requestUrl
 * @param requestBody
 */
export const downloadFile = async (requestUrl: any, requestBody: any) => {
    const link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link);
    await request.post({
        url: requestUrl,
        data: requestBody,
        responseType: "blob"
    }).then(res => {
        Message.success({
            content: "已进入后台开始下载，您可以进行其他操作"
        });
        let fileName = "文件";
        if (isNotEmpty(res.headers["content-disposition"])) {
            fileName = decodeURI(res.headers["content-disposition"].split("fileName=")[1]) + ".xls";
        }
        const blob = new Blob([res.data], {
            type: "application/force-download"
        });
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", fileName);
        link.click();
    }).catch(err => {
        Message.error({
            content: err.message
        })
        // Toast({
        //     icon: () => h(ErrorCircleIcon),
        //     theme: "error",
        //     direction: 'column',
        //     message: err.message,
        // });
    })
};