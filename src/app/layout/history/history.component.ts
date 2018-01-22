import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HistoryData, ExcelService, HistoryService } from '../shared';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';
declare var $: any;

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {

	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;

	  str: string;
    history: HistoryData[];
    sub: any;
    dtOptions: any = {};
    dtTrigger: Subject<any> = new Subject();

  	constructor(private excelService: ExcelService,
  				      private historyService: HistoryService) {
  	  this.history = [];
	    this.str = '1st';
  	}

  	ngOnInit(): void {
      this.dtOptions = {
        pageLength: 10,
        // Use this attribute to enable the responsive extension
        responsive: true,
        columnDefs: [
            {
              "targets": [3,4,5],
              "class": 'none'
            }
        ]
      };
      this.historyService.getHistoryUrl();
      this.sub = this.historyService.getHistory().subscribe(data => {
        const res = data.history;
        this.history = [];
          if (res.length > 0) {
            this.history = res;
          }
          if (this.str !== '1st') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
          } else {
            this.dtTrigger.next();
            this.str = '2nd';
          }
      });
    }

    ngOnDestroy(): void {
      this.sub.unsubscribe();
    }

    changeData(select) {
      if (select == 1) {
        $('#rfid-use').addClass('active');
        $('#rfid-not').removeClass('active');
      } else {
        $('#rfid-not').addClass('active');
        $('#rfid-use').removeClass('active');
      }
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
    }

    showNotification(from, align, msg){
      const type = ['','info','success','warning','danger'];
      const color = Math.floor((Math.random() * 4) + 1);

      $.notify({
          icon: "notifications",
          message: '<b>' + msg + '</b>'
      },{
          type: type[1],
          timer: 1000,
          placement: {
              from: from,
              align: align
          }
      });
    }

  	exportExcel() {
  		this.excelService.exportAsExcelFile([], '');
  	}

}
