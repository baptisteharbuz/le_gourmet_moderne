import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import ReservationCalendar from '../views/ReservationCalendar.vue'
import EditReservation from '../views/EditReservation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: { guest: true }
    },
    {
      path: '/reservations',
      name: 'reservations',
      component: ReservationCalendar,
      meta: { requiresAuth: true }
    },
    {
      path: '/edit-reservation/:id',
      name: 'edit-reservation',
      component: EditReservation,
      meta: { requiresAuth: true }
    }
  ]
})

export default router;