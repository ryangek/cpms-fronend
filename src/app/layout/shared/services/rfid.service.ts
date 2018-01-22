import { Injectable } from '@angular/core';
import { Rfid } from '../interfaces/Rfid';
// import the important
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
// import the important

import * as io from 'socket.io-client';

// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';


declare const $: any;

@Injectable()
export class RfidService {
  private url = 'http://localhost:3000';
  private socket;

  rfid: Rfid[];
  rfid_all: Rfid[];
  rfid_check: Rfid[];

  headers: Headers;
  options: RequestOptions;
  constructor(private http: Http) {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'q=0.8;application/json;q=0.9',
      'Authorization': 'Bearer ' + localStorage.getItem('isToken')
    });
    this.options = new RequestOptions({ headers: this.headers });
    this.showRfid().subscribe(res => {this.rfid = res;});
    this.showRfidAll().subscribe(res => {this.rfid_all = res;});
    // this.rfid = [];
    // this.rfid_all = [];
    this.rfid_check = [];
  }

  /*
    * Rfid_user Added & Available method for pull data
    */
  showRfidObserve(): Observable<Rfid[]> {
    return new Observable<Rfid[]>((observer) => {
      this.showRfid().subscribe(res => {
        this.rfid = res;
        observer.next(this.rfid);
      });
      setInterval( () => {
        this.showRfid().subscribe(res => {
          if (this.rfid == res)
            observer.next(this.rfid);
          else{
            this.rfid = res;
            observer.next(this.rfid);
          }
        });
      }, 4321);
    });
  }
  showRfidObserv(): Observable<Rfid[]> {
    return new Observable<Rfid[]>((observer) => {
      observer.next(this.rfid);
    });
  }
  showRfidAllObserve(): Observable<Rfid[]> {
    return new Observable<Rfid[]>((observer) => {
      this.showRfidAll().subscribe(res => {
        this.rfid_all = res;
        observer.next(this.rfid_all);
      });
      setInterval( () => {
        this.showRfidAll().subscribe(res => {
          this.rfid_all = res;
          observer.next(this.rfid_all);
        });
      }, 4321);
    });
  }
  showRfidAllObserv(): Observable<Rfid[]> {
    return new Observable<Rfid[]>((observer) => {
      observer.next(this.rfid_all);
    });
  }
  getRfidUrl(): any {
    this.http.get(localStorage.getItem('isUrl') + 'api/rfid/fire/data', this.options)
      .subscribe(res => {});
  }
  getRfid(): any {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('rfid-channel:App\\Events\\EventRfid', (msg) => {
        this.rfid_check = msg.data.rfid;
        setTimeout(() => {
          if (this.rfid_all.length <= this.rfid_check.length) {
            if (this.rfid_check.length > 0) {
              for(let i=0; i<this.rfid_check.length; i++) {
                let find = this.rfid_check[i].rfid;
                if (this.rfid_all.findIndex((i) => (i.rfid == find)) == -1) {
                  setTimeout(() => {
                     this.showNotification('top', 'right', 'ได้เพิ่มข้อมูลบัตร: ' + this.rfid_check[i].rfid_data + ' เรียบร้อยแล้ว');
                  }, 1000);
                }
              }
            }
            this.rfid_all = this.rfid_check;
            this.rfid = [];
            for (var i = this.rfid_all.length - 1; i >= 0; i--) {
              if (this.rfid_all[i].rfid_user == null)
                this.rfid.push(this.rfid_all[i]);
            }
          }
          observer.next(msg.data);
        }, 200);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  showRfid(): Observable<Rfid[]> {
    return this.http.get(localStorage.getItem('isUrl') + 'api/rfid/no/user', this.options).map((res: Response) => this.rfid = res.json().Rfid);
  }
  showRfidAll(): Observable<Rfid[]> {
    return this.http.get(localStorage.getItem('isUrl') + 'api/rfid/all', this.options).map((res: Response) => this.rfid_all = res.json().Rfid);
  }

  delete(id): boolean {
    const index = this.rfid.findIndex(i => i.rfid === id);
    if (index !== -1) {
      this.http.delete(localStorage.getItem('isUrl') + 'api/rfid/delete/' + id, this.options).subscribe(
        res => {
          this.rfid.splice(index, 1);
          const indexx = this.rfid_all.findIndex(i => i.rfid === id);
          if (indexx !== -1) {
            this.rfid_all.splice(indexx, 1);
            this.getRfidUrl();
            return true;
          }
        },
        error => {
          return false;
        });
      return true;
    }
    return false;
  }

  showNotification(from, align, msg){
      const type = ['','info','success','warning','danger'];

      const color = Math.floor((Math.random() * 4) + 1);

      $.notify({
          icon: "notifications",
          message: '<b>' + msg + '</b>'
          //"Welcome to <b>Material Dashboard</b> - a beautiful freebie for every web developer."
      },{
          type: type[2],
          timer: 3000,
          placement: {
              from: from,
              align: align
          }
      });
    }
}
