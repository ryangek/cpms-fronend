import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Rfid, RfidService, User, UserService } from '../shared';
declare var $: any;
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';
declare var $: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  user: User[];
  user_id: User;
  rfid: Rfid[];

  emailAlready: boolean;
  success: boolean;
  success_delete: boolean;
  showRfidLoading: boolean;

  modal_title: String;
  modal_state: String;

  sub: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private userService: UserService,
              private rfidService: RfidService) { }

  ngOnInit() {
    this.dtOptions = {
      pageLength: 10,
      // Use this attribute to enable the responsive extension
      responsive: true,
      columnDefs: [
        {
          "targets": [3,4],
          "class": 'none'
        }
      ]
    };
    this.userService.show().subscribe(res => {
      this.user = res;
      this.dtTrigger.next();
    });
    this.sub = this.rfidService.showRfid().subscribe(res => {
      this.rfid = res;
    });
    this.user_id = new User;
    this.showRfidLoading = false;
  }

  ngOnDestroy() {
    this.user = null;
    this.sub.unsubscribe();
  }

  destroy(id) {
    if (confirm('ต้องการลบข้อมูลผู้ใช้นี้หรือไม่ ?')) {
      this.success_delete = false;
      if (this.userService.delete(id)) {
        this.success_delete = true;
        this.rfidService.showRfidAll().subscribe();
        setTimeout(() => {
          this.rfidService.showRfid().subscribe(res => {
            this.rfid = res;
            console.log(res);
            this.userService.show().subscribe(ress => {
              this.user = ress;
              this.changeData();
            });
            this.showNotification('top', 'right', 'ลบข้อมูลสมาชิกเรียบร้อยแล้ว', 2);
          });
        }, 500);
      } else {
        this.showNotification('top', 'right', 'ไม่สามารถลบข้อมูลสมาชิกได้', 4);
      }
    }
  }

  modalToggle(modalstate) {
    this.modal_state = modalstate;
    switch(modalstate){
      case 'add':
          this.user_id = new User;
          this.modal_title = 'สร้างข้อมูลสมาชิก';
          $('#username').prop('disabled', false);
          $('#email').prop('disabled', false);
          $('#password').show();
          $('.password').show();
        break;

      case 'edit':
          this.modal_title = 'แก้ไขข้อมูลสมาชิก';
        break;
    }
  }

  OnEdit(id) {
    let index = this.user.findIndex((i) => (i.id == id));
    if (index != -1) {
      this.user_id = this.user[index];
      var data: any = this.user_id;
      $('#password').prop('required', false);
      $('#password').hide();
      $('.password').hide();
      $('#username').prop('disabled', true);
      $('#email').prop('disabled', true);
      this.user_id = data;
    }
  }

  toSaveUser(e) {
    e.preventDefault();
    const data: any = {
      id: this.user_id.id,
      email: e.target.email.value,
      password: e.target.password.value,
      username: e.target.username.value,
      name: e.target.name.value,
      rfid: e.target.rfid.value,
      license: e.target.license.value,
      address: e.target.address.value
    };
    switch(this.modal_state) {
        case 'add':
          this.userService.store(data).subscribe(
            res => {
              this.success = true;
              this.emailAlready = false;
              this.rfidService.showRfid().subscribe(ress => {
                this.rfid = ress;

                document.getElementById('reset').click();
                this.userService.show().subscribe(resa => {
                  this.user = resa;
                  this.changeData();
                });
                this.showNotification('top', 'right', 'สร้างข้อมูลสมาชิกเรียบร้อยแล้ว', 2);
                setTimeout(function () {
                  document.getElementById('exit_form').click();
                }, 200);

              });
            },
            error => {
              this.emailAlready = true;
              this.success = false;
              console.log(error);
              document.getElementById('email').focus();
              this.showNotification('top', 'right', 'ไม่สามารถสร้างข้อมูลสมาชิกใหม่ได้', 4);
            }
          );
        break;

        case 'edit':
          let index = this.userService.user.findIndex((i) => (i.id == this.user_id.id));
          if (index != -1) {
            data.username = this.user_id.username;
            data.email = this.user_id.email;
            this.userService.update(data, this.user_id.id).subscribe(res =>{
              this.rfidService.showRfid().subscribe(ress => {
                this.rfid = ress;
                this.userService.show().subscribe(resp => {
                  this.user_id = resp[resp.findIndex(i => i.id === this.user_id.id)];
                  this.user = resp;
                  this.changeData();
                  this.showNotification('top', 'right', 'แก้ไขข้อมูลผู้ใช้: \' ' + this.user_id.name + ' \' เรียบร้อยแล้ว', 2);
                });
              });
            });
          }
    }
  }

  showNotification(from, align, msg, color){
      const type = ['','info','success','warning','danger'];

      //const color = Math.floor((Math.random() * 4) + 1);

      $.notify({
          icon: "notifications",
          message: '<b>' + msg + '</b>'
          //"Welcome to <b>Material Dashboard</b> - a beautiful freebie for every web developer."
      },{
          type: type[color],
          timer: 3000,
          placement: {
              from: from,
              align: align
          }
      });
    }

  changeData() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.clear().draw();
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

}
