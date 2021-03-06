import { Injectable } from '@angular/core';
import { History } from '../interfaces';
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
@Injectable()
export class HistoryService {
  private url = 'http://localhost:3000';
  private socket;

  history: History[];

  headers: Headers;
  options: RequestOptions;
  constructor(private http: Http) {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'q=0.8;application/json;q=0.9',
      'Authorization': 'Bearer ' + localStorage.getItem('isToken')
    });
    this.options = new RequestOptions({ headers: this.headers });
    this.showHistory("Daily").subscribe(res => {
        this.history = res;
    });
  }

  /**
    * Rfid_user Added & Available method for pull data
    */
  showHistoryObserve(what): Observable<History[]> {
    return new Observable<History[]>((observer) => {
        observer.next(this.history);
        setInterval(() => {observer.next(this.history);}, 1000);
    });
  }

  showHistory(data): Observable<History[]> {
      return this.http.get(localStorage.getItem('isUrl') + 'api/history/' + data + '/v1', this.options).map((res: Response) => this.history = res.json().data);
  }

  getHistoryUrl(): any {
    this.http.get(localStorage.getItem('isUrl') + 'api/history/fire/data', this.options).map((res: Response) => res.json());
  }

  getHistory(): any {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('history-channel:App\\Events\\EventHistory', (msg) => {
        observer.next(msg.data);
        console.log(msg.data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

}
