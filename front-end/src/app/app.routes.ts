import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./crud/crud').then((module) => module.Crud),
	},
	{ path: '**', redirectTo: '' },
];
