import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { GuiCtrlComponent } from '../gui-ctrl-component';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit, AfterViewInit {
	@Input() guiCtrl : GuiCtrlComponent;
	@ViewChild('loginInput') loginElt : ElementRef;
	@ViewChild('passwordInput') passwordElt : ElementRef;
	password: string; 
  	login: string;
	
	constructor(/*private rd: Renderer2*/) { }

	Login(): void {
		//this.login=this.loginElt.nativeElement.value;
		//this.password=this.loginElt.nativeElement.value;
      if (!this.guiCtrl.Login(this.login, this.password)) {
        this.loginElt.nativeElement.focus();
      }
    }

  	Validate(event:KeyboardEvent): void {
  		if (event.which==13) this.Login();
  	}

  	PasswordFocus(event:KeyboardEvent): void {
  		if (event.which==13) {
  			this.passwordElt.nativeElement.focus();
  		}
  	}

  	ngOnInit() { this.loginElt.nativeElement.focus();
  	}
  	
  	ngAfterViewInit() {
  		
  	}

}
