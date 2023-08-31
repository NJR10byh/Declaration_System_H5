/**
 * @author baoyuhao
 * @date 2023/7/7 15:42:07
 * @description
 * @version 0.1.0
 */

import {request} from "@/utils/request";
import {isNotEmpty} from "@/utils/validate";
import {Toast} from "tdesign-mobile-vue";
import {h} from "vue";
import {ErrorCircleIcon} from "tdesign-icons-vue-next";

/**
 * 校验文件类型
 * @param targetType 目标类型
 * @param currentType 当前类型
 *
 * tips: MDN规范下的常用文件类型
 * 一个以英文句号（“.”）开头的合法的不区分大小写的文件名扩展名。例如：.jpg、.pdf 或 .doc
 * 字符串 audio/*，表示【任何音频文件】
 * 字符串 video/*，表示【任何视频文件】
 * 字符串 image/*，表示【任何图像文件】
 */
export const validateFileType = (targetType: string, currentType: string) => {
    let mediaType = ["audio/*", "video/*", "image/*"];
    if (mediaType.includes(targetType)) {
        // 检查文件类型是否为非空的、以 "image/" 开头的 MIME 类型
        switch (targetType) {
            case "audio/*":
                return isNotEmpty(currentType) && currentType.startsWith("audio/");
            case "video/*":
                return isNotEmpty(currentType) && currentType.startsWith("video/");
            case "image/*":
                return isNotEmpty(currentType) && currentType.startsWith("image/");
        }
    } else {
        if (targetType !== currentType) {
            return false;
        }
    }
    return true;
};

/**
 * 上传文件异常拦截
 * @param params
 */
export const validateFile = (params: { files: any; type: any; }) => {
    const {type} = params;
    const messageMap = {
        FILE_OVER_SIZE_LIMIT: "文件大小超出限制，请重新上传",
        FILES_OVER_LENGTH_LIMIT: "文件数量超出限制，仅上传未超出数量的文件",
        FILTER_FILE_SAME_NAME: "不允许上传同名文件",
        BEFORE_ALL_FILES_UPLOAD: "beforeAllFilesUpload 方法拦截了文件",
        CUSTOM_BEFORE_UPLOAD: "请上传正确的文件类型"
    };
    messageMap[type] && Toast({
        icon: () => h(ErrorCircleIcon),
        direction: 'column',
        message: messageMap[type],
    });
    ;
};

/**
 * 上传文件
 * @param requestUrl
 * @param formData
 */
export const uploadFile = async (requestUrl: string, formData: FormData, progressCallback: (percentCompleted: number) => void) => {
    return new Promise((resolve, reject) => {
        request.post({
            url: requestUrl,
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            timeout: 30 * 1000,
            onUploadProgress: progressEvent => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                progressCallback(percentCompleted); // 调用回调函数传递进度信息
            }
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
};