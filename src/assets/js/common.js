import MobileDetect from 'mobile-detect'
export default {
    /**
     * 获取请求URL参数值
     * @return:
     */
    getParam(paramName) {
        return decodeURIComponent((new RegExp('[?|&]' + paramName + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || ['', ''])[1].replace(/\+/g, '%20')) || null
    },
    /**
     * 字符串是否为空
     * @return:
     */
    isNull (data) {
        return data === '' || data === null || data === 'null' || data === 'undefined' || data === undefined
    },
    /**
     * 字符串是否不为空
     * @return:
     */
    isNotNull (data) {
        if (data === '' || data === null || data === 'null' || data === 'undefined' || data === undefined) {
            return false
        } else {
            return true
        }
    },
    /**
     * 获取设备信息
     * @returns 
     */
    mobileInfo(){ 
        //判断数组中是否包含某字符串  
        Array.prototype.contains = function(needle) {  
            for (i in this) {  
                if (this[i].indexOf(needle) > 0)  
                    return i;  
            }  
            return -1;  
        }  
        var deviceType = navigator.userAgent;//获取userAgent信息  
        var md = new MobileDetect(deviceType);//初始化mobile-detect  
        var os = md.os();//获取系统  
        var version = "";//系统的版本号   
        var model = "";  //设备型号
        if (os == "iOS") {//ios系统的处理  
            version =  md.version("iPhone");
            os = md.os();  
            model = md.mobile();  
        } else if (os == "AndroidOS") {//Android系统的处理  
            os = md.os();  
            version = md.version("Android");
            var sss = deviceType.split(";");  
            var i = sss.contains("Build/");  
            if (i > -1) {  
                model = sss[i].substring(0, sss[i].indexOf("Build/"));  
            }  
        }  
        var deviceInfo = {
        deviceType:model, //设备型号
        deviceOS:os+version, //系统类型版本号
        }
        return deviceInfo
    },
    /**
     * 获取当前设备类型
     * @return:
     */
    getDevice () {
        let agent = navigator.userAgent.toLowerCase()
        if (/windows/.test(agent)) {
        return 'windows pc'
        } else if (/iphone|ipod/.test(agent) && /mobile/.test(agent)) {
        return 'iphone'
        } else if (/ipad/.test(agent) && /mobile/.test(agent)) {
        return 'ipad'
        } else if (/android/.test(agent) && /mobile/.test(agent)) {
        return 'android'
        } else if (/linux/.test(agent)) {
        return 'linux pc'
        } else if (/mac/.test(agent)) {
        return 'mac'
        } else {
        return 'other'
        }
    },
    /**
     * 判断当前设备是否是移动端
     * @returns 
     */
    isMobilePhone() {
        const ua = navigator.userAgent.toLowerCase();
        const t1 = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(
            ua
        );
        // const t2 = !ua.match("iphone") && navigator.maxTouchPoints > 1;
        return t1 ;
    },
}