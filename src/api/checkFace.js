import request from '@/utils/request'

/**
 * 获取配置表指定key内容
 */
 export function findConfig(query) {
    return request({
        url: "/dcenter/facerecog/findConfig",
        method: "post",
        params: query,
    });
}
/**
 * 获取页面链接信息
 */
 export function linkInfo(query) {
    return request({
        url: "/dcenter/facerecog/linkInfo",
        method: "post",
        params: query,
    });
}
/**
 * 人脸识别
 */
 export function frontFaceRecog(query) {
    return request({
        url: "/dcenter/facerecog/frontFaceRecog",
        method: "post",
        params: query,
    });
}