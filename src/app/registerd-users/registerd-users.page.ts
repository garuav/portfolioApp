import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/common/common.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registerd-users',
  templateUrl: './registerd-users.page.html',
  styleUrls: ['./registerd-users.page.scss'],
})
export class RegisterdUsersPage implements OnInit {
  private usersList: any[];

  constructor( private commonService: CommonService, private loadingController: LoadingController, private route: Router) { }

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
            if (element.key !== ('contact')) {
              this.usersList.push(element.toJSON());
            }
          });
          console.log('this.usersList = ', this.usersList);
        }).catch(error => {
          loader.dismiss();
          console.log('error  = ', error);
        });
  }
  gotoChat(user) {
    this.route.navigate(['chat'], {queryParams : user, skipLocationChange: true});
  }
  doRefresh(event) {
    // setTimeout(() => {
      console.log('Async operation has ended');
      this.usersList = [];
      this.getUserData();
      event.target.complete();
    // }, 2000);
  }
}
