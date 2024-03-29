import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CameraPreview, CameraPreviewOptions } from '@ionic-native/camera-preview/ngx';
import { OCR, OCRSourceType, OCRResult } from '@ionic-native/ocr/ngx';
import { NavController } from '@ionic/angular';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { LoadingController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage {
  picture: string;
  constructor(private cameraPreview: CameraPreview, private platform: Platform, private ocr: OCR,
    public navCtrl: NavController, private insomnia: Insomnia, public loadingController: LoadingController,
    private file: File, public alertController: AlertController) {
  }
  cameraPreviewOpts: CameraPreviewOptions = {
    x: 0,
    y: 0,
    width: this.platform.width(),
    height: this.platform.height() - 36,
    camera: 'rear',
    previewDrag: false,
    toBack: true,
  }
  async startCamera() {
    const result = await this.cameraPreview.startCamera(this.cameraPreviewOpts);
  }
  async takePicture() {
    this.cameraPreview.takeSnapshot().then((result) => {
      this.file.createFile(this.file.dataDirectory, 'analyzed.png', true).then(() => {
        let base64Blob = this.base64toBlob(result, 'image/png');
        this.file.writeFile(this.file.dataDirectory, 'analyzed.png', base64Blob, { replace: true, append: false }).then(() => {
          this.analyzeImage().then(() => {
            this.file.removeFile(this.file.dataDirectory, 'analyzed.png');
          });
        })
      });
    });

  }
  async analyzeImage() {
    await this.ocr.recText(OCRSourceType.NORMFILEURL, this.file.dataDirectory + 'analyzed.png')
      .then((res: OCRResult) => {
        if (res.foundText) {
          let navigationExtras: NavigationExtras = { state: { text: JSON.stringify(res) } };
          this.navCtrl.navigateForward(['/translator'], navigationExtras).then(() => this.cameraPreview.stopCamera())
        }
        else {
          this.cameraPreview.stopCamera().then(() => {
            this.presentAlert();
          })

        }
      })
      .catch((error: any) => console.error(error));
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Unable to detect text, please try again.',
      buttons: ['OK']
    });
    alert.onDidDismiss()
      .then(() => {
        this.startCamera();
      })
    await alert.present();
  }
  ionViewWillEnter() {
    this.insomnia.keepAwake()
      .then(
        () => console.log('success'),
        () => console.log('error')
      );
    this.startCamera();
  }
  ionViewDidLeave() {
    this.cameraPreview.stopCamera().then(
      () => console.log('closed preview'),
      () => console.log('no preview was open')
    );;
  }
  base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    let byteCharacters = atob(base64Data);
    let slicesCount = Math.ceil(byteCharacters.length / 1024);
    let byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      let begin = sliceIndex * 1024;
      let end = Math.min(begin + 1024, byteCharacters.length);

      let bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }
}
