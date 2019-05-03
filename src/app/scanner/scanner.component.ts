import {Component, OnInit, ViewChild} from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import {ZXingScannerComponent} from '@zxing/ngx-scanner';
import {ModalDirective} from "ngx-bootstrap";
import {Product} from '../classes/product';
import {PRODUCTS_DUMMY} from '../dummyData/Products';
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements OnInit {

  hasCameras = false;
  hasPermission: boolean;
  resultString: string = '';
  lastResultString: string = '';
  availableDevices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo;

  allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX];

  product: Product;
  cartItems: Product[];
  productInCart: number = 0;

  @ViewChild('productModal') productModal: ModalDirective;
  isProductModalShown: boolean = false;
  @ViewChild('warningProductModal') warningProductModal: ModalDirective;
  isWarningProductModalShown: boolean = false;
  isWrongProductMessageShown: boolean = false;
  isDuplicateProductMessageShown: boolean = false;
  @ViewChild('scanErrorModal') scanErrorModal: ModalDirective;
  isScanErrorModalShown: boolean = false;

  constructor(
    private scanner: ZXingScannerComponent,
    private cookieService: CookieService
  ) {

  }

  ngOnInit(): void {

    this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
      console.error('No Camera Found.');
    });

    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      this.hasPermission = answer;
      console.debug('permission');
      console.debug(answer);
    });
    
    if (this.cookieService.get('cart-items') === '') {
      this.cartItems = [];
    }
    else {
      this.cartItems = JSON.parse(this.cookieService.get('cart-items'));
      this.productInCart = this.cartItems.length;
    }
  }

  handleCamerasFound(devices: MediaDeviceInfo[]){
    this.hasCameras = true;
    console.debug('camera found');
    console.debug('Devices: ', devices);
    this.availableDevices = devices;
    for (const device of devices) {
      if (/back|rear|environment/gi.test(device.label)) {
        this.scanner.changeDevice(device);
        this.selectedDevice = device;
        break;
      }
    }
    this.scanner.scan(this.selectedDevice.deviceId);
  }

  handleScanResult(resultString: string) {
    this.stopScan();
    console.debug('Result: ', resultString);
    this.lastResultString = resultString;

    if (this.lastResultString !== this.resultString){
      if (resultString.length === 13) {
        this.resultString = resultString.slice(1, 12);
      }
      else if (resultString.length === 11) {
        this.resultString = resultString;
      }

      if (this.checkProduct(this.resultString)) {
        let productFound = false;
        for (let i = 0; i < this.cartItems.length; i++) {
          if (this.product.id === this.cartItems[i].id) {
            productFound = true;
            this.displayWarningProductModal('duplicate_product');
            break;
          }
        }
        if (!productFound) {
          this.displayProductModal();
        }
      }
      else {
        this.displayWarningProductModal('wrong_product');
      }
    }
  }

  handleScanFailure(e ) {
    this.stopScan();
    console.debug('Scan Failed');
    console.debug(e);
    this.displayErrorScanModal();
  }

  handleScanComplete(e) {
    console.debug('Scan Complete');
  }

  stopScan() {
    console.debug('stopping scan');
    this.scanner.resetCodeReader();
  }

  checkProduct(productId) {
    for (let i = 0; i < PRODUCTS_DUMMY.length; i++) {
      if (productId === PRODUCTS_DUMMY[i].id) {
        this.product = PRODUCTS_DUMMY[i];
        return true;
      }
    }
    return false;
  }

  displayProductModal() {
    this.isProductModalShown = true;
  }

  displayWarningProductModal(type: string) {
    this.isWarningProductModalShown = true;
    if (type === 'wrong_product'){
      this.isWrongProductMessageShown = true;
    }
    else this.isDuplicateProductMessageShown = true;
  }

  displayErrorScanModal() {
    this.isScanErrorModalShown = true;
  }

  addToCart() {
    this.cartItems.push(this.product);
    this.productInCart++;
    this.cookieService.set( 'cart-items', JSON.stringify(this.cartItems ));

    this.cancelModal('product');
  }

  cancelModal(type: string): void {
    this.lastResultString = '';
    if (type === 'product') {
      this.productModal.hide();
      this.product = {
        id: '',
        productId: '',
        name: '',
        price: 0,
        img: ''
      };
    }
    else if (type === 'warning_product') {
      this.warningProductModal.hide();
    }
    else if (type === 'scan_error') {
      this.scanErrorModal.hide();
    }

    console.debug('starting scan again!');
    this.scanner.startScan(this.selectedDevice);
  }

  onModalHide() {
    this.isProductModalShown = false;
    this.isWarningProductModalShown = false;
    this.isWrongProductMessageShown = false;
    this.isDuplicateProductMessageShown = false;
    this.isScanErrorModalShown = false;
  }

  removeItem(){
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.product.id === this.cartItems[i].id) {
        this.cartItems.splice(i, 1);
        break;
      }
    }
    this.productInCart--;
    this.lastResultString = '';
  }

}
