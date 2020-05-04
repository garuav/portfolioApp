import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/common/common.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  contactList: any = [];
  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.contactList = [];
    this.getContactsUser();
  }
  getContactsUser() {
      this.commonService.getContactedUsers().on('value', res => {
        console.log('response = ', res);
        res.forEach(element => {
          console.log('element = ', element.val());
          this.contactList.push(element.val());
        });
      }, error => {
        console.log('error = ', error);
      });
  }
}
