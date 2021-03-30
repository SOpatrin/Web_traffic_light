import Vue from 'vue'
import VueRouter from 'vue-router'
import TraficLightBody from '../components/TraficLitghtBody'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/red'
  },
  {
    path: '/:color',
    component: TraficLightBody,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
