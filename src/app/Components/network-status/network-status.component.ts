import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NetworkService } from 'src/app/Service/network.service';

@Component({
  selector: 'app-network-status',
  templateUrl: './network-status.component.html',
  styleUrls: ['./network-status.component.scss'],
})
export class NetworkStatusComponent implements OnInit {
  isOnline: boolean = true;

  constructor(private networkService: NetworkService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Subscribe to network status changes
    this.networkService.getNetworkStatus().subscribe((connected) => {
      this.isOnline = connected;
      this.cdr.detectChanges();
    });
  }
}
