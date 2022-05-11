<template>
  <transition name="fadeOut">
    <div class="wrap" v-if="showToast">
      <div class="content" v-if="this.content.indexOf('</br>') !== -1">{{content}}</div>
      <div class="content" V-else v-html="content"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'comToast',
  data () {
    return {
      showToast: false,
      content: '',
      timer: null
    }
  },
  methods: {
    show (content = '', timeout = 500) {
      this.content = content
      this.showToast = true
      return new Promise(resolve => {
        this.timer = setTimeout(() => {
          this.showToast = false
          resolve()
        }, timeout)
      })
    },
    remove () {
      clearTimeout(this.timer)
      this.showToast = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .wrap{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    display: flex;
    display: flex;
    align-items: center;
    justify-content: center;
    .content{
      max-width: 80%;
      font-size: 16px;
      line-height: 22px;
      text-align: center;
      background-color: rgba(54,56,77,0.9);
      color: #fff;
      border-radius: 5px;
      padding: 12px 14px;
    }
  }
  .fadeOut-leave-active{
    animation:modalToggle 1s reverse;
  }
  @keyframes modalToggle {
    0% {
      // transform: scale(1.2);
      opacity: 0;
    }
    // 50% {
    //   transform: scale(1.5);
    // }
    100% {
      // transform: scale(1);
      opacity: 1;
    }
  }
</style>
