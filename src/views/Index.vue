<template>
<div class="page">
  <div class="webcontent">
    <img src="~@/assets/images/authentication/wap.jpg"/>
    <p>请您使用手机打开链接进行人脸识别，谢谢配合！</p>
  </div>
  <div class="authentication-back" v-if="modifyShow">
    <div class="authentication-pop">
      <div class="top-title">
        <span>身份验证</span>
      </div>
      <div class="face-recognition">
        <div class="recognition-img">
          <img src="~@/assets/images/authentication/rlsb.jpg" v-if="!previewImgFun" />
          <img v-else :src="previewImgFun" :class="{ ImgOne: previewImgFun }" />
          <p>请<a>{{ clientName }}</a>进行自拍</p>
        </div>
        <div class="camera-img" @click="h5ChooseImage">
          <input
            ref="h5input"
            type="file"
            id="bankCard_id-face"
            name="face"
            accept="image/*"
            capture="user"
            class="choosefile"
            @change="getBaseImg64($event)"
          />
          <img src="~@/assets/images/authentication/sxt_03.png" />
        </div>
        <div class="agreement-data">
          <div
            class="not-agree iconfont"
            style="color: rgb(136, 136, 136)"
            @click="(agreementStatus = true), (tickStatus = '')"
            v-if="agreementStatus === false"
          >
            
          </div>
          <div
            class="agree iconfont"
            style="display: block"
            @click="(agreementStatus = false), (tickStatus = 'Y')"
            v-else
          >
            
          </div>
          <div class="checkbox-data">
            本人已阅读并同意
            <a @click="agreementData">《人脸识别授权协议书》</a>
          </div>
        </div>
        <div class="precautions-list">
          <span>注意事项</span>
          <p>
            1.为了保证您的权益，本次业务将采用人脸
            <br />识别的方式核实申请人身份
          </p>
          <p>2.点击上方按钮，按照下列要求<strong>自拍</strong></p>
        </div>
        <div class="figure-civilization">
          <div class="civilization-img">
            <img src="~@/assets/images/authentication/sj.png" />
            <span>正对手机</span>
          </div>
          <div class="civilization-img">
            <img src="~@/assets/images/authentication/dp.png" />
            <span>光线充足</span>
          </div>
          <div class="civilization-img">
            <img src="~@/assets/images/authentication/yj.png" />
            <span>摘掉眼镜</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 人脸识别授权协议书 -->
    <pop-ups ref="popUps" :agreementContent="agreementContent"></pop-ups>
  </div>
  </div>
</template>

<script>
import popUps from "@/components/popUps"
import * as api from "@/api/checkFace"// api

