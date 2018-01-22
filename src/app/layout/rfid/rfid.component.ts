import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Rfid, RfidService } from '../shared';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';
declare var $: any;

@Component({
  selector: 'app-rfid',
  templateUrl: './rfid.component.html',
  styleUrls: ['./rfid.component.scss']
})
export class RfidComponent implements OnInit, OnDestroy {

  	@ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    str: string;
    rfid: any;
    _rfid: any;
    rfid_selected: any;
    sub: any;
    dtOptions: any = {};
    dtTrigger: Subject<any> = new Subject();

  	constructor(private rfidService: RfidService) {
      this.rfid = [];
      this._rfid = [];
      this.rfid[0] = [];
      this.rfid[1] = [];
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
      this.rfidService.getRfidUrl();
      this.sub = this.rfidService.getRfid().subscribe(data => {
        const res = data.rfid;
        this._rfid = res;
        this.rfid = [];
        this.rfid[0] = [];
        this.rfid[1] = [];
        this.rfid_selected = [];
          if (res.length > 0) {
            for (var i = res.length - 1; i >= 0; i--) {
              if (res[i].rfid_user == null)
                this.rfid[1].push(res[i]);
              else
                this.rfid[0].push(res[i]);
            }
          }
          if (this.str !== '1st') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Call the dtTrigger to rerender again
              dtInstance.clear().draw();
              this.rfid_selected = this.rfid[1];
              if (this.rfid_selected.length == 0) {
                dtInstance.clear().draw();
              } else {
                // Destroy the table first
                dtInstance.destroy();
                this.dtTrigger.next();
              }
            });
          } else {
            this.rfid_selected = this._rfid;
            this.dtTrigger.next();
            this.str = '2nd';
          }
      });
    }

    ngOnDestroy(): void {
      this.sub.unsubscribe();
    }

    changeData(select) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          if ( select == 0 || select == 1 )
            this.rfid_selected = this.rfid[select];
          else
            this.rfid_selected = this._rfid;
          this.dtTrigger.next();
        });
    }

    OnDelete(id) {
      const index = this.rfidService.rfid_all.findIndex(i => i.rfid == id);
      const data = this.rfidService.rfid_all[index];
      if (confirm("ต้องการลบข้อมูลอาร์เอฟไอดีหรือไม่?")) {
        if (this.rfidService.delete(id)) {
            this.showNotification('top', 'right', 'ลบข้อมูลบัตร: ' + data.rfid_data + ' เรียบร้อยแล้ว');
        } else {
            alert('ไม่สามรถลบข้อมูลอาร์เอฟไอดีได้');
        }
      }
    }

    showNotification(from, align, msg){
      const type = ['','info','success','warning','danger'];
      const color = Math.floor((Math.random() * 4) + 1);

      $.notify({
          icon: "notifications",
          message: '<b>' + msg + '</b>'
      },{
          type: type[4],
          timer: 3000,
          placement: {
              from: from,
              align: align
          }
      });
    }

}
