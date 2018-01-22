import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor() {
    const urls = ['/backend/', '//localhost/backend_test/', 'http://phufa-public.ddns.net:1234/', 'http://api.upcarpark.xyz/'];
    localStorage.setItem('isUrl', urls[1]);
  }
}
