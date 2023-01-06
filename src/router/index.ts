import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Search from '../views/Search.vue'
import Feedback from '../views/Feedback.vue'
import Notes from "../views/Notes.vue"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/notes',
        name: 'notes',
        component: Notes
    },
    {
        path: '/search',
        name: 'search',
        component: Search
    },
    {
        path: '/feedback',
        name: 'feedback',
        component: Feedback
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
