import { Component, OnInit, ChangeDetectorRef, NgZone, ViewEncapsulation } from '@angular/core';

import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Firebase } from '@ionic-native/firebase/ngx';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth'; // for authentication
import 'firebase/firestore';
import { firebaseConfig } from 'src/common/common.constants';
import { CommonService } from 'src/common/common.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Router, NavigationExtras } from '@angular/router';
@Component({
  providers:[LocalNotifications],
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  public selectedIndex;
  private selectedTheme: boolean;
  public appPages = [
    {
      title: 'DashBoard',
      url: '/dashboard',
      icon: 'desktop',
    },
    // {
    //   title: 'Chat',
    //   url: '/chat',
    //   icon: 'paper-plane',
    // },
    {
      title: 'Registered Users',
      url: '/registerd-users',
      icon: 'people',
    },
    {
      title: 'Contacted Users',
      url: '/contact',
      icon: 'mail',
    },
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private firebaseApp: Firebase,
    private commonService: CommonService,
    private localNotification: LocalNotifications,
    private route: Router,
    private ngZone: NgZone,
    private loadingController: LoadingController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.splashScreen.hide();
      this.initFirebase();
      this.checkTheme();
      if (!this.commonService.getLocalStorageData('loginUserData')) {
        this.googleLogin();
      }
    });
  }

  ngOnInit() {
    const el = document.querySelector('.item-native') as HTMLElement;
    el.style.setProperty('background', 'transparent');
  }
  initFirebase() {
    firebase.initializeApp(firebaseConfig);
    this.firebaseApp
      .getToken()
      .then(token => {
        console.log(`The token is ${token}`);
        localStorage.setItem('token', token);
        // temp.registration_token = token;
        this.commonService.saveTokenToDatabase(token).then(res => {
          console.log('response saveGoogleLoginData data = ', res);
          // const temp = this.commonService.getLocalStorageData('loginUserData');
          // temp['registration_token'] = token;
          // this.commonService.setLocalStorageData('loginUserData', temp);
          }).catch(error => {
          console.log('error= ', error);
          });
        this.getRefreshToken();
      }) // save the token server-side and use it to push notifications to this device
      .catch(error => console.error('Error getting token', error));
    this.firebaseApp
      .onNotificationOpen()
      .subscribe(data => {
        console.log(`User opened a notification ${data.toString()}`);
        if (data.tap) {
            console.log('notification clicked  = ', data);
            this.gotoChat(data);

        } else {
          this.localNotification.schedule({
            id: data.object_id,
            title: data.title,
            text: data.body,
            data:data
          });
        }

        });
    this.localNotification.on('notification').subscribe(notification => {
          console.log('On notification = ', notification);
    })
    this.localNotification.on('click').subscribe(notification => {
      console.log('notification click = ', notification);
      const param = notification.data;
      this.gotoChat(param);
      // this.ngZone.run(() => {
      // });
});
    // this.firebaseApp.subscribe('notification').then(res => {
    //   console.log('On notification = ', res);
    // });
    // this.firebaseApp.subscribe('click').then(res => {
    //   console.log('On notification click = ', res);
    // });

  }
  checkTheme() {
    if (window.localStorage.getItem('selectedTheme')) {
        this.selectedTheme = JSON.parse(window.localStorage.getItem('selectedTheme'));
        this.statusBar.styleBlackTranslucent();

    } else {
      this.selectedTheme = false;
      this.statusBar.styleBlackTranslucent();

    }
    document.body.classList.toggle('dark',  this.selectedTheme);

  }
  changeTheme(event) {
    // this.selectedTheme = !this.selectedTheme;
      this.selectedTheme = event.target.checked;
      document.body.classList.toggle('dark', event.detail.checked);
      window.localStorage.setItem('selectedTheme', JSON.stringify(this.selectedTheme));
      this.selectedTheme ? this.statusBar.styleBlackTranslucent() : this.statusBar.styleDefault();
  }
  gotoChat(param) {
    if (param.objectType === 'chat_notification') {
      this.ngZone.run(() => {
        this.route.navigate(['chat'], {queryParams : param});
      });
    } else if (param.objectType === 'contact') {
      this.ngZone.run(() => {
        this.route.navigate(['contact'], {queryParams : param});
      });
    }

  }
 async googleLogin() {
    const loader =  await this.loadingController.create({
      spinner: 'bubbles'
    });
    await loader.present();
    firebase
    .auth()
    .signInWithEmailAndPassword('gbgaurav461@gmail.com', 'gaurav71218')
    .then((result: any) => {
        // The signed-in user info.
        loader.dismiss();
        console.log('result = ', result);
        this.selectedIndex = 0;
        this.setRouteIndex();
        const user = result.user;
        const temp: any = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          registration_token: ''
        };
        this.commonService.saveGoogleLoginData(temp).then(res => {
          console.log('response saveGoogleLoginData data = ', res);
          this.commonService.setLocalStorageData('loginUserData', temp);
          }).catch(error => {
          console.log('error= ', error);
          });
    }).catch(error => {
          loader.dismiss();
          console.error('Error on google sign in  ', error);
    });
  }
  getRefreshToken() {
    this.firebaseApp
      .onTokenRefresh()
      .subscribe((token: string) => {
        console.log(`Got a new token ${token}`);
        localStorage.setItem('token', token);
        if ( this.commonService.getLocalStorageData('loginUserData')) {
            // const userData =  this.commonService.getLocalStorageData('loginUserData');
            // userData['registration_token'] = token;
            // this.commonService.setLocalStorageData('loginUserData', userData);
            this.commonService.saveTokenToDatabase(token).then(res => {
              console.log('response saveGoogleLoginData data = ', res);
              }).catch(error => {
              console.log('error= ', error);
              });
        } else {
          this.googleLogin();
        }
      });
  }
 
  setRouteIndex() {
    const path = window.location.pathname.split('/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        page => page.title.toLowerCase() === path.toLowerCase()
      );
    }
  }
}
