import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterdUsersPageRoutingModule } from './registerd-users-routing.module';

import { RegisterdUsersPage } from './registerd-users.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterdUsersPageRoutingModule,
    SharedModule
  ],
  declarations: [RegisterdUsersPage]
})
export class RegisterdUsersPageModule {}
