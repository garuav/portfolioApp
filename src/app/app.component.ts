import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Firebase } from '@ionic-native/firebase/ngx';
import * as firebase from 'firebase';
import { firebaseConfig } from 'src/common/common.constants';
import { CommonService } from 'src/common/common.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Router, NavigationExtras } from '@angular/router';
@Component({
  providers:[LocalNotifications],
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  private selectedTheme: boolean;
  navigationExtras: NavigationExtras = {
    state: {
    }
  };
  public appPages = [
    {
      title: 'DashBoard',
      url: '/dashboard',
      icon: 'mail',
    },
    {
      title: 'Chat',
      url: '/chat',
      icon: 'paper-plane',
    },
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
    private ngZone: NgZone
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(true);
      this.splashScreen.hide();
      this.initFirebase();
      this.checkTheme();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        page => page.title.toLowerCase() === path.toLowerCase()
      );
    }
  }
  initFirebase() {
    firebase.initializeApp(firebaseConfig);
    this.firebaseApp
      .getToken()
      .then(token => {
        console.log(`The token is ${token}`);
        // firebase.storage().refFromURL('https://portfolio-3881c.appspot.com/mobileAppData/rujzYWu2tsoMbyNaXYP4').
        this.commonService.saveTokenToDatabase(token);
        localStorage.setItem('token', token);
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

    this.firebaseApp
      .onTokenRefresh()
      .subscribe((token: string) => {
        console.log(`Got a new token ${token}`);
        this.commonService.saveTokenToDatabase(token);
      });
  }
  checkTheme() {
    if (window.localStorage.getItem('selectedTheme')) {
        this.selectedTheme = JSON.parse(window.localStorage.getItem('selectedTheme'));
        this.statusBar.styleBlackTranslucent();

    } else {
      this.selectedTheme = false;
      this.statusBar.styleDefault();

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
    this.navigationExtras.state.from_notification_click = param;
    this.ngZone.run(() => {
      this.route.navigate(['chat'], {queryParams : param, skipLocationChange: true});
    });

  }
}