export default {
  components: {
    popUps,
  },
  data() {
    return {
      agreementStatus: false,
      modifyShow: false,
      // 图片预览
      previewImg: "",
      // 用户姓名
      clientName: "",
      // 勾选状态
      tickStatus: "",
      // 链接uid
      linkUid: '',
      // 图片压缩比
      quality: "0.3",
      imgHeight: "",
      imgWidth: "",
      base64: "",

      // 协议内容
      agreementContent:'1、本人明确知晓并同意授权中宏人寿保险有限公司（中宏人寿）获取包括本人头像照在内本人个人信息运用于为本人提供的保单业务；2、本人同时授权为保单业务提供技术服务的第三方合法征信机构有权获取本人的个人信息，中宏人寿将要求第三方合法征信机构对本人的个人信息提供符合中国法律法规规定的保护；3、本人明确知晓并同意，通过微信提交的所有资料都会经过微信运营商的存储服务器，处于微信运营商控制下的客户资料的信息安全及隐私保护责任由微信运营商负责，适用微信运营商的信息安全及隐私保护政策。'
    };
  },
  computed: {
    previewImgFun() {
      return this.previewImg;
    },
  },
  mounted() {
    if(this.common.isMobilePhone()) {
      this.modifyShow = true
      // 获取配置表指定key内容
      api.findConfig({"configKey":"Facefront:picChange"}).then((res) => {
        if(res.mslResultCode === '0000' && this.common.isNotNull(res.body)) {
          this.quality = res.body.configValue
        }
      }).catch(() => {})

      this.linkUid = this.common.getParam('uid')// 获取地址中的uid
      // 获取人脸识别次数
      this.getLinkInfo(this.linkUid)
    }
  },
  methods: {
    h5ChooseImage() {
      if(this.agreementStatus === false) {
        this.$toast.show('请勾选人脸识别授权协议书')
      }else{
        this.$refs.h5input.dispatchEvent(new MouseEvent("click"))
      }
    },
    // 获取页面链接信息
    getLinkInfo(linkUid) {
      this.$loading.show()
      api.linkInfo({'linkUid':linkUid}).then((res) => {
        this.$loading.hide()
        this.clientName = res.body.name
        if(res.mslResultCode === '0001') {
          this.$confirm.warn({
            type: 'success',
            btnshow: false,
            content: '您已完成人脸识别，谢谢！',
          })
        }else if(res.mslResultCode === '0002') {
          this.$confirm.warn({
            btnshow: false,
            content: '人脸识别超限，您可以联系95383处理，谢谢！',
          })
        }else if(res.mslResultCode === '0003') {
          this.$confirm.warn({
            btnshow: false,
            content: '人脸识别链接已失效，您可以联系95383处理，谢谢！',
          })
        }
      }).catch(() => {

      });
    },
    
    // 人脸识别
    h5checkFace(showImageStr,imgWidth, imgHeight,fileFormat) {
      this.$loading.show()
      let deviceType = ''
      let deviceOS = ''
      if(this.common.isNotNull(this.common.mobileInfo())) {
        deviceType = this.common.mobileInfo().deviceType
        deviceOS = this.common.mobileInfo().deviceOS
      }
      let data = {
        linkUid: this.linkUid,
        imgStr: showImageStr,
        deviceType: deviceType,
        deviceOS: deviceOS,
        picType: fileFormat,
        PicWidth: imgWidth,
        PicHeight: imgHeight
      }
      api.frontFaceRecog(data).then((res) => {
        this.$loading.hide()
          if (res.mslResultCode === '0000') {
            this.$confirm.warn({
              type: 'success',
              title:'提交成功',
              btnshow: false,
              content: '人脸识别通过，谢谢！',
            })
          }else if(res.mslResultCode === '0001') {
            this.$confirm.warn({
              type: 'success',
              btnshow: false,
              content: '您已完成人脸识别，谢谢！',
            })
          }else if(res.mslResultCode === '0002') {
            this.$confirm.warn({
              btnshow: false,
              content: '人脸识别超限，您可以联系95383处理，谢谢！',
            })
          }else if(res.mslResultCode === '0003') {
            this.$confirm.warn({
              btnshow: false,
              content: '人脸识别链接已失效，您可以联系95383处理，谢谢！',
            })
          }
        }).catch(() => {
          
        });
    },
    
    // 图片处理
    getFile(file, callback) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function (e) {
        // console.log("压缩前图片大小"+(file.size/1024).toFixed(2))
        let fileFormat = file.type;
        fileFormat = fileFormat.replace("image/", "");
        callback(e.target.result, file.size, fileFormat);
      };
    },
    processImages(fileType, result, fileSize, quality, callback) {
      let img = new Image();
      img.onload = function () {
        // // 最大尺寸限制
        let maxWidth = 2500;
        let maxHeight = 2500;
        // // 图片原始尺寸
        let originWidth = img.width;
        let originHeight = img.height;
        // // 目标尺寸
        let targetWidth = originWidth;
        let targetHeight = originHeight;
        // 图片尺寸超过300x300的限制
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
          }
        }

        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        // canvas对图片进行缩放
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        ctx.clearRect(0, 0, targetWidth, targetHeight);
        // 绘制图片
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        // quality值越小，所绘制出的图像越模糊
        let base64 = "";
        if (quality !== "") {
          base64 = canvas.toDataURL("image/jpeg", quality);
        } else {
          base64 = canvas.toDataURL("image/jpeg");
        }
        callback(base64, fileType, originWidth, originHeight);
        // callback(result, fileType, originWidth, originHeight)
      };
      img.src = result;
    },
    getBaseImg64(dataObj, isHeadRemoval) {
      var file = document.getElementById("bankCard_id-face").files[0];
      var _this = this
      this.getFile(file, (imageStr, size, fileFormat) => {
        if (
          fileFormat !== "jpeg" &&
          fileFormat !== "png" &&
          fileFormat !== "jpg"
        ) {
          _this.$toast.show("文件格式不正确，请上传jpeg, png或jpg格式的图片");
          document.getElementById("bankCard_id-face").value = null
          return;
        }
        let maxSize = 10;
        if (size > maxSize * 1024 * 1024) {
          _this.$toast.show("图片大小超过" + maxSize + "M, 无法上传！");
          document.getElementById("bankCard_id-face").value = null
          return;
        }
        this.processImages(
          "",
          imageStr,
          size,
          this.quality,
          (image, fileType, imageWidth, imageHeight) => {
            // 图片大小超过限制
            if (image === null && fileType === null) {
              return;
            }
            let map = {};
            map.showImageStr = image; // 压缩后直接可显示的图片数据
            _this.previewImg = image
            if (isHeadRemoval) {
              // 去除头部
              imageStr = image.replace(/^data:image\/\w+;base64,/, "");
            }
            map.imageStr = imageStr; // 解析后的图片
            map.fileFormat = fileFormat; // 文件后缀
            map.imageWidth = imageWidth; // 图片宽度
            map.imageHeight = imageHeight; // 图片高度
            // 人脸验证
            _this.h5checkFace(map.showImageStr,map.imageWidth,map.imageHeight,map.fileFormat)
          }
        );
      });
    },
    addBaseImageHead (imageStr) {
      return 'data:image/png;base64,' + imageStr
    },
    // 去除base64图片字符串，头部信息
    removeBase64ImageHead (imageStr) {
      return imageStr.replace(/^data:image\/\w+;base64,/, '')
    },
    // 人脸识别授权协议书
    agreementData() {
      this.$refs.popUps.isShow();
    },
    //base64图片大小
    showSize(base64url) {
      //把头部去掉
      let str = base64url.replace('data:image/png;base64,', '');
      // 找到等号，把等号也去掉
      let equalIndex = str.indexOf('=');
      if (str.indexOf('=') > 0) {
        str = str.substring(0, equalIndex);
      }
      // 原来的字符流大小，单位为字节
      let strLength = str.length;
      // 计算后得到的文件流大小，单位为字节
      let fileLength = parseInt(strLength - (strLength / 8) * 2);
      // 由字节转换为kb
      let size = "";
      size = (fileLength / 1024).toFixed(2);
      let sizeStr = size + ""; //转成字符串
      let index = sizeStr.indexOf("."); //获取小数点处的索引
      let dou = sizeStr.substr(index + 1, 2) //获取小数点后两位的值
      if (dou == "00") { //判断后两位是否为00，如果是则删除00                
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
      }
      return size;
    },
  },
  
};
</script>

