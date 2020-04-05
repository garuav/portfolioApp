import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Firebase } from '@ionic-native/firebase/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
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
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private firebase: Firebase,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initFirebase();
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
    this.firebase
      .getToken()
      .then(token => {
        console.log(`The token is ${token}`);
        localStorage.setItem('token', token);
      }) // save the token server-side and use it to push notifications to this device
      .catch(error => console.error('Error getting token', error));

    this.firebase
      .onNotificationOpen()
      .subscribe(data => console.log(`User opened a notification ${data}`));

    this.firebase
      .onTokenRefresh()
      .subscribe((token: string) => console.log(`Got a new token ${token}`));
  }
 
}
