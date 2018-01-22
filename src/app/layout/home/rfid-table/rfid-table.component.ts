import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Rfid, RfidService } from '../../shared';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-rfid-table',
  templateUrl: './rfid-table.component.html',
  styleUrls: ['./rfid-table.component.scss']
})
export class RfidTableComponent implements OnInit, OnDestroy {

	@ViewChild(DataTableDirective)
  	dtElement: DataTableDirective;

	rfid: any;
	rfid_selected: Rfid[];
	sub: any;
	dtOptions: DataTables.Settings = {};
	dtTrigger: Subject<any> = new Subject();

	constructor(private rfidService: RfidService) {
		this.rfid = [];
		this.rfid[0] = [];
		this.rfid[1] = [];
	}

	ngOnInit(): void {
	    this.dtOptions = {
	      pageLength: 10
	    };
	    this.sub = this.rfidService.showRfidAll().subscribe(res => {
	    	this.rfid = [];
			this.rfid[0] = [];
			this.rfid[1] = [];
	        if (res.length>0) {
	        	for (var i = res.length - 1; i >= 0; i--) {
	        		if (res[i].rfid_user == null)
		        		this.rfid[1].push(res[i]);
		        	else
		        		this.rfid[0].push(res[i]);
		        }
	        }
	        this.rfid_selected = this.rfid[0];
	        this.dtTrigger.next();
	    });
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}

	changeData(select) {
		if (select == 1){
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
	      this.rfid_selected = this.rfid[select];
	      this.dtTrigger.next();
	    });
	}

}
