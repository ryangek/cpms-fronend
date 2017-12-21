import { Component, ElementRef, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { Location, LocationService, Device, DeviceService } from '../shared';
import { Observable } from 'rxjs/Observable';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs/Subject";
declare var $: any;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, OnDestroy {
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
              public _DomSanitizer: DomSanitizer,
              public dialog: MatDialog) {
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
    $('#reset_all').hide();
    this.img = '';
    //this.img = 'assets/img/placehold.jpg';
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

    console.log('MapViewComponent has been destroyed');
  }

  addToolTip () {
    $('[data-toggle="tooltip"]').tooltip();
  }

  /*
  * Added Location from Modal
  */
  addLocate(e) {
    e.preventDefault();
    const data = {
      locate_name: e.target.locate_name.value,
      locate_floor: e.target.locate_floor.value,
      locate_image: e.target.locate_image.value
    };

    if (e.target.locate_image.value !== '') {
      this.locationService.store(data).subscribe(
        res => {
          document.getElementById('reset').click();

          this.error = {
            locate_name: false,
            locate_floor: false,
            locate_image: false
          };

          setTimeout( () => {
            this.locationService.show().pipe(takeUntil(this.locateUnsubs))
              .subscribe(resp => {
                console.log('At MapViewComponent => Get: Show', resp);
              }); // this.location = this.locationService.showObserv();
          }, 500);
        },
        error => console.log(error)
      );
    } else {
      this.error.locate_image = true;
      setTimeout(() => {
        const alertError = document.getElementById('alert');
        alertError.focus();
      }, 1000);
    }
    e.preventDefault();
  }

  /*
  * Delete record in locations
  */
  onDelete(id) {
    if (confirm("ต้องการลบข้อมูลสถานที่นี่หรือไม่?")) {
      if (this.locationService.delete(id)) {
        this.locationService.show(); // this.location = this.locationService.showObserv();
      } else {
        console.log('Can\'t delete : ', id);
      }
    }
  }

  openDialog(id): void {
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { name: "Hello", animal: "Hi"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed: ', id);
    });
  }


  /*
  * On Click Image Profile to Select file image
  */
  onClickUpload() {
    this.fileInput.nativeElement.click();
  }

  /*
  * On file selected change
  */
  onChangeImg(event) {
    const target = event.target || event.srcElement;
    if (target.value.length === 0) {
      const imgBrowser = this.imgView.nativeElement;
      imgBrowser.src = 'assets/img/profile.jpg';
    } else {
      const fileBrowser = this.fileInput.nativeElement;
      if (fileBrowser.files && fileBrowser.files[0]) {
        this.ng2ImgMax.resizeImage(fileBrowser.files[0], 1024, 576).subscribe(
          result => {
            this.uploadedImage = new File([result], result.name);
            this.getImagePreview(this.uploadedImage);
          },
          error => {

            console.log('😢 Oh no!', error);
          }
        );
      }
    }
  }

  /*
  * On Click Button Reset
  */
  onClear() {
    const imgBrowser = this.imgView.nativeElement;
    imgBrowser.src = 'assets/img/profile.jpg';
  }

  /*
  * Need to show preview image
  */
  getImagePreview(file: File) {
    const reader: FileReader = new FileReader();
    const imgView = this.imgView.nativeElement;
    const locateImage = this.locateImage.nativeElement;
    reader.readAsDataURL(file);
    reader.onload = () => {
      imgView.src = reader.result;
      locateImage.value = reader.result;
    };
  }


  onChangeLocation(e) {
    if (e !== '') {
      this.locationService.show().subscribe(res => {
        document.getElementById('map')
          .setAttribute('class', e);
        this.img = localStorage.getItem('isUrl') + 'img/' + e + '.jpg';
        this.deviceService.showAddedWhereObserve(e).pipe(takeUntil(this.dropUnsubs)).subscribe(resp => {this.droData = resp; } );
        this.deviceService.showAvailableObserv().pipe(takeUntil(this.dragUnsubs)).subscribe(resp => {this.draData = resp; } );
        this.dropData = this.deviceService.showAddedWhereObserve(e);
        this.dragData = this.deviceService.showAvailableObserv();

        $('#table_locate').hide();
        $('#reset_all').show();
      });
    } else {
        this.img = ''; // 'assets/img/placehold.jpg';
        this.droData = [];
        this.draData = [];
        this.dragData = null;
        this.dropData = null;

        this.dropUnsubs.next();
        this.dropUnsubs.complete();
        this.dragUnsubs.next();
        this.dragUnsubs.complete();

        $('#table_locate').show();
        $('#reset_all').hide();
    }
  }

}




@Component({
  templateUrl: './map-view.confirm.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
