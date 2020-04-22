import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

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
}
