import Vue from 'vue'
import VueRouter from 'vue-router'
import TrafficLightBody from '../components/TrafficLitghtBody'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/red'
  },
  {
    path: '/:color',
    component: TrafficLightBody,
    props: true
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
