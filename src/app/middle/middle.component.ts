import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, Input } from '@angular/core';
import { GuiCtrlComponent } from '../gui-ctrl-component';
import { ItApplication } from '../core/models/it-application';
import { MatTreeModule } from '@angular/material/tree';

@Component({
  selector: 'app-middle',
  templateUrl: './middle.component.html',
  styleUrls: ['./middle.component.css']
})

export class MiddleComponent implements OnInit {
  @Input() guiCtrl: GuiCtrlComponent;
  @Input() panelOpenState: boolean = true;

  constructor() { }

  ngOnInit() {
    this.guiCtrl.GetApplications();
    this.guiCtrl.GetMetamodels();
  }

  AddNewApplication(event: Event): void {
    event.stopPropagation(); // if not the accordilion close
    this.guiCtrl.AddNewApplication();
  }
  
  AddNewMetamodel(event: Event): void {
    event.stopPropagation(); // if not the accordilion close
    this.guiCtrl.AddNewMetamodel();
  }

  OnClose(): void { }
}
