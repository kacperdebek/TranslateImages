import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CameraPreview, CameraPreviewOptions } from '@ionic-native/camera-preview/ngx';
import { OCR, OCRSourceType, OCRResult } from '@ionic-native/ocr/ngx';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  picture: string;
  constructor(private cameraPreview: CameraPreview, private platform: Platform, private ocr: OCR, public navCtrl: NavController) {
    
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
    const result = await this.cameraPreview.takeSnapshot();
    this.picture = `${result}`;
    this.analyzeImage();
  }
  analyzeImage(){
    this.ocr.recText(OCRSourceType.BASE64, this.picture)
  .then((res: OCRResult) => this.navCtrl.navigateForward(['/translator', { text: JSON.stringify(res) }])).then(() => this.cameraPreview.stopCamera())
  .catch((error: any) => console.error(error));
  }
  ionViewWillEnter(){
    this.startCamera();
  }
}
