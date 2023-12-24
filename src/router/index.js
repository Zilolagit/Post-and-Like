import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/auth/SignUpView.vue')
    },
    {
      path: '/newpost',
      name: 'newpost',
      component: () => import('../views/NewPostView.vue')
    },
    {
      path: '/post/:postid',
      name: 'post-detail',
      component: () => import('../views/PostDetail.vue')
    },
    {
      path: '/user/:userid',
      name: 'user-profile',
      component: () => import('../views/auth/UserProfile.vue')
    },
    {
      path: '/me',
      name: 'my-profile',
      component: () => import('../views/auth/MyProfile.vue')
    },
    {
      path: '/me/posts',
      name: 'my-posts',
      component: () => import('../views/MyPosts.vue')
    },
    {
      path: '/me/liked-posts',
      name: 'liked-posts',
      component: () => import('../views/LikedPosts.vue')
    }
  ]
})

export default router