<style lang="scss" scoped>
.webcontent {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9;
  background-color: #fff;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  padding-top: 20vh;
  text-align: center;
}
.webcontent p{
  font-size: 20px;
  line-height: 40px;
  color: #474747;
}
.authentication-back {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  .authentication-pop {
    margin: auto;
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: auto;
    .top-title {
      width: 100%;
      height: 40px;
      background: #009933;
      text-align: center;
      span {
        font-size: 18px;
        line-height: 40px;
        color: #fff;
      }
    }
    .face-recognition {
      .recognition-img {
        text-align: center;
        img {
          // width: 200px;
          height: 200px;
          padding: 15px 0px 10px 0px;
        }
        .ImgOne {
          width: 260px;
        }
        p {
          font-size: 14px;
          margin-bottom: 10px;
          a {
            color: #838fe1;
          }
        }
      }
      .camera-img {
        width: 80%;
        height: 40px;
        background: #00a64a;
        margin: auto;
        border-radius: 5px;
        text-align: center;
        img {
          width: 30px;
          padding-top: 8px;
        }
        input {
          display: none;
        }
      }
      .agreement-data {
        margin: 10px 0px 4px 36px;
        display: flex;
        flex-wrap: nowrap;
        .checkbox-statu {
          width: 20px;
          height: 20px;
          border: 1px solid;
          img {
            width: 20px;
          }
        }
        .agree {
          color: #009933;
        }
        .checkbox-data {
          margin-left: 4px;
          a {
            color: #009933;
            text-decoration: underline;
          }
        }
      }
      .precautions-list {
        width: 100%;
        span {
          display: inline-block;
          width: 100%;
          height: 30px;
          background: #f5f5f9;
          color: #999;
          line-height: 30px;
          text-indent: 28px;
        }
        p {
          padding: 6px 0px 0px 30px;
          color: #474747;
          font-size: 14px;
        }
      }
      .figure-civilization {
        margin-top: 15px;
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-around;
        margin-bottom: 50px;
        .civilization-img {
          display: flex;
          flex-wrap: wrap;
          width: 100px;
          img {
            margin: auto;
            width: 80px;
          }
          span {
            color: #474747;
            margin: auto;
            padding: 10px 0px 10px 0px;
          }
        }
      }
    }
    .loading_Img {
      position: fixed;
      top: 50%;
      left: 50%;
    }
  }
  .iconfont {
      display: flex;
      align-content: center;
      font-size: 22px;
      color: #459855;
    }
}
</style>