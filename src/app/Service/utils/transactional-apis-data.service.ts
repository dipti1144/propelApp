import { Injectable } from '@angular/core';
import { FetchApiDataService } from './fetch-api-data.service';
import { getApiUrl, urlConfig } from 'src/app/constants/app-settings';

@Injectable({
  providedIn: 'root'
})
export class TransactionalApisDataService {
private baseurl ="https://testnode.propelapps.com"
  constructor(
    private fetchApiDataService : FetchApiDataService
  ) { }
  syncTransactionalDataAPIs(isDeltaSync: boolean, responsibilities = []): any {
    const orgId = urlConfig.orgId;
    const promiseArray=[
      // this.getSalesOrdersForPicking(isDeltaSync,orgId),
      // this.getSalesOrdersForShipping(isDeltaSync,orgId),
      this.getDocForReceiving(isDeltaSync),
      this.getLpnforSOPack(isDeltaSync,orgId),
      // this.getShippingMethods(isDeltaSync,orgId),
     
      // this.getPurchaseOrdersForReceiving(isDeltaSync,orgId),
      // this.getPurchaseOrdersForInspection(isDeltaSync,orgId),
      // this.getPurchaseOrdersForReturning(isDeltaSync,orgId),
      // this.getPutAwayTasks(isDeltaSync,orgId),
      // this.getPurchaseRequisitions(isDeltaSync,orgId),
      // this.getReceiptsForCorrection(isDeltaSync,orgId),
      // this.getVendorReceiptNumbers(isDeltaSync,orgId),
      // this.getPurchasingPeriods(isDeltaSync,orgId),
     
      // this.getMoveOrders(isDeltaSync,orgId),
      // this.getCycleCountItems(isDeltaSync,orgId),
      // this.getPhysicalCountItems(isDeltaSync,orgId),
      // this.getAllWMSTasks(isDeltaSync,orgId),
      // this.getPhysicalCountDefinitions(isDeltaSync,orgId),
      // this.getCycleCountSubinventories(isDeltaSync,orgId),
      // this.getItemCrossReferences(isDeltaSync,orgId),
      // this.getWorkOrdersForCompletion(isDeltaSync,orgId),
      // this.getWorkOrdersForMoveAndCompletion(isDeltaSync,orgId),
      // this.getWorkOrdersForAssemblyMove(isDeltaSync,orgId),
      // this.getWorkOrdersOperations(isDeltaSync,orgId),
      // this.getClosedWorkOrdersForOverCompletion(isDeltaSync,orgId),
      // this.getEAMWorkOrdersForMaterialIssue(isDeltaSync,orgId),
      // this.getEAMWorkOrdersForMaterialReturn(isDeltaSync,orgId),
      // this.getAssemblySerials(isDeltaSync,orgId),

    ]
    return promiseArray
  }

  


  //*************** OUTBOUND *************//
  private getDocForReceiving(isDeltaSync:boolean){
    const metadataUrl=getApiUrl("getDocForReceivingMetadata")
    const listUrl=getApiUrl("getDocForReceiving")
    const tableName="getDocForReceiving"
    
    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getDocForReceiving")

  }

  private getSalesOrdersForPicking(isDeltaSync:boolean,orgId:any){
   
    const metadataUrl=`${this.baseurl}/EBS/20D/getSalesOrdersForPicking/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getSalesOrdersForPicking/${orgId}/""/"Y"`;
    const tableName="getSalesOrdersForPicking";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getSalesOrdersForPicking")

  }

  private getSalesOrdersForShipping(isDeltaSync:boolean,orgId:any){
    
    const metadataUrl=`${this.baseurl}/EBS/20D/getSalesOrdersForShipping/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getSalesOrdersForShipping/${orgId}/""/"Y"`;
    const tableName="getSalesOrdersForShipping";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getSalesOrdersForShipping")

  }

  private getLpnforSOPack(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/22C/getLpnforSOPack/metadata`;
    const listUrl=`${this.baseurl}/EBS/22C/getLpnforSOPack/${orgId}/""`;
    const tableName="getLpnforSOPack";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getLpnforSOPack")

  }

  private getShippingMethods(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/22C/getShippingMethods/metadata`;
    const listUrl=`${this.baseurl}/EBS/22C/getShippingMethods/${orgId}/""`;
    const tableName="getShippingMethods";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getShippingMethods")

  }

  // private getFreightItems(isDeltaSync:boolean,orgId:any){
  //   const metadataUrl=`${this.baseurl}/EBS/22C/getFreightItems/metadata`;
  //   const listUrl=`${this.baseurl}/EBS/22C/getFreightItems/${orgId}/'"`;
  //   const tableName="getFreightItems";

  //   return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getFreightItems")

  // }

  //*************** INBOUND *************//

  private getPurchaseOrdersForReceiving(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getPurchaseOrdersForReceiving/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getPurchaseOrdersForReceiving/${orgId}/""/"Y"`;
    const tableName="getPurchaseOrdersForReceiving";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getPurchaseOrdersForReceiving")

  }

  private getPurchaseOrdersForInspection(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getPurchaseOrdersForInspection/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getPurchaseOrdersForInspection/${orgId}/""/"Y"`;
    const tableName="getPurchaseOrdersForInspection";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getPurchaseOrdersForInspection")

  }

  private getPurchaseOrdersForReturning(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getPurchaseOrdersForReturning/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getPurchaseOrdersForReturning/${orgId}/""/"N"`;
    const tableName="getPurchaseOrdersForReturning";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync, "getPurchaseOrdersForReturning")

  }

  private getPutAwayTasks(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getPutAwayTasks/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getPutAwayTasks/${orgId}`;
    const tableName="getPutAwayTasks";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getPutAwayTasks")

  }

