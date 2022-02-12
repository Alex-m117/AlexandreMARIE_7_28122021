import { createRouter, createWebHistory } from 'vue-router'
import Auth from './components/Auth.vue';
import Home from './components/Home.vue';

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
        component: () => import('./components/Post.vue'),
    },
    {   
        path: '/user/:userId',
        name: "User",
        component: () => import('./components/User.vue'),
        props: true,
    },
];

const router = createRouter({ history: createWebHistory(), routes });


export default router;