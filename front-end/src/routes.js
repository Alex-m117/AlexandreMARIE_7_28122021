import { createRouter, createWebHistory } from 'vue-router'
import Auth from './components/Auth.vue';
import Home from './components/Home.vue';
import Post from './components/Post.vue';
import User from './components/User.vue';

const routes = [
    {   
        path: '/',
        name: "Auth",
        component: Auth,
    },
    {   
        path: '/home',
        name: "Home",
        component: Home,
    },
    {   
        path: '/post/:id',
        name: "Post",
        component: Post,
    },
    {   
        path: '/user/:userId',
        name: "User",
        component: User,
        props: true,
    },
];

const router = createRouter({ history: createWebHistory(), routes });


export default router;