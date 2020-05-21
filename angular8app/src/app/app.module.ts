import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';
import { ServiceModule } from "./services/service.module";

import { HttpClientModule} from "@angular/common/http";
import { MoviesComponent } from './pages/movies/movies.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/* Angular material 8 */
import { AngularMaterialModule } from './shared/angular-material.module';
import { UploaderComponent } from './pages/uploader/uploader.component';


@NgModule({
  declarations: [
    AppComponent,
    MoviesComponent,
    UploaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FileUploadModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ServiceModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
