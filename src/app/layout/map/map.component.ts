import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { Location, LocationService, Device, DeviceService } from '../shared';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('imgView') imgView: ElementRef;
  @ViewChild('locateImage') locateImage: ElementRef;
  uploadedImage: File;

  location: Observable<Location[]>;
  private locateUnsubs: Subject<Location[]> = new Subject();
  error: any;
  url: string;
  index: number;


  height: number;
  width: number;

  public img: string;

  dropData: Observable<Device[]>;
  dragData: Observable<Device[]>;
  private dropUnsubs: Subject<Device[]> = new Subject();
  private dragUnsubs: Subject<Device[]> = new Subject();
  droData: Device[];
  draData: Device[];

  cansave: boolean;
  saving: boolean;
  constructor(private locationService: LocationService,
              private ng2ImgMax: Ng2ImgMaxService,
              private deviceService: DeviceService,
              public _DomSanitizer: DomSanitizer) {
    this.error = {
      locate_name: false,
      locate_floor: false,
      locate_image: false
    };

    this.url = localStorage.getItem('isUrl') + 'img/';

    this.width = document.documentElement.clientWidth - 256;
    this.height = document.documentElement.clientHeight;
  }

  ngOnInit() {
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
    });
    setTimeout(() => {
      this.locationService.showObserv()
      .pipe(takeUntil(this.locateUnsubs))
      .subscribe();
      this.location = this.locationService.showObserv();
    }, 200);
    this.img = '';
  }

  ngOnDestroy() {

    this.locateUnsubs.next();
    this.locateUnsubs.complete();

    this.dropUnsubs.next();
    this.dropUnsubs.complete();

    this.dragUnsubs.next();
    this.dragUnsubs.complete();

    this.location = null;
    this.img = null;

    console.log('MapComponent has been destroyed');
  }

  addToolTip () {
    $('[data-toggle="tooltip"]').tooltip();
  }

  onChangeLocation(e) {
    if (e !== '') {
      this.locationService.show().subscribe(res => {
        document.getElementById('map')
          .setAttribute('class', e);
        this.img = localStorage.getItem('isUrl') + 'img/' + e + '.jpg';
        this.deviceService.showAddedWhereObserv(e).pipe(takeUntil(this.dropUnsubs)).subscribe(resp => {this.droData = resp; } );
        this.deviceService.showAvailableObserv().pipe(takeUntil(this.dragUnsubs)).subscribe(resp => {this.draData = resp; } );
        this.dropData = this.deviceService.showAddedWhereObserv(e);
        this.dragData = this.deviceService.showAvailableObserv(); // this.deviceService.showAvailable();
      });
    } else {
      this.img = '';
      this.droData = [];
      this.draData = [];
      this.dragData = null;
      this.dropData = null;

      this.dropUnsubs.next();
      this.dropUnsubs.complete();
      this.dragUnsubs.next();
      this.dragUnsubs.complete();
    }
  }

  /*
    * Get data from dragged
    */
  drag_start(event) {
    const style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData('text/plain', (parseInt(style.getPropertyValue('left'), 10) - event.clientX)
      + ',' + (parseInt(style.getPropertyValue('top'), 10) - event.clientY)
      + ',' + event.target.getAttribute('data-item') + ',' + event.target.getAttribute('id'));
  }

  /*
  * Get data from dragging
  */
  drag_over(event) {
    event.preventDefault();
    return false;
  }

  /*
  * Use data from drag_start
  */
  drop(event) {
    const offset = event.dataTransfer.getData('text/plain').split(',');
    const dm = <HTMLElement>document.getElementsByClassName('dragme')[parseInt(offset[2], 10)];

    // Set style of Item
    dm.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';

    // Make position to percentage
    const x = Math.round((event.clientX + parseInt(offset[0], 10)) * 100000 / this.width) / 1000;
    const y = Math.round((event.clientY + parseInt(offset[1], 10)) * 100000 / this.height) / 1000;

    if (this.deviceService.onDropDevice(offset[3], x, y)) {
      this.cansave = true;
    }

    event.preventDefault();
    return false;
  }

  /*
   * Confirm drag and drop to dropped
   */
  confirmDrag() {
    this.saving = true;
    this.location = null;
    const data = document.getElementById('map').getAttribute('class');
    if (this.deviceService.onConfirmDrop(data)) {
      setTimeout( () => {
        this.locationService.show().pipe(takeUntil(this.locateUnsubs))
          .subscribe(resp => {
            console.log('At MapViewComponent => Get: Show', resp);
          }); // this.location = this.locationService.showObserv();
        this.location = this.locationService.showObserv();
      }, 500);
      this.saving = false;
      this.cansave = false;
    }
  }

  /*
    * Reset drag and drop to availiable
    */
    resetDrag() {
      $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();
      });
      // setTimeout(() => {
      //   this.location = this.locationService.showObserv();
      // }, 200);
      this.img = '';
      this.dropData = null;
    }
  /*
    * When drag and drop in modal wiil change data item
    */
  changeItem() {
    if (this.deviceService.onChangeDeviceSide(this.droData, this.draData)) {
      this.cansave = true;
    }
  }

}
