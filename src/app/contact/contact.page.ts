import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/common/common.service';
import { LoadingController } from '@ionic/angular';
import { HeaderDataRef } from '../shared/header/header.ref';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  contactList: any = [];
  headerData = new HeaderDataRef({
    title: `Contacted Users`,
    canGoBack: true
  });
  constructor(private commonService: CommonService, private loadingController: LoadingController) { }

  ngOnInit() {
    this.contactList = [];
    this.getContactsUser();
  }
  async getContactsUser() {
    const loader = await this.loadingController.create({
      spinner: 'bubbles'
    });
    await loader.present();
    this.commonService.getContactedUsers().on('value', res => {
        loader.dismiss();
        console.log('response = ', res);
        res.forEach(element => {
          console.log('element = ', element.val());
          this.contactList.unshift(element.val());
        });
      }, error => {
        loader.dismiss();
        console.log('error = ', error);
      });
  }
  emailUser(user) {
    window.open(`mailto:${user.email}`);
  }
  doRefresh(event) {
      this.contactList = [];
      console.log('Async operation has ended');
      this.getContactsUser();
      event.target.complete();
  }
}
