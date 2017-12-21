import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Rfid, RfidService, User, UserService } from '../shared';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  user: Observable<User[]>;
  rfid: Observable<Rfid[]>;
  rfid_all: Observable<Rfid[]>;

  emailAlready: boolean;
  success: boolean;
  success_delete: boolean;

  constructor(private userService: UserService,
              private rfidService: RfidService) { }

  ngOnInit() {
    this.user = this.userService.showObserv();
    this.rfid = this.rfidService.showRfidObserv();
    this.rfid_all = this.rfidService.showRfidAllObserv();
  }

  ngOnDestroy() {
    this.user = null;
    this.rfid = null;
  }

  destroy(id) {
    if (confirm('ต้องการลบข้อมูลผู้ใช้นี้หรือไม่ ?')) {
      this.success_delete = false;
      if (this.userService.delete(id)) {
        this.success_delete = true;
        this.rfidService.showRfid();
        this.rfidService.showRfidAll();
        // this.rfid = this.rfidService.showRfidObserv();
        // this.rfid_all = this.rfidService.showRfidAllObserv();
      } else {
        console.log('ไม่สามารถลบข้อมูลสมาชิกรหัส : ', id);
      }
    }
  }

  OnDelete(id) {
    if (this.rfidService.delete(id)) {
      console.log('Deleted: ', id);
    } else {
      console.log('Can\'t Delete: ', id);
    }
  }

  toSaveUser(e) {
    e.preventDefault();
    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
      username: e.target.username.value,
      name: e.target.name.value,
      rfid: e.target.rfid.value,
      license: e.target.license.value,
      address: e.target.address.value
    };
    this.userService.store(data).subscribe(
      res => {
        this.rfidService.showRfid();//this.rfid = this.rfidService.showRfidObserv();
        this.success = true;
        this.emailAlready = false;
        document.getElementById('reset').click();
        this.user = this.userService.showObserve();
        setTimeout(function () {
          document.getElementById('exit_form').click();
        }, 200);
      },
      error => {
        this.emailAlready = true;
        this.success = false;
        console.log(error);
        document.getElementById('email').focus();
      }
    );
  }

}
