import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as Chartist from 'chartist';

import { History, HistoryService, Rfid, RfidService, Location, LocationService } from '../shared';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})



export class HomeComponent implements OnInit {

  rfid: Observable<Rfid[]>;
  //history: Observable<History[]>;
  location: Observable<Location[]>;

  constructor(private rfidService: RfidService,
              private locationService: LocationService,
              private historyService: HistoryService) { }

  ngOnInit() {
      
      this.onChange({target:{value: "Daily"}});
      this.rfid = this.rfidService.showRfidAllObserv();
      this.location = this.locationService.showObserv();
  }

  onChange(e) {
    //e.preventDefault();
    this.historyService.showHistory(e.target.value).subscribe((res) => {
      this.getDailyGraph(res);
    });
  }
  getDailyGraph(res) {
    
    var labels: any = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
    var datas: any = [[12, 17, 7, 17, 23, 18, 38],[38, 18, 23, 17, 7, 17, 12]];
    var label: any = []; var data: any = [];var high = 0; var low = 0; 
   if (res) {
    for (let i=0; i<res.length; i++) {
      label[i] = res[i].name;
      data[i] = res[i].count;
      if (high < res[i].count)
        high = data[i];
    }
   }

    if (label != [] && data != []) {
      datas = data;
      labels = label;
    }  
    
    var dataDailySalesChart: any = {
        labels: labels,
        series: [
          datas
        ]
    };

  var optionsDailySalesChart: any = {
        lineSmooth: Chartist.Interpolation.simple({
          divisor: 2
        }),
        low: 0,
        high: high + (high/10), // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
    }

    var dailySalesChart = new Chartist.Line('#DailyChart', dataDailySalesChart, optionsDailySalesChart);

  }

}
