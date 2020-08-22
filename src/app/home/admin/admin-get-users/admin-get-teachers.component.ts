import { Component, OnInit, } from '@angular/core';
import { ROLE_ADMIN, URI_MANAGER, URI_TEACHER } from '../../../app.config';


@Component({
  template: `<nx-users [uriRole] ="uriRole" [areaRole] ="areaRole"></nx-users>`,
  styles: [`
    :host  {
    display: block;
    width: 100%;
  }
  `]
})

export class AdminGetTeachersComponent implements OnInit {
  
  uriRole = URI_TEACHER;
  areaRole = ROLE_ADMIN;

  constructor() { }

  ngOnInit() {

  }

}


