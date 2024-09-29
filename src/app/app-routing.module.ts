import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./Pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'organization',
    loadChildren: () => import('./Pages/organization/organization.module').then( m => m.OrganizationPageModule)
  },
  {
    path: 'activity',
    loadChildren: () => import('./Pages/activity/activity.module').then( m => m.ActivityPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./Pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./Pages/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'items/:poNumber',
    loadChildren: () => import('./Pages/items/items.module').then( m => m.ItemsPageModule)
  },
  {
    path: 'details',
    loadChildren: () => import('./Pages/details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'lot-list',
    loadChildren: () => import('./Pages/lot-list/lot-list.module').then( m => m.LotListPageModule)
  },
  {
    path: 'transaction-history',
    loadChildren: () => import('./Pages/transaction-history/transaction-history.module').then( m => m.TransactionHistoryPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
