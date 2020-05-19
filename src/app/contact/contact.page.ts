import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/common/common.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  contactList: any = [];
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
          this.contactList.push(element.val());
        });
      }, error => {
        loader.dismiss();
        console.log('error = ', error);
      });
  }
  doRefresh(event) {
      this.contactList = [];
      console.log('Async operation has ended');
      this.getContactsUser();
      event.target.complete();
  }
}
