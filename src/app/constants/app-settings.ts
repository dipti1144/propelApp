

export const AppConfig = {
  API_EBS_BASEURL: 'https://testnode.propelapps.com/',
  API_EBS_0220: 'EBS/0220',
  API_EBS_20D: 'EBS/20D',
  API_EBS_22A: 'EBS/22A',
  API_EBS_22B: 'EBS/22B',
  API_EBS_22C: 'EBS/22C',
  API_EBS_23A: 'EBS/23A',
  API_SCM_0220: 'SCM/0220',
  API_SCM_0820: 'SCM/0820'
};



export const urlConfig = {
  get orgId(): number {
    return Number(localStorage.getItem('selectedOrganization'));
  },
};
export function getApiUrl(key: keyof typeof URLS): string {
  return URLS[key];
}

const orgId = urlConfig.orgId;

export const URLS = {
  
  
  get getDocForReceiving(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getDocumentsForReceiving/7925/%22%22/%22%22`;
  },

  get getDocForReceivingMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getDocumentsForReceiving/metadata`;
  },
  

  

  get employees(): string {
    
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getEmployees/${orgId}/""/"Y"`;
  },

  get employeesMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getEmployees/metadata`;
  },

  get operatingunits(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getoperatingunits/32890`;
  },

  get operatingunitsMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getoperatingunits/metadata`;
  },

  get ItemInstances(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22A}/getItemInstances/${orgId}/%22%22`;
  },

  get ItemInstancesMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22A}/getItemInstances/metadata`;
  },

  get ItemInstanceStatuses(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22A}/getItemInstanceStatuses/${orgId}/%22%22`;
  },

  get ItemInstanceStatusesMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22A}/getItemInstanceStatuses/metadata`;
  },
  get ItemInstanceAssets(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22A}/getItemInstanceAssets/${orgId}/%22%22`;
  },

  get ItemInstanceAssetsMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22A}/getItemInstanceAssets/metadata`;
  },

  // get AssetRetirementTypes(): string {
  //   return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22A}/getAssetRetirementTypes`;
  // },

  // get AssetRetirementTypesMetadata(): string {
  //   return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22A}/getAssetRetirementTypes/metadata`;
  // },

  get Subinventories(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getSubinventories/${orgId}/%22%22/%22Y%22`;
  },

  get SubinventoriesMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getSubinventories/metadata`;
  },

  get Locators(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getLocators/${orgId}/%22%22/%22Y%22`;
  },

  get LocatorsMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getLocators/metadata`;
  },

  get RestrictedSubInventories(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getRestrictedSubInventories/${orgId}/%22%22/%22Y%22`;
  },

  get RestrictedSubInventoriesMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getRestrictedSubInventories/metadata`;
  },

  get RestrictedLocators(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getRestrictedLocators/${orgId}/%22%22/%22Y%22`;
  },

  get RestrictedLocatorsMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getRestrictedLocators/metadata`;
  },

  get OnHandQuantities(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getOnHandQuantities/${orgId}`;
  },

  get OnHandQuantitiesMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getOnHandQuantities/metadata`;
  },

  get ItemOnhandInquiry(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getItemOnhandInquiry/${orgId}`;
  },

  get ItemOnhandInquiryMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getItemOnhandInquiry/metadata`;
  },

  // get TransactionHistory(): string {
  //   return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getTransactionHistory/''/''/'SUCCESS'`;
  // },

  // get TransactionHistoryMetadata(): string {
  //   return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getTransactionHistory/metadata`;
  // },

  get UnitOfMeasuresConversions(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getUnitOfMeasuresConversions/${orgId}/%22%22`;
  },

  get UnitOfMeasuresConversionsMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getUnitOfMeasuresConversions/metadata`;
  },

  get ItemRevisions(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getItemRevisions/${orgId}/""`;
  },

  get ItemRevisionsMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getItemRevisions/metadata`;
  },

  get OnHandTableType(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22A}/getOnHandTableType/${orgId}`;
  },

  get OnHandTableTypeMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22A}/getOnHandTableType/metadata`;
  },

  get AllActivity(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22B}/getAllActivity/${orgId}`;
  },

  get AllActivityMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22B}/getAllActivity/metadata`;
  },

  get locatorswithsegments(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22C}/getlocatorswithsegments/${orgId}/""`;
  },

  get locatorswithsegmentsMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22C}/getlocatorswithsegments/metadata`;
  },

  get PaginationsBatch(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_23A}/getPaginationsBatch/${orgId}/'ITEM_SERIAL'`;
  },

  get PaginationsBatchMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_23A}/getPaginationsBatch/metadata`;
  },

