import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import {AngularFirestore} from '@angular/fire/firestore';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as firebase from 'firebase';


@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.page.html',
  styleUrls: ['./new-task.page.scss'],
})
export class NewTaskPage implements OnInit {

  validations_form: FormGroup;
  image: any;
  Breed = ['english setter', 'afghan hound', 'beagle', 'boxer', 'border terrier', 'yorkshire terrier'];

  constructor(
      private camera: Camera,
    private imagePicker: ImagePicker,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public router: Router,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private webview: WebView,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.resetFields();
  }

  resetFields(){
    this.image = "./assets/imgs/default_image.jpg";
    this.validations_form = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      breed: new FormControl('', Validators.required)
    });
  }

  onSubmit(value){
    let data = {
      name: value.name,
      age: value.age,
      gender: value.gender,
      breed: value.breed,
      image: this.image
    }
    this.firebaseService.createTask(data)
    .then(
      res => {
        this.router.navigate(["/home"]);
      }
    )
  }

  openCam() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      //alert(imageData)
      this.image = (<any>window).Ionic.WebView.convertFileSrc(imageData);
      this.uploadImageToFirebase(imageData);

    }, (err) => {
      // Handle error
      alert("error " + JSON.stringify(err))
    });
    //
    // let currentUser = firebase.auth().currentUser;
    // this.afs.collection('people').doc(currentUser.uid).collection('tasks').add({
    //   title: 'БЛАБЛАБЛА',
    //   description: 'ТИПАДЕССРИПШЕН',
    //   image: this.image
    // })
  }

  openImagePicker(){
    this.imagePicker.hasReadPermission()
    .then((result) => {
      if(result == false){
        // no callbacks required as this opens a popup which returns async
        this.imagePicker.requestReadPermission();
      }
      else if(result == true){
        this.imagePicker.getPictures({
          maximumImagesCount: 1
        }).then(
          (results) => {
            for (var i = 0; i < results.length; i++) {
              this.uploadImageToFirebase(results[i]);
            }
          }, (err) => console.log(err)
        );
      }
    }, (err) => {
      console.log(err);
    });
  }

  async uploadImageToFirebase(image){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    const toast = await this.toastCtrl.create({
      message: 'Image was updated successfully',
      duration: 3000
    });
    this.presentLoading(loading);
    let image_src = this.webview.convertFileSrc(image);
    let randomId = Math.random().toString(36).substr(2, 5);

    //uploads img to firebase storage
    this.firebaseService.uploadImage(image_src, randomId)
    .then(photoURL => {
      this.image = photoURL;
      loading.dismiss();
      toast.present();
    }, err =>{
      console.log(err);
    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}
