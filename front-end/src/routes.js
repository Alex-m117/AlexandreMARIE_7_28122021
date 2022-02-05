import { createRouter, createWebHistory } from 'vue-router'
import Auth from './components/Auth.vue';
import Home from './components/Home.vue';
import Post from './components/Post.vue';

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
        path: '/post/',
        name: "Post",
        component: Post,
    },
];

const router = createRouter({ history: createWebHistory(), routes });


export default router;