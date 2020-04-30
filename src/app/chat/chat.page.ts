import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/common/common.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ChatPage implements OnInit {
  currentUserData;
  chatList: any [];
  chatText;
  constructor(private activateRoute: ActivatedRoute, private commonService: CommonService) { 
    this.activateRoute.paramMap.subscribe(params => {
      console.log('params = ', params);
      this.currentUserData = params;
      this.getAllMessages(this.currentUserData.uid);
    })
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    console.log('activated route = ', this.activateRoute.snapshot.queryParams);
    if (Object.keys(this.activateRoute.snapshot.queryParams).length > 0) {
      this.currentUserData = this.activateRoute.snapshot.queryParams;
      this.getAllMessages(this.currentUserData.uid);

    }
    // this.getAllMessages('n8waxPTELufETPR8JWqbbLWgfnJ3');
  }
  getAllMessages(uid) {
    this.commonService.getAllMessages(uid).on('value', res => {
      this.chatList = [];
      console.log('response from all messages = ', res.val());
      res.forEach(element => {
        console.log('element = ', element.val());
        this.chatList.push(element.val());
      });
    }, error => {
    });
  }
  sendChatMessage() {
    const token = localStorage.getItem('token');
    console.log('this.chatText = ', this.chatText);
    const param = {
      user_token: this.currentUserData.registration_token,
      sender: 'admin',
      text: this.chatText,
      dateTime: new Date()
    };
    this.commonService.sendMessage(token, param).subscribe(res => {
      console.log('response from send Message = ', res );
      const obj = {
        sender: 'admin',
        text: this.chatText,
        dateTime: new Date()
    };
      this.commonService.saveMessage(this.currentUserData.uid, obj).then(response => {
          console.log('response from save Message = ', response );
        }).catch(error => {
          console.log('error from save Message = ', error );
        });
      this.chatText = '';
    }, error => {
      console.log('error from send Message = ', error );
    });
  }
}
