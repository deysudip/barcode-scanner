import { Component, OnInit } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Cart} from "../classes/cart";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  cartProducts: Cart[] = [];
  totalCost: number = 0;

  constructor(
    private cookieService: CookieService
  ) {

  }

  ngOnInit() {

    this.cookieService.set('cart-items','', -1);

    if (this.cookieService.get('final-cart') === '') {
      this.cartProducts = [];
    }
    else {
      this.cartProducts = JSON.parse(this.cookieService.get('final-cart'));

      for (let i=0; i<this.cartProducts.length;i++){
        this.totalCost += this.cartProducts[i].price * this.cartProducts[i].qty;
      }
    }
  }

}
