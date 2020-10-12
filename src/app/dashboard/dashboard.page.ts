import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { CommonService } from 'src/common/common.service';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  dashboardData = {
    users: {}
  };
  constructor(private commonService: CommonService,  private loadingController: LoadingController, private route: Router) {}

  ngOnInit() {
    this.getDashboardData();
  }
 async getDashboardData() {
   const loader = await this.loadingController.create({
      spinner: 'bubbles'
    });
   await loader.present();
   this.commonService.getDashboardData().then(response => {
      loader.dismiss();
      // console.log('dashboard data = ', response.data());
      this.dashboardData.users = response.data();
    }).catch(error => {
      loader.dismiss();
      console.log('error = ', error);
    });
  }
  gotoPage(type) {
    if (type === 'registered') {
      this.route.navigate(['registerd-users']);
    } else {
      this.route.navigate(['contact']);
    }
  }
  doRefresh(event) {
    // setTimeout(() => {
      // console.log('Async operation has ended');
      this.getDashboardData();
      event.target.complete();
    // }, 2000);
  }
  
}
