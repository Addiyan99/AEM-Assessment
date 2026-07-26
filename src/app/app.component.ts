import { Component, OnInit } from '@angular/core';
import PouchDB from 'pouchdb-browser';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styles: []
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    // Expose PouchDB on window for console testing
    (window as any).PouchDB = PouchDB;
  }
}
