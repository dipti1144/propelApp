import { Injectable } from '@angular/core';
import { MasterApisDataService } from './master-apis-data.service';
import { TransactionalApisDataService } from './transactional-apis-data.service';
import { ConfigApisDataService } from './config-apis-data.service';

@Injectable({
  providedIn: 'root'
})
export class SyncApiDataService {

  constructor(
    private masterApisDataService : MasterApisDataService,
    private configApisDataService : ConfigApisDataService,
    private transactionalApisDataService : TransactionalApisDataService
  ) { }


  
  getSyncAccordingToResp(isDeltaSync: boolean, responsibilityArray: string[]): Promise<any>[] {
    const promiseArray = [];

    if (!isDeltaSync) {
      promiseArray.push(...this.masterApisDataService.syncMasterDataAPIs(isDeltaSync));
      promiseArray.push(...this.configApisDataService.syncConfigDataAPIs(isDeltaSync));
    }
    
    promiseArray.push(...this.transactionalApisDataService.syncTransactionalDataAPIs(isDeltaSync));

    return promiseArray;
  }
}
