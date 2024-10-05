import { Injectable } from '@angular/core';
import { FetchApiDataService } from './fetch-api-data.service';
import { getApiUrl } from 'src/app/constants/app-settings';

@Injectable({
  providedIn: 'root'
})
export class ConfigApisDataService {
private baseurl ="https://testnode.propelapps.com"
  constructor(
    private fetchApiDataService : FetchApiDataService
  ) { }
  syncConfigDataAPIs(isDeltaSync: boolean, responsibilities = []): any {
    const promiseArray=[
      
      
      this.getGLPeriods(isDeltaSync),
      // this.getlpnsforpack(isDeltaSync),
      // this.getLPNsForUnPack(isDeltaSync),
      // this.getLPNsForSubInventoryTransfer(isDeltaSync),
      // this.getlpnsforwipcompletion(isDeltaSync),
      // this.getLPNsForPutAway(isDeltaSync),
      this.getSerial(isDeltaSync),
      this.getLot(isDeltaSync),
      // this.getAccountAliases(isDeltaSync),
      
      // this.getReturnSerialTransactions(isDeltaSync),
      // this.getSerialDetails(isDeltaSync),
      // this.getSerialTransactions(isDeltaSync),
      
    ]

    return promiseArray
  }



  // private getglaccounts(isDeltaSync:boolean){
  //   const metadataUrl=getApiUrl("glaccountsMetadata")
  //   const listUrl=getApiUrl("glaccounts")
  //   const tableName="glaccounts";

  //   return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getglaccounts")

  // }

  // private getreasons(isDeltaSync:boolean){
  //   const metadataUrl=getApiUrl("reasonsMetadata")
  //   const listUrl=getApiUrl("reasons")
  //   const tableName="getreasons";

  //   return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getreasons")

  // }

  // private getInventoryPeriods(isDeltaSync:boolean){
  //   const metadataUrl=getApiUrl("InventoryPeriodsMetadata")
  //   const listUrl=getApiUrl("InventoryPeriods")
  //   const tableName="getInventoryPeriods";

  //   return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getInventoryPeriods")

  // }

  private getGLPeriods(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("GLPeriodsMetadata")
    const listUrl=getApiUrl("GLPeriods")
    const tableName="getGLPeriods";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getGLPeriods")

  }

  private getlpnsforpack(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("lpnsforpackMetadata")
    const listUrl=getApiUrl("lpnsforpack")
    const tableName="getlpnsforpack";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getlpnsforpack")

  }

  private getLPNsForUnPack(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("LPNsForUnPackMetadata")
    const listUrl=getApiUrl("LPNsForUnPack")
    const tableName="getLPNsForUnPack";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getLPNsForUnPack")

  }

  private getLPNsForSubInventoryTransfer(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("LPNsForSubInventoryTransferMetadata")
    const listUrl=getApiUrl("LPNsForSubInventoryTransfer")
    const tableName="getLPNsForSubInventoryTransfer";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getLPNsForSubInventoryTransfer")

  }


  private getlpnsforwipcompletion(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("lpnsforwipcompletionMetadata")
    const listUrl=getApiUrl("lpnsforwipcompletion")
    const tableName="getlpnsforwipcompletion";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getlpnsforwipcompletion")

  }

  private getLPNsForPutAway(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("LPNsForPutAwayMetadata")
    const listUrl=getApiUrl("LPNsForPutAway")
    const tableName="getLPNsForPutAway";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getLPNsForPutAway")

  }

 

  private getLot(isDeltaSync:boolean){
    const metadataUrl="https://testnode.propelapps.com/EBS/20D/getLots/metadata"
    const listUrl="https://testnode.propelapps.com/EBS/20D/getLots/7925/%22%22/%22Y%22"
    const tableName="getLot";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getLot")

  }
  
  private getSerial(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("SerialMetadata")
    const listUrl=getApiUrl("Serial")
    const tableName="getSerial"

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getSerial")
    
  }

  private getAccountAliases(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("AccountAliasesMetadata")
    const listUrl=getApiUrl("AccountAliases")
    const tableName="getAccountAliases";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getAccountAliases")

  }

  // private getPARCountItems(isDeltaSync:boolean){
  //   const metadataUrl=getApiUrl("PARCountItemsMetadata")
  //   const listUrl=getApiUrl("PARCountItems")
  //   const tableName="getPARCountItems";

  //   return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getPARCountItems")

  // }

  private getReturnSerialTransactions(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("ReturnSerialTransactionsMetadata")
    const listUrl=getApiUrl("ReturnSerialTransactions")
    const tableName="getReturnSerialTransactions";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getReturnSerialTransactions")

  }

  private getSerialDetails(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("SerialDetailsMetadata")
    const listUrl=getApiUrl("SerialDetails")
    const tableName="getSerialDetails";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getSerialDetails")

  }

  private getSerialTransactions(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("SerialTransactionsMetadata")
    const listUrl=getApiUrl("SerialTransactions")
    const tableName="getSerialTransactions";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getSerialTransactions")

  }

}

