import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
})
export class ScannerComponent  {
  
  @Input() searchTerm: any = "";
  @Input() showSearch: boolean = false;
  @Output() toggleClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() clearSearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendScanValue: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private apiService:ApiServiceService
  ) { }

  


  async scan(): Promise<void> {
    try {
      const permission = await BarcodeScanner.checkPermission({ force: true });
      if (permission.granted) {
        BarcodeScanner.hideBackground();
        await BarcodeScanner.prepare();
        const result = await BarcodeScanner.startScan();
        if (result.hasContent) {
          this.sendScanValue.emit(result.content);
        } else {
          this.apiService.presentToast('Invalid barcode', 'danger');
        }
      } else {
        this.apiService.presentToast('Camera permission is required', 'danger');
      }
    } catch (error) {
      console.error('Error starting scan:', error);
      this.apiService.presentToast('An error occurred while scanning', 'danger');
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
}