  private getPurchaseRequisitions(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getPurchaseRequisitions/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getPurchaseRequisitions/${orgId}/%22%22/%22Y%22`;
    const tableName="getPurchaseRequisitions";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getPurchaseRequisitions")

  }

  private getReceiptsForCorrection(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getReceiptsForCorrection/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getReceiptsForCorrection/${orgId}/%22%22/%22Y%22`;
    const tableName="getReceiptsForCorrection";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getReceiptsForCorrection")

  }

  private getVendorReceiptNumbers(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getVendorReceiptNumbers/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getVendorReceiptNumbers/${orgId}`;
    const tableName="getVendorReceiptNumbers";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getVendorReceiptNumbers")

  }

  private getPurchasingPeriods(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getPurchasingPeriods/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getPurchasingPeriods/${orgId}`;
    const tableName="getPurchasingPeriods";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getPurchasingPeriods")

  }

  // private getAllOpenAsset(isDeltaSync:boolean,orgId:any){
  //   const metadataUrl=`${this.baseurl}/EBS/22B/getAllOpenAsset/metadata`;
  //   const listUrl=`${this.baseurl}/EBS/22B/getAllOpenAsset/${orgId}`;
  //   const tableName="getAllOpenAsset";

  //   return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getAllOpenAsset")

  // }


  //*************** INVENTORY TRANSFERS *************//
  

  private getMoveOrders(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getMoveOrders/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getMoveOrders/${orgId}/""/"N"`;
    const tableName="getMoveOrders";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getMoveOrders")

  }


  private getCycleCountItems(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getCycleCountItems/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getCycleCountItems/${orgId}/""/"Y"`;
    const tableName="getCycleCountItems";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getCycleCountItems")

  }

  private getPhysicalCountItems(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getPhysicalCountItems/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getPhysicalCountItems/${orgId}/""/"N"`;
    const tableName="getPhysicalCountItems";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getPhysicalCountItems")

  }

  private getAllWMSTasks(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getAllWMSTasks/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getAllWMSTasks/${orgId}/""/"Y"`;
    const tableName="getAllWMSTasks";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getAllWMSTasks")

  }

  private getPhysicalCountDefinitions(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getPhysicalCountDefinitions/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getPhysicalCountDefinitions/${orgId}`;
    const tableName="getPhysicalCountDefinitions";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getPhysicalCountDefinitions")

  }

  

  private getCycleCountSubinventories(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/22B/getCycleCountSubinventories/metadata`;
    const listUrl=`${this.baseurl}/EBS/22B/getCycleCountSubinventories/${orgId}`;
    const tableName="getCycleCountSubinventories";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getCycleCountSubinventories")

  }

  private getItemCrossReferences(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/23A/getItemCrossReferences/metadata`;
    const listUrl=`${this.baseurl}/EBS/23A/getItemCrossReferences/${orgId}/""`;
    const tableName="getItemCrossReferences";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getItemCrossReferences")

  }

  //***************** Discrete Manufacturing ***************//

  private getWorkOrdersForCompletion(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getWorkOrdersForCompletion/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getWorkOrdersForCompletion/${orgId}/""/"N"`;
    const tableName="getWorkOrdersForCompletion";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getWorkOrdersForCompletion")

  }

  private getWorkOrdersForMoveAndCompletion(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getWorkOrdersForMoveAndCompletion/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getWorkOrdersForMoveAndCompletion/${orgId}/""/"N"`;
    const tableName="getWorkOrdersForMoveAndCompletion";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getWorkOrdersForMoveAndCompletion")

  }

  private getWorkOrdersForAssemblyMove(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getWorkOrdersForAssemblyMove/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getWorkOrdersForAssemblyMove/${orgId}/""`;
    const tableName="getWorkOrdersForAssemblyMove";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getWorkOrdersForAssemblyMove")

  }

  private getWorkOrdersOperations(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getWorkOrdersOperations/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getWorkOrdersOperations/${orgId}/""`;
    const tableName="getWorkOrdersOperations";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getWorkOrdersOperations")

  }

  private getClosedWorkOrdersForOverCompletion(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getClosedWorkOrdersForOverCompletion/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getClosedWorkOrdersForOverCompletion/${orgId}/""/"Y"`;
    const tableName="getClosedWorkOrdersForOverCompletion";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getClosedWorkOrdersForOverCompletion")

  }

  private getEAMWorkOrdersForMaterialIssue(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getEAMWorkOrdersForMaterialIssue/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getEAMWorkOrdersForMaterialIssue/${orgId}/""/"Y"`;
    const tableName="getEAMWorkOrdersForMaterialIssue";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getEAMWorkOrdersForMaterialIssue")

  }

  private getEAMWorkOrdersForMaterialReturn(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/20D/getEAMWorkOrdersForMaterialReturn/metadata`;
    const listUrl=`${this.baseurl}/EBS/20D/getEAMWorkOrdersForMaterialReturn/${orgId}/""/"Y"`;
    const tableName="getEAMWorkOrdersForMaterialReturn";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getEAMWorkOrdersForMaterialReturn")

  }

  private getAssemblySerials(isDeltaSync:boolean,orgId:any){
    const metadataUrl=`${this.baseurl}/EBS/22C/getAssemblySerials/metadata`;
    const listUrl=`${this.baseurl}/EBS/22C/getAssemblySerials/${orgId}/""`;
    const tableName="getAssemblySerials";

    return this.fetchApiDataService.retrieveDataFromApi(listUrl,metadataUrl,tableName,isDeltaSync,"getAssemblySerials")

  }

  



}

