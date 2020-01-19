import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {FCM} from '@ionic-native/fcm/ngx';
import * as firebase from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

    validations_form: FormGroup;
    errorMessage: string = '';
    successMessage: string = '';

    validation_messages = {
        'email': [
            { type: 'required', message: 'Email is required.' },
            { type: 'pattern', message: 'Enter a valid email.' }
        ],
        'password': [
            { type: 'required', message: 'Password is required.' },
            { type: 'minlength', message: 'Password must be at least 5 characters long.' }
        ]
    };

    constructor(
        public afs: AngularFirestore,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private router: Router,
        private fcm: FCM,
    ) { }



    ngOnInit() {
        this.validations_form = this.formBuilder.group({
            email: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])),
            password: new FormControl('', Validators.compose([
                Validators.minLength(5),
                Validators.required
            ])),
        });
    }

    tryRegister(value){
        this.authService.doRegister(value)
            .then(res => {
                console.log(res);
                this.errorMessage = "";
                this.successMessage = "Your account has been created. Please log in.";
            }, err => {
                console.log(err);
                this.errorMessage = err.message;
                this.successMessage = "";
            });
        // let currentUser = firebase.auth().currentUser;
        let token = this.fcm.getToken();
        // this.afs.collection('people').doc(currentUser.uid).collection('Token').add({
        //     Token: token,
        // })
         console.log("Token");
          console.log(token);
         console.log("Token");
    }

    goLoginPage(){
        this.router.navigate(["/login"]);
    }

}
