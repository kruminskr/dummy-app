import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import AccountView from '../views/AccountView.vue'
import BalanceView from '../views/BalanceView.vue'
import TransactionsView from '../views/TransactionsView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  {
    path: '/',
    name: 'Login page',
    component: LoginView,
  },
  {
    path: '/account',
    name: 'Account page',
    component: AccountView,
  },
  {
    path: '/account/:id/balance',
    name: 'Account balance page',
    component: BalanceView,
  },
  {
    path: '/account/:id/transactions',
    name: 'Account transactions page',
    component: TransactionsView,
  },

  // Route Error handling
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
