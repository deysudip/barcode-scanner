import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ScannerComponent} from "./scanner/scanner.component";
import {CartComponent} from "./cart/cart.component";
import {InvoiceComponent} from "./invoice/invoice.component";


const routes: Routes = [
  { path: 'scan_product', component: ScannerComponent },
  { path: 'shopping_cart', component: CartComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: '', redirectTo: '/scan_product', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }

