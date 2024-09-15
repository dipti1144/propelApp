import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private networkStatus = new BehaviorSubject<boolean>(true);

  constructor() {
    this.initializeNetworkEvents();
  }

  // Initialize network status check and monitor changes
  async initializeNetworkEvents() {
    const status = await Network.getStatus();
    this.networkStatus.next(status.connected);

    // Listen for network status changes
    Network.addListener('networkStatusChange', (status) => {
      this.networkStatus.next(status.connected);
    });
  }

  // Get the current network status as an observable
  getNetworkStatus() {
    return this.networkStatus.asObservable();
  }

  // Get current status directly (useful for initial checks)
  async checkNetworkStatus() {
    const status = await Network.getStatus();
    return status.connected;
  }
}
