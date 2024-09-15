import { Injectable } from '@angular/core';
import { FetchApiDataService } from './fetch-api-data.service';
import { getApiUrl } from 'src/app/constants/app-settings';

@Injectable({
  providedIn: 'root'
})

export class MasterApisDataService {
private baseurl ="https://testnode.propelapps.com"
  constructor(
    private fetchApiDataService : FetchApiDataService
  ) { }
  syncMasterDataAPIs(isDeltaSync: boolean, responsibilities = []): any {
   
   const promiseArray=[
   
    
   
    this.getEmployees(isDeltaSync),
    this.getDocForReceiving(isDeltaSync),
    // this.getoperatingunits(isDeltaSync),
    // this.getItemInstances(isDeltaSync),
    // this.getItemInstanceStatuses(isDeltaSync),
    // this.getItemInstanceAssets(isDeltaSync),
    
    // this.getSubinventories(isDeltaSync),
    // this.getLocators(isDeltaSync),
    // this.getRestrictedLocators(isDeltaSync),
   
    // this.getOnHandQuantities(isDeltaSync),
   
    // this.getUnitOfMeasuresConversions(isDeltaSync),
    // this.getItemRevisions(isDeltaSync),
    // this.getOnHandTableType(isDeltaSync),
   
    // this.getRestrictedSubInventories(isDeltaSync),
    // this.getlocatorswithsegments(isDeltaSync),
    // this.getPaginationsBatch(isDeltaSync),
    

   ]
   return promiseArray
  }
  

  private getDocForReceiving(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("getDocForReceivingMetadata")
    const listUrl=getApiUrl("getDocForReceiving")
    const tableName="getDocForReceiving"
    
    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getDocForReceiving")

  }

  // private getItems(isDeltaSync:boolean){
  //   const metadataUrl=getApiUrl("itemsMetadata")
  //   const listUrl=getApiUrl("items")
  //   const tableName="getItems";

  //   return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getItems")
  // }


private getEmployees(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("employeesMetadata");
    const listUrl=getApiUrl("employees");
    const tableName="getEmployees";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getEmployees")
  }

  private getoperatingunits(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("operatingunitsMetadata");
    const listUrl=getApiUrl("operatingunits");
    const tableName="getoperatingunits";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getoperatingunits")
  }

  private getItemInstances(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("ItemInstancesMetadata");
    const listUrl=getApiUrl("ItemInstances");
    const tableName="getItemInstances";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getItemInstances")
  }


  private getItemInstanceStatuses(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("ItemInstanceStatusesMetadata");
    const listUrl=getApiUrl("ItemInstanceStatuses");
    const tableName="getItemInstanceStatuses";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getItemInstanceStatuses")
  }

  private getItemInstanceAssets(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("ItemInstanceAssetsMetadata");
    const listUrl=getApiUrl("ItemInstanceAssets");
    const tableName="getItemInstanceAssets";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getItemInstanceAssets")
  }

  // private getAssetRetirementTypes(isDeltaSync:boolean){
  //   const metadataUrl=getApiUrl("AssetRetirementTypesMetadata")
  //   const listUrl=getApiUrl("AssetRetirementTypes")
  //   const tableName="getAssetRetirementTypes";

  //   return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getAssetRetirementTypes")
  // }


  private getSubinventories(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("SubinventoriesMetadata")
    const listUrl=getApiUrl("Subinventories")
    const tableName="getSubinventories";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getSubinventories")
  }


  private getLocators(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("LocatorsMetadata")
    const listUrl=getApiUrl("Locators")
    const tableName="getLocators";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getLocators")
  }


  private getRestrictedSubInventories(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("RestrictedSubInventoriesMetadata")
    const listUrl=getApiUrl("RestrictedSubInventories")
    const tableName="getRestrictedSubInventories";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getRestrictedSubInventories")
  }

  

  private getRestrictedLocators(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("RestrictedLocatorsMetadata")
    const listUrl=getApiUrl("RestrictedLocators")
    const tableName="getRestrictedLocators";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getRestrictedLocators")
  }

  private getOnHandQuantities(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("OnHandQuantitiesMetadata");
    const listUrl=getApiUrl("OnHandQuantities")
    const tableName="getOnHandQuantities";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getOnHandQuantities")
  }


  // private getItemOnhandInquiry(isDeltaSync:boolean){
  //   const metadataUrl=getApiUrl("ItemOnhandInquiryMetadata")
  //   const listUrl=getApiUrl("ItemOnhandInquiry")
  //   const tableName="getItemOnhandInquiry";

  //   return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getItemOnhandInquiry")
  // }


  // private getTransactionHistory(isDeltaSync:boolean){
  //   const metadataUrl=getApiUrl("TransactionHistoryMetadata")
  //   const listUrl=getApiUrl("TransactionHistory")
  //   const tableName="getTransactionHistory";

  //   return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getTransactionHistory")
  // }

  private getUnitOfMeasuresConversions(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("UnitOfMeasuresConversionsMetadata")
    const listUrl=getApiUrl("UnitOfMeasuresConversions")
    const tableName="getUnitOfMeasuresConversions";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getUnitOfMeasuresConversions")
  }

  private getItemRevisions(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("ItemRevisionsMetadata")
    const listUrl=getApiUrl("ItemRevisions")
    const tableName="getItemRevisions";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getItemRevisions")
  }
  

  private getOnHandTableType(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("OnHandTableTypeMetadata")
    const listUrl=getApiUrl("OnHandTableType")
    const tableName="getOnHandTableType";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getOnHandTableType")
  }
  

  // private getAllActivity(isDeltaSync:boolean){
  //   const metadataUrl=getApiUrl("AllActivityMetadata")
  //   const listUrl=getApiUrl("AllActivity")
  //   const tableName="getAllActivity";

  //   return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync , "getAllActivity")
  // }
  

  private getlocatorswithsegments(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("locatorswithsegmentsMetadata")
    const listUrl=getApiUrl("locatorswithsegments")
    const tableName="getlocatorswithsegments";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getlocatorswithsegments")
  }
  
  private getPaginationsBatch(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("PaginationsBatchMetadata")
    const listUrl=getApiUrl("PaginationsBatch")
    const tableName="getPaginationsBatch";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getlocatorswithsegments")
  }
  

}
