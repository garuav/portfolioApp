import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterdUsersPage } from './registerd-users.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterdUsersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterdUsersPageRoutingModule {}
