import { createRouter, createWebHistory } from 'vue-router'
import Auth from './components/Auth';

const routes = [
    {   
        path: '/',
        name: "Auth",
        component: Auth,
    },
    {   
        path: '/home',
        name: "Home",
        component: () =>
        import ('./components/Home')
    },
    {   
        path: '/post/:id',
        name: "Post",
        component: () =>
        import ('./components/Post')
    },
];

const router = createRouter({ history: createWebHistory(), routes });


export default router;