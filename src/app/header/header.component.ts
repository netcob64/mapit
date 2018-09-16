import { Component, OnInit, Input} from '@angular/core';
import { GuiCtrlComponent } from '../gui-ctrl-component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() guiCtrl : GuiCtrlComponent;
  constructor() { }
  ngOnInit() { }
}
