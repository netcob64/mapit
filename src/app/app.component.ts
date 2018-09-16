import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent   {
    me : AppComponent = this;
    
    logged : boolean = true;
	  title : string = 'MapIT';
  

    constructor() { 
       //console.log('localStorage.getItem(auth_token)='+localStorage.getItem('auth_token'));
       //console.log('sessionStorage.getItem(auth_token)='+sessionStorage.getItem('auth_token'));
       if (sessionStorage.getItem('auth_token')!=null) 
         this.logged=true;
       //localStorage.setItem('auth_token', 'key2');
    }

    TraceSession() : string {
      var str : string;
      str = 'SESSION auth_token: '+sessionStorage.getItem('auth_token');
      //str += '\nLOCAL auth_token: '+localStorage.getItem('auth_token');
      return str;
    }
}
