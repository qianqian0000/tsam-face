import comToast from './comToast'
import comLoading from './comLoading'
import confirmTemplate from './confirmTemplate'

function extendVue (prototype, prop, constructor, Vue) {
  let vm
  Object.defineProperty(prototype, prop, {
    get () {
      if (vm) {
        return vm
      }
      let div = document.createElement('div')
      document.body.appendChild(div)
      const Constructor = Vue.extend(constructor)
      vm = new Constructor({ }).$mount(div)
      return vm
    }
  })
}

export default function (Vue) {
  extendVue(Vue.prototype, '$toast', comToast, Vue)
  extendVue(Vue.prototype, '$loading', comLoading, Vue)
  extendVue(Vue.prototype, '$confirm', confirmTemplate, Vue)
}

/*
export let loading = (() => {
  let div = document.createElement('div')
  document.body.appendChild(div)
  const Constructor = Vue.extend(comLoading)
  return new Constructor({ }).$mount(div)
})()

export let toast = (() => {
  let div = document.createElement('div')
  document.body.appendChild(div)
  const Constructor = Vue.extend(comToast)
  return new Constructor({ }).$mount(div)
})()
*/