import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-translator',
  templateUrl: './translator.page.html',
  styleUrls: ['./translator.page.scss'],
})
export class TranslatorPage implements OnInit {
  text: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    let json = JSON.parse(this.route.snapshot.paramMap.get('text'));
    this.text = json.blocks.blocktext.join(" ");
  }
}
