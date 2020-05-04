import { Injectable, EventEmitter } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth'; // for authentication
import 'firebase/firestore';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { serverKey } from './common.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  dataEmitter: EventEmitter<any> = new EventEmitter();
  constructor(private http: HttpClient) { }

  saveTokenToDatabase(token) {
    // tslint:disable-next-line:max-line-length
    // firebase.firestore().collection(
      firebase.firestore().collection('userData').doc('token').set({token:token}).then(res => {
      console.log('response data = ', res);

      }).catch(error => {
      console.log('error= ', error);

      });
  }

  getUserData() {
   return firebase.database().refFromURL('https://portfolio-3881c.firebaseio.com/').once('value');
  }
  getAllMessages(uid) {
    return firebase.database().refFromURL('https://portfolio-3881c.firebaseio.com/' + uid).child('messages');
  }
  sendMessage(token: string, data: any): Observable<any> {
    if (token) {
      const header = new HttpHeaders({
        Authorization: `key=${serverKey}`,
        'Content-Type': 'application/json'
      });
      console.log('headers = ', header);
      const randomNum = Math.round(Math.random() * (99999 - 0 + 1)) + 0;
      const payload = {
        registration_ids: [data.user_token],
        data: {
          title: 'Chat Notification',
          body:  data.text,
          object_id: randomNum,
          icon: '../../favicon.ico',
          objectType: 'chat_notification',
          uid: data.uid,
          dateTime: data.dateTime
        },
        content_available: true
      };
      return  this.http.post(`https://fcm.googleapis.com/fcm/send`, payload, { headers: header});
    }
  }
  saveMessage(uid, message) {
    return firebase.database().refFromURL('https://portfolio-3881c.firebaseio.com/' + uid).child('messages').push().update(message);
  }

  getUserById(uid) {
    return firebase.database().refFromURL('https://portfolio-3881c.firebaseio.com/' ).child(uid);
  }
  getContactedUsers() {
    return firebase.database().refFromURL('https://portfolio-3881c.firebaseio.com/' ).child('contact');
  }
}
