import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/common/common.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-registerd-users',
  templateUrl: './registerd-users.page.html',
  styleUrls: ['./registerd-users.page.scss'],
})
export class RegisterdUsersPage implements OnInit {
  private usersList: any[];

  constructor( private commonService: CommonService, private loadingController: LoadingController) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.usersList = [];
    this.getUserData();
  }
  async getUserData() {
    const loader =  await this.loadingController.create({
      spinner: 'bubbles'
    });
    await loader.present();
    this.commonService.getUserData().then(response => {
          loader.dismiss();
          console.log('firebase data = ', response.val());
          response.forEach(element => {
            this.usersList.push(element.toJSON());
          });
          console.log('this.usersList = ', this.usersList);
        }).catch(error => {
          loader.dismiss();
          console.log('error  = ', error);
        });
  }
}
