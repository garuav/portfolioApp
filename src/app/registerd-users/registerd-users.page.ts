import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/common/common.service';

@Component({
  selector: 'app-registerd-users',
  templateUrl: './registerd-users.page.html',
  styleUrls: ['./registerd-users.page.scss'],
})
export class RegisterdUsersPage implements OnInit {
  private usersList: any[];

  constructor( private commonService: CommonService) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.usersList = [];
    this.commonService.getUserData().then(response => {
          console.log('firebase data = ', response.val());
          response.forEach(element => {
            this.usersList.push(element.toJSON());
          });
          console.log('this.usersList = ', this.usersList);
        }).catch(error => {
          console.log('error  = ', error);
        });
  }
}
