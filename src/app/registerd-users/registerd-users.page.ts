import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/common/common.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HeaderDataRef } from '../shared/header/header.ref';

@Component({
  selector: 'app-registerd-users',
  templateUrl: './registerd-users.page.html',
  styleUrls: ['./registerd-users.page.scss'],
})
export class RegisterdUsersPage implements OnInit {
  private usersList: any[];
  headerData = new HeaderDataRef({
    title: `Registered Users`,
    canGoBack: true
  });
  constructor( private commonService: CommonService, private loadingController: LoadingController, private route: Router,
    ) {
    }

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
          // console.log('firebase data = ', response.val());
          response.forEach(element => {
            if (element.key !== ('contact')) {
              this.usersList.push(element.toJSON());
            }
          });
          // console.log('this.usersList = ', this.usersList);
        }).catch(error => {
          loader.dismiss();
          console.log('error  = ', error);
        });
  }
  gotoPage(page, user) {
    if (page === 'mail') {
        window.open(`mailto:${user.email}`);
    } else if (page === 'chat') {
      this.route.navigate(['chat'], {queryParams : user});

    }
  }
  doRefresh(event) {
      console.log('Async operation has ended');
      this.usersList = [];
      this.getUserData();
      event.target.complete();
  }
}
