import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // Health facility.
  {
    path: '/HealthFacility/personOnboarding',
    name: 'personOnboard',
    component: () => import('@/views/HealthFacility/personOnboarding.vue')
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
