import { Injectable } from '@angular/core';
import { Device } from '../interfaces/Device';
import { LocationService } from './location.service';
// import the important
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
// import the important

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
export class DeviceService {

  drop: Device[] = [];
  drag: Device[] = [];

  headers: Headers;
  options: RequestOptions;

  constructor(private http: Http, private locationService: LocationService) {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'q=0.8;application/json;q=0.9',
      'Authorization': 'Bearer ' + localStorage.getItem('isToken')
    });
    this.options = new RequestOptions({ headers: this.headers });

    this.showAdded().subscribe(res => {this.drop = res});
    this.showAvailable().subscribe(res => {this.drag = res});
  }

  showAddedObserv(): Observable<Device[]> {
    return new Observable<Device[]>((observer) => {
      observer.next(this.drop);
      setInterval( () => {
        observer.next(this.drop);
      }, 200);
    });
  }
  showAdded(): Observable <Device[]> {
    return this.http.get(localStorage.getItem('isUrl') + 'api/device/addedDeviceId', this.options).map((res: Response) => this.drop = res.json());
  }

  showAddedWhereObserve(id): Observable<Device[]> {
    return new Observable<Device[]>((observer) => {
      this.showAddedWhere(id).subscribe(res => {
        this.drop = res;
        observer.next(this.drop);
      });
      setInterval( () => {
        this.showAddedWhere(id).subscribe(res => {
          this.drop = res;
          observer.next(this.drop);
        });
      }, 4321);
    });
  }
  showAddedWhereObserv(id): Observable<Device[]> {
    return new Observable<Device[]>((observer) => {
      this.showAddedWhere(id).subscribe(res => {
        this.drop = res;
        observer.next(this.drop);
      });
      setInterval( () => {
        observer.next(this.drop);
      }, 200);
    });
  }
  showAddedWhere(id): Observable <Device[]> {
    return this.http.get(localStorage.getItem('isUrl') + 'api/device/addedDeviceId/' + id, this.options).map((res: Response) => this.drop = res.json());
  }

  showAvailableObserve(): Observable<Device[]> {
    return new Observable<Device[]>((observer) => {
      this.showAvailable().subscribe(res => {
        this.drag = res;
        observer.next(this.drag);
      });
      setInterval( () => {
        this.showAvailable().subscribe(res => {
          this.drag = res;
          observer.next(this.drag);
        });
      }, 4321);
    });
  }
  showAvailableObserv(): Observable<Device[]> {
    return new Observable<Device[]>((observer) => {
      observer.next(this.drag);
      setInterval( () => {
        observer.next(this.drag);
      }, 200);
    });
  }
  showAvailable(): Observable <Device[]> {
    return this.http.get(localStorage.getItem('isUrl') + 'api/device/availiableDeviceId', this.options).map((res: Response) => this.drag = res.json());
  }

  updateDevice(data): Observable <any> {
    return this.http.post(localStorage.getItem('isUrl') + 'api/device/updatejson', data, this.options)
      .map(
        (response: Response) => {
          return response.json();
        }
      );
  }

  /*
    * OnEvent
    */
  onDropDevice(name, x, y) {
    for (let i = 0; i < this.drop.length; i++) {
      if (this.drop[i].device_name === name) {
        this.drop[i] = {
          device_id: this.drop[i].device_id,
          device_name: this.drop[i].device_name,
          device_status: 'no',
          device_ultra: this.drop[i].device_ultra,
          device_top: y,
          device_left: x,
          locate_id: null,
          created_at: this.drop[i].created_at,
          updated_at: this.drop[i].updated_at
        };
        return true;
      }
    }
    return false;
  }
  onConfirmDrop(id) {
    setTimeout( () => {
      if (this.drop && this.drop.length > 0) {
        for (let i = 0; i < this.drop.length; i++) {
          this.drop[i] = {
            device_id: this.drop[i].device_id,
            device_name: this.drop[i].device_name,
            device_status: 'yes',
            device_ultra: this.drop[i].device_ultra,
            device_top: this.drop[i].device_top,
            device_left: this.drop[i].device_left,
            locate_id: id,
            created_at: this.drop[i].created_at,
            updated_at: this.drop[i].updated_at
          };
        }
        setTimeout( () => {
          this.updateDevice(this.drop).subscribe(
            resp => {
              this.locationService.update();
            },
            error => console.log(error)
          );
        }, 200);
      }
      if (this.drag && this.drag.length > 0) {
        for (let i = 0; i < this.drag.length; i++) {
          this.drag[i] = {
            device_id: this.drag[i].device_id,
            device_name: this.drag[i].device_name,
            device_status: 'no',
            device_ultra: this.drag[i].device_ultra,
            device_top: this.drag[i].device_top,
            device_left: this.drag[i].device_left,
            locate_id: null,
            created_at: this.drag[i].created_at,
            updated_at: this.drag[i].updated_at
          };
        }
        setTimeout( () => {
          this.updateDevice(this.drag).subscribe(
            res => {
              this.locationService.update();
            },
            error => console.log(error)
          );
        }, 200);
      }
    }, 100);
    return true;
  }
  onChangeDeviceSide(dropData, dragData) {
    if (dropData && dropData.length > 0) {
      for (let i = dropData.length; i < dropData.length; i++) {
        dropData[i] = {
          device_id: dropData[i].device_id,
          device_name: dropData[i].device_name,
          device_status: 'no',
          device_ultra: dropData[i].device_ultra,
          device_top: dropData[i].device_top,
          device_left: dropData[i].device_left,
          locate_id: null,
          created_at: dropData[i].created_at,
          updated_at: dropData[i].updated_at
        };
      }
      this.drop = dropData;
    }
    if (dragData && dragData.length > 0) {
      for (let i = dragData.length; i < dragData.length; i++) {
        dragData[i] = {
          device_id: dragData[i].device_id,
          device_name: dragData[i].device_name,
          device_status: 'no',
          device_ultra: dragData[i].device_ultra,
          device_top: dragData[i].device_top,
          device_left: dragData[i].device_left,
          locate_id: null,
          created_at: dragData[i].created_at,
          updated_at: dragData[i].updated_at
        };
      }
      this.drag = dragData;
    }
    return true;
  }
}
