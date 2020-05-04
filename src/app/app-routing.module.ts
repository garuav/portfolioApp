import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardPageModule),
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./chat/chat.module').then(m => m.ChatPageModule),
  },
  {
    path: 'registerd-users',
    loadChildren: () => import('./registerd-users/registerd-users.module').then( m => m.RegisterdUsersPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then( m => m.ContactPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
