import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HeaderDataRef } from './header.ref';
import {Location} from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {

  @Input()headerData: HeaderDataRef;
  constructor(private location: Location) { }

  ngOnInit() {
    console.log('headerData = ', this.headerData);
  }
  ngOnChanges(simple: SimpleChanges) {
    console.log('simple change = ', simple);
    if (simple && simple.firstChange) {
        this.headerData = simple.headerData.currentValue;
    }
  }
  goBack() {
    this.location.back();
  }
}
