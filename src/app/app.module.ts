import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule, FirestoreSettingsToken} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {environment} from '../environments/environment';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {Camera} from '@ionic-native/camera/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase), // imports firebase/app
    AngularFirestoreModule, // imports firebase/firestore
    AngularFireAuthModule, // imports firebase/auth
    AngularFireStorageModule, // imports firebase/storage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ImagePicker,
    WebView,
    Camera,
    { provide: FirestoreSettingsToken, useValue: {} },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
