import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/homeIndex/index'
// import BMSmonitor from '@/views/BMSmonitor/index'
// import EnergyStorage from '@/views/energyStorage/index'
// import PCSMonitor from '@/views/PCSMonitor/index'
import autoLogin from '@/views/login/autoLogin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'default',
      redirect(to) {
        return 'autologin'
      }
    },
    {
      path: '/autologin',
      name: 'autologin',
      component: autoLogin
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    // {
    //   path: '/BMSmonitor',
    //   name: 'BMSmonitor',
    //   component: BMSmonitor
    // },
    // {
    //   path: '/EnergyStorage',
    //   name: 'EnergyStorage',
    //   component: EnergyStorage
    // },
    // {
    //   path: '/PCSMonitor',
    //   name: 'PCSMonitor',
    //   component: PCSMonitor
    // },



  ]
})
