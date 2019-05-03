import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ZXingScannerComponent, ZXingScannerModule} from '@zxing/ngx-scanner';
import {ModalModule} from 'ngx-bootstrap/modal';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {CookieService} from "ngx-cookie-service";

import { AppComponent } from './app.component';
import { ScannerComponent } from './scanner/scanner.component';
import { AppRoutingModule } from './app-routing.module';
import { CartComponent } from './cart/cart.component';
import { InvoiceComponent } from './invoice/invoice.component';
@NgModule({
  declarations: [
    AppComponent,
    ScannerComponent,
    CartComponent,
    InvoiceComponent
  ],
  imports: [
    BrowserModule,
    ZXingScannerModule.forRoot(),
    ModalModule.forRoot(),
    AngularFontAwesomeModule,
    AppRoutingModule
  ],
  providers: [
    ZXingScannerComponent,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
