import { Routes } from '@angular/router';
import { Socios } from './socios/socios';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: Socios
    }
];
