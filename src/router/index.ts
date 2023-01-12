import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Feedback from '../views/Feedback.vue'
import Search from "../views/Search.vue"
import Users from "@/views/Users.vue";
import Teams from "@/views/Teams.vue";
import WriteUps from "@/views/WriteUps.vue";
import CTF from "@/views/CTF.vue";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
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
    {
        path: '/users',
        name: 'default-users',
        component: Users
    },
    {
        path: '/users/:id',
        name: 'users',
        component: Users
    },
    {
        path: '/teams',
        name: 'teams',
        component: Teams
    },
    {
        path: '/writeups',
        name: 'writeups',
        component: WriteUps
    },
    {
        path: '/ctfs',
        name: 'ctfs',
        component: CTF
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