//   *************config apis*************//

  // get glaccounts(): string {
  //   return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getglaccounts/83`;
  // },

  // get glaccountsMetadata(): string {
  //   return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getglaccounts/metadata`;
  // },

  get reasons(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getreasons/${orgId}`;
  },

  get reasonsMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getreasons/metadata`;
  },

  get InventoryPeriods(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getInventoryPeriods/${orgId}`;
  },

  get InventoryPeriodsMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getInventoryPeriods/metadata`;
  },

  get GLPeriods(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getGLPeriods/${orgId}`;
  },

  get GLPeriodsMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getGLPeriods/metadata`;
  },

  get lpnsforpack(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getlpnsforpack/${orgId}/""/"Y"`;
  },

  get lpnsforpackMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getlpnsforpack/metadata`;
  },

  get LPNsForUnPack(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getLPNsForUnPack/${orgId}/"30-OCT-2021 05:10:00"/"N"`;
  },

  get LPNsForUnPackMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getLPNsForUnPack/metadata`;
  },

  get LPNsForSubInventoryTransfer(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_SCM_0220}/getLPNsForSubInventoryTransfer/${orgId}/""/"Y`;
  },

  get LPNsForSubInventoryTransferMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_SCM_0220}/getLPNsForSubInventoryTransfer/metadata`;
  },

  get lpnsforwipcompletion(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getlpnsforwipcompletion/${orgId}/""/"Y"`;
  },

  get lpnsforwipcompletionMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getlpnsforwipcompletion/metadata`;
  },

  get LPNsForPutAway(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_SCM_0820}/getLPNsForPutAway/${orgId}/""/"Y"`;
  },

  get LPNsForPutAwayMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_SCM_0820}/getLPNsForPutAway/metadata`;
  },

  // get LPNsForReceiving(): string {
  //   return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_SCM_0820}/getLPNsForReceiving/7925/"29-DEC-2022 03:10:00"/"N"`;
  // },

  // get LPNsForReceivingMetadata(): string {
  //   return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_SCM_0820}/getLPNsForReceiving/metadat`;
  // },

  get Lots(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getLots/${orgId}/%22%22/%22Y%22`;
  },

  get LotsMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getLots/metadata`;
  },

  get AccountAliases(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getAccountAliases/${orgId}`;
  },

  get AccountAliasesMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getAccountAliases/metadata`;
  },

  // get PARCountItems(): string {
  //   return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getPARCountItems/${orgId}/"08-FEB-2022 07:10:00"/"N"`;
  // },

  get PARCountItemsMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getPARCountItems/metadata`;
  },

  get ReturnSerialTransactions(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getReturnSerialTransactions/${orgId}`;
  },

  get ReturnSerialTransactionsMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_20D}/getReturnSerialTransactions/metadata`;
  },

  get SerialDetails(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22C}/getSerialDetails/${orgId}/629/''/''`;
  },

  get SerialDetailsMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22C}/getSerialDetails/metadata`;
  },

  get SerialTransactions(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22C}/getSerialTransactions/${orgId}/629/''`;
  },

  get SerialTransactionsMetadata(): string {
    return `${AppConfig.API_EBS_BASEURL}${AppConfig.API_EBS_22C}/getSerialTransactions/metadata`;
  },


};
