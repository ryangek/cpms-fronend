import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Location, LocationService } from '../../shared';

@Component({
  selector: 'app-locate-table',
  templateUrl: './locate-table.component.html',
  styleUrls: ['./locate-table.component.scss']
})
export class LocateTableComponent implements OnInit, OnDestroy {

  local: Location[];
  dtOptions: DataTables.Settings = {};
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();

  sub: any;

  constructor(private locationService: LocationService) { }


  ngOnInit(): void {
    this.dtOptions = {
      pageLength: 10
    };
    this.sub = this.locationService.show().subscribe(res => {
	   	this.local = res;
	    setTimeout(() => {
			this.dtTrigger.next();
		}, 500);
	});
  }

  ngOnDestroy(): void {
  	this.sub.unsubscribe();
  }

}
