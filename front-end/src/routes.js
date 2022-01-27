import { createRouter, createWebHistory } from 'vue-router'
import Auth from './components/Auth';
import Home from './components/Home'

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
    
];

const router = createRouter({ history: createWebHistory(), routes });


export default router;