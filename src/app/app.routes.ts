import { Routes } from '@angular/router';
import { Socios } from './socios/socios';
import { Beneficios } from './beneficios/beneficios';
import { Planos } from './planos/planos';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: Socios
    },{
        path: 'socios',
        component: Socios
    },{
        path: 'beneficios',
        component: Beneficios
    },{
        path: 'planos',
        component: Planos
    }
];
