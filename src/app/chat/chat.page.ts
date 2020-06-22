import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/common/common.service';
import * as moment from 'moment';
import { LoadingController, IonContent, NavController } from '@ionic/angular';
import { HeaderDataRef } from '../shared/header/header.ref';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatPage implements OnInit {
  currentUserData;
  chatList: any [];
  chatText;
  headerData = new HeaderDataRef({
    title: `Chat`,
    canGoBack: true
  });
  @ViewChild('ChatElementRef', {static: false}) chatEle: IonContent;
  constructor(private activateRoute: ActivatedRoute, private commonService: CommonService,
              private loadingController: LoadingController, private ngZone: NgZone) {
    this.activateRoute.paramMap.subscribe((params: any) => {
      if ( Object.keys(params).length > 0 && params.uid) {
        // console.log('params = ', params);
        this.currentUserData = params;
        this.getAllMessages(this.currentUserData.uid);

      }
    });
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    console.log('activated route = ', this.activateRoute.snapshot.queryParams);
    if (Object.keys(this.activateRoute.snapshot.queryParams).length > 0) {
      this.currentUserData = this.activateRoute.snapshot.queryParams;
      this.getAllMessages(this.currentUserData.uid);
      this.getCurrentUserDetails(this.currentUserData.uid);
    }
    // this.getAllMessages('n8waxPTELufETPR8JWqbbLWgfnJ3');
    // this.getCurrentUserDetails('n8waxPTELufETPR8JWqbbLWgfnJ3');
  }
  async getAllMessages(uid) {
    // tslint:disable-next-line:variable-name

    this.commonService.getAllMessages(uid).on('value', res => {
      this.chatList = [];
      console.log('response from all messages = ', res.val());
      res.forEach(element => {
        if (element.val().dateTime) {
          const date = element.val().dateTime;
          // console.log('element = ', element.val());
          if ( this.chatList.findIndex(item => moment(item.dateTime).format('DD.MM.YYYY').includes(moment(date).format('DD.MM.YYYY'))) === -1) {
            this.chatList.push({
             sender:  element.val().sender,
             text:  element.val().text,
             dateTime:  element.val().dateTime,
             dateSepration:  element.val().dateTime
            });
          } else {
            this.chatList.push(element.val());
          }
        }
      });
      // console.log('this.chatList = ', this.chatList);
      // console.log('this.chatEle = ', this.chatEle);
      setTimeout(() => {
          this.chatEle.scrollToBottom(500);
      }, 100);
    }, error => {
    });
  }
  sendChatMessage() {
    if (this.chatText !== '' && this.chatText.length > 0) {
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

 async getCurrentUserDetails(uid) {
    const loader =  await this.loadingController.create({
      spinner: 'bubbles'
    });
    await loader.present();
    this.commonService.getUserById(uid).once('value').then(response => {
      loader.dismiss();
      console.log('current user Detials = ', response.val());
      const currentUser = {
        displayName: response.val().displayName,
        email: response.val().email,
        photoURL: response.val().photoURL,
        registration_token: response.val().registration_token,
        uid: response.val().uid,
      };
      this.currentUserData = currentUser;
      this.headerData.title = `Chat ${this.currentUserData.displayName ? 'With ' + this.currentUserData.displayName : ''} `;
      console.log('this.currentUserData = ', this.currentUserData);
    }).catch(error => {
      loader.dismiss();
      console.log('error current user Detials = ', error);

    });
  }
}
