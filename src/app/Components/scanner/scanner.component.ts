import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
})
export class ScannerComponent implements OnDestroy {
  
  timeoutSubscription: Subscription | null = null;

  @Input() searchTerm: any = "";
  @Input() showSearch: boolean = false;
  @Output() toggleClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() clearSearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendScanValue: EventEmitter<any> = new EventEmitter<any>();

  constructor( ) {}

  async scan(): Promise<void> {
    await BarcodeScanner.checkPermission({ force: true });
    BarcodeScanner.hideBackground();
    BarcodeScanner.prepare();
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {
      this.sendScanValue.emit(result.content);
    }
    else {
      console.log('Error', 'invalid barcode', 'danger');
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  }
 
 
  updateFilteredOptions() {
    this.searchChange.emit(this.searchTerm);
  }
 
  clearSearch() {
    this.searchTerm = '';
    this.clearSearchChange.emit(this.searchTerm)
  }

  ngOnDestroy() {
    if (this.timeoutSubscription) {
      this.timeoutSubscription.unsubscribe();
    }
  }
}
