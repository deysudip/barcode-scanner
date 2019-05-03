import { Component, OnInit } from '@angular/core'
import {CookieService} from "ngx-cookie-service";
import {Product} from '../classes/product';
import {Cart} from "../classes/cart";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: Product[];
  cartProducts: Cart[] = [];
  totalCost: number = 0;
  constructor(
    private cookieService: CookieService
  ) {

  }

  ngOnInit() {
    if (this.cookieService.get('cart-items') === '') {
      this.cartItems = [];
    }
    else {
      this.cartItems = JSON.parse(this.cookieService.get('cart-items'));
    }

    this.cartItems.sort(function (a, b) {
      if (a.productId < b.productId) {
        return -1;
      }
      if (a.productId > b.productId) {
        return 1;
      }

      return 0;
    });

    console.debug(this.cartItems);

    let curProductId = '';
    let lastProductId = '';
    let cartProduct: Cart = {
      productId: '',
      name: '',
      price: 0,
      qty: 0,
      img: '',
      items: []
    };
    for (let i = 0; i < this.cartItems.length; i++) {
      console.log(this.cartItems[i]);
      curProductId = this.cartItems[i].productId;
      if (curProductId === lastProductId) {
        cartProduct.items.push(this.cartItems[i].id);
        cartProduct.qty++;
      }
      else {
        if (i !== 0) {
          this.cartProducts.push(cartProduct);
          this.totalCost += cartProduct.qty * cartProduct.price;
        }
        cartProduct = {
          productId: '',
          name: '',
          price: 0,
          qty: 0,
          img: '',
          items: []
        };
        cartProduct.productId = curProductId;
        cartProduct.name = this.cartItems[i].name;
        cartProduct.price = this.cartItems[i].price;
        cartProduct.qty = 1;
        cartProduct.img = this.cartItems[i].img;
        cartProduct.items.push(this.cartItems[i].id);
      }
      lastProductId = curProductId;
    }
    this.cartProducts.push(cartProduct);
    this.totalCost += cartProduct.qty * cartProduct.price;
    this.cookieService.set('final-cart', JSON.stringify(this.cartProducts));
  }

  emptyCart() {
    this.cookieService.set('cart-items','', -1);
    this.cartProducts = [];
  }
}
