import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Feedback from '../views/Feedback.vue'
import Search from "../views/Search.vue"
import Users from "@/views/Users.vue";
import Teams from "@/views/UserTeams.vue";
import WriteUps from "@/views/WriteUps.vue";
import UserCTF from "@/views/UserCTFs.vue";
import CTF from "@/views/CTF.vue"
import flag from "@/views/flag.vue";
import Team from "@/views/Team.vue";
import Challenge from "@/views/Challenge.vue";

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
        path: '/users/:username',
        name: 'users',
        component: Users
    },
    {
        path: '/teams',
        name: 'teams',
        component: Teams
    },
    {
        path: '/teams/:teamName',
        name: 'team',
        component: Team
    },
    {
        path: '/writeups',
        name: 'writeups',
        component: WriteUps
    },
    {
        path: '/ctfs',
        name: 'UserCTFs',
        component: UserCTF
    },
    {
        path: '/ctfs/:id',
        name: 'CTF',
        component: CTF
    },
    {
        path: '/ctfs/:id/:name',
        name: 'Challenge',
        component: Challenge
    },
    {
        path: '/flag',
        name: 'flag',
        component: flag
    },
    {
        path: '/:name',
        name: 'homeName',
        component: Home
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
