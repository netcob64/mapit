import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LayoutModule } from '@angular/cdk/layout';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTreeModule } from '@angular/material/tree';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MainTabComponent } from './main-tab/main-tab.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MiddleComponent } from './middle/middle.component';

//import { DrawingFunctionListComponent } from './drawing-function-list/drawing-function-list.component';
//import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';


import { ApplicationFormComponent } from './application-form/application-form.component';
import { MetamodelFormComponent } from './metamodel-form/metamodel-form.component';
import { MapFormComponent } from './map-form/map-form.component';
import { MapFormDialogComponent } from './map-form/map-form-dialog.component';
import { LoginFormComponent } from './login-form/login-form.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here


import { ApplicationListComponent } from './application-list/application-list.component';
import { MetamodelListComponent } from './metamodel-list/metamodel-list.component';

import { DataService } from './core/services/data.service';
import { AppDataService } from './core/services/app.data.service';

import { GuiCtrlComponent} from './gui-ctrl-component';
// routing
//import { AppRoutingModule } from "./app-routing.module";

// components
import { HttpClientModule }    from '@angular/common/http';
import { NotFoundComponent } from "./not-found/not-found.component";
import { EscapeHtmlPipe, EnumToArrayPipe } from './core/util';



@NgModule({
  declarations: [
    AppComponent,
    GuiCtrlComponent,
    MainTabComponent,
    HeaderComponent,
    FooterComponent,
    MiddleComponent,
    ApplicationFormComponent,
    ApplicationListComponent,
    LoginFormComponent,
    NotFoundComponent,
    EscapeHtmlPipe, EnumToArrayPipe,
    MetamodelFormComponent,
    MetamodelListComponent,
    MapFormComponent,
    MapFormDialogComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    LayoutModule,
    MatMenuModule,
    MatTabsModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatGridListModule,
    MatListModule,
    MatTreeModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule, MatNativeDateModule,
    MatSelectModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    ReactiveFormsModule
  ],
  providers: [AppDataService, DataService, {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'}],
  bootstrap: [AppComponent],
  entryComponents: [MapFormDialogComponent]
})
export class AppModule { }
