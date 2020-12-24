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
  // Contract Delployer. E.g Ministry of health or CDC.
  {
    path: '/ContractManager/registerAHF',
    name: 'ahfRegistration',
    component: () => import('@/views/ContractManager/registerAHF.vue')
  },
  {
    path: '/ContractManager/managerLanding',
    name: 'contractMngrIndexPg',
    component: () => import('@/views/ContractManager/managerLanding.vue')
  },
  // Health facility.
  {
    path: '/HealthFacility/healthFacIndexPg',
    name: 'indexPgOfAHF',
    component: () => import('@/views/HealthFacility/healthFacIndexPg.vue')
  },
  {
    path: '/HealthFacility/personOnboarding',
    name: 'personOnboard',
    component: () => import('@/views/HealthFacility/personOnboarding.vue')
  },
  // Verifiers.
  {
    path: '/Verifier/verify',
    name: 'torVverification',
    component: () => import('@/views/Verifier/verify.vue')
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
