import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavComponent } from './layout/nav/nav.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './layout/home/home.component';
import { AboutComponent } from './layout/about/about.component';
import { TopBarComponent } from './layout/top-bar/top-bar.component';
import { BannerComponent } from './layout/banner/banner.component';
import { NG_ENTITY_SERVICE_CONFIG } from '@datorama/akita-ng-entity-service';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { HttpClientModule } from '@angular/common/http';
import { ImageUploaderModule } from 'ngx-image-uploader-next';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgOpenCVModule, OpenCVOptions } from "ng-open-cv";
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { HealthSupporterComponent } from './features/health-supporter/health-supporter.component';

const openCVConfig: OpenCVOptions = {
  scriptUrl: `assets/opencv/opencv.js`,
  wasmBinaryFile: 'wasm/opencv_js.wasm',
  usingWasm: true
};

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    TopBarComponent,
    BannerComponent,
    HealthSupporterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    AkitaNgRouterStoreModule,
    FormsModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule.forRoot(),
    NgOpenCVModule.forRoot(openCVConfig),
    ImageUploaderModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    CommonModule,
    NgSelectModule
  ],
  exports: [BrowserModule, NgOpenCVModule],
  providers: [{ provide: NG_ENTITY_SERVICE_CONFIG, useValue: { baseUrl: environment.apiUrl } }],
  bootstrap: [AppComponent]
})
export class AppModule { }
