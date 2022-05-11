<template>
  <div class="alert-wrap" :class="className" v-if="show">
    <div class="cont-wrap">
      <img class="header-img" :src="imgUrl">
      <div class="txt"> 
        <header>{{pageConfig.title}}</header>
        <div class="cont"
             v-html="pageConfig.content"></div>
        <div class="listCont">
          <div class="list-item"
               v-for="(item,index) in pageConfig.contentList"
               :key="index">
            <span class="index">{{index + 1}}、</span>
            <span class="lcont"
                  v-html="item"></span>
          </div>
        </div>
      </div>
      <div class="btn-wrap" v-if="pageConfig.btnshow">
        <!-- <button @click="cancel"
                class="btn-ele cancel">{{pageConfig.cancelText}}</button> -->
        <button @click="sure" class="btn-ele sure">{{pageConfig.sureText}}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'confirmTemplate',
  data () {
    return {
      show: false,
      imgUrl: require('@/assets/images/warn.png'),
      successUrl: require('@/assets/images/success.png'),
      resolve: () => { },
      reject: () => { },
      className: '',
      pageConfig: {
        type: '', // 弹框图标类型，默认警示图标，success时为确认图标
        title: '提示',
        content: '',
        btnshow: true,
        sureText: '确认',
        // cancelText: '取消',
        contentList: []
      }
    }
  },
  methods: {
    warn (opt = {}, className = '') {
      opt.type === 'success' ? this.imgUrl = this.successUrl : this.imgUrl
      this.pageConfig.title = opt.title || '提示'
      this.pageConfig.content = opt.content || ''
      opt.btnshow === false ? this.pageConfig.btnshow = false : this.pageConfig.btnshow
      this.pageConfig.sureText = opt.sureText || '确认'
      // this.pageConfig.cancelText = opt.cancelText || '取消'
      this.pageConfig.contentList = []
      // 调用h5弹窗

      this.show = true
      this.className = className
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },

    showBase (opt) {
      this.show = true
      // this.className = 'base'
      Object.assign(this.pageConfig, opt)
      this.pageConfig.contentList = []
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    showBaseWithIndex (opt) {
      this.show = true
      // this.className = 'base'
      Object.assign(this.pageConfig, opt)
      this.pageConfig.content = ''
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    sure () {
      this.resolve(true)
      this.show = false
    },
    // cancel () {
    //   this.show = false
    //   this.resolve(false)
    // },
    close () {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.alert-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(51, 51, 51, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  .cont-wrap {
    width: 80%;
    overflow: hidden;
    position: relative;
    border-radius: 5px;
    background: #fff;
    padding: 20px 0;
    text-align: center;
      .header-img{
        width:40px;
        height:40px;
        position: relative;
        top: -20px;
      }
      .txt {
        width: 80%;
        margin:0 auto;
        font-size: 16px;
        color: #333;
        line-height: 22px;
        header {
          font-weight: bold;
          font-size: 20px;
          color: #00a64a;
        }
        .cont {
          margin: 32px 0;
        }
        .listCont {
          .list-item {
            display: flex;
            margin-bottom: 20px;
            .index {
              flex-shrink: 0;
            }
            .lcont {
              text-align: justify;
            }
          }
        }
      }
      .btn-wrap {
        margin: 20px auto;
        text-align: center;
        .btn-ele {
          padding: 12px 0;
          border-radius:5px;
          font-size: 18px;
          line-height: 18px;
          display: block;
          width: 80%;
          margin: 0 auto;
          border: none;
        &.sure {
          background: #00a64a;
          color: #fff;
        }
      }
    }
  }
}
</style>
