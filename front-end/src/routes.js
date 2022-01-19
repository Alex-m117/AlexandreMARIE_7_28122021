import { createRouter, createWebHistory } from 'vue-router'
import Auth from './components/Auth';


const routes = [
    {   
        path: '/',
        name: "Auth",
        component: Auth,
    },
    
];

const router = createRouter({ history: createWebHistory(), routes });


export default router;