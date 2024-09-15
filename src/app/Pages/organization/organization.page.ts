import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiServiceService } from '../../Service/api-service.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { SqliteService } from 'src/app/Service/sqlite.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.page.html',
  styleUrls: ['./organization.page.scss'],
})
export class OrganizationPage implements OnInit, OnDestroy {
  userData: any[] = [];
  selectedOrganization: string = '';
  OrganizationCode: string = '';
  displayedData: any[] = [];
  useDetails: any[] = [];

  private destroy$ = new Subject<void>();
  constructor(
    private apiService: ApiServiceService,
    private storage: Storage,
    private router: Router,
    private sqliteService: SqliteService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.getOrganization();
    
  }

  async getOrganization() {
    try {
      const query = 'SELECT * FROM Organizations';
      const data = await this.sqliteService.getDataFromTable(query);

      console.log('sql', data);

      this.userData = data;

      this.displayedData = [...this.userData];
    } catch (error) {
      console.log(error);
    }
  }

  getFormattedName(name: string): string {
    const cleanedName = name.replace(/_/g, ' ');
    const words = cleanedName.split(' ');
    const firstLetters = words
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
    return `${firstLetters}`;
  }

  async selectOrganization(orgName: string, orgCOde: string): Promise<void> {
    if (this.selectedOrganization === orgName) {
      this.selectedOrganization = '';
    } else {
      this.selectedOrganization = orgName;
      this.OrganizationCode = orgCOde;
    }
    await this.storage.set('selectedOrganization', this.selectedOrganization);
    await this.storage.set('organizationCode', this.OrganizationCode);
    localStorage.setItem('organizationCode', this.OrganizationCode);
    localStorage.setItem('selectedOrganization', this.selectedOrganization);
  }

  isSelected(orgName: string): boolean {
    return this.selectedOrganization === orgName;
  }


  onSearchResults(results: any[]) {
    console.log('Search Results Received:', results); // Debugging line
    this.displayedData = results.length > 0 ? results : [...this.userData];
  }
  async confirmOrg(): Promise<void> {
    await this.getUserResponsibilities();
    this.router.navigate(['/activity']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async getUserResponsibilities(): Promise<string[]> {
    const finalResponsibilitiesList = this.addAdditionalResponsibilities();

    await this.storage.set('responsibility', finalResponsibilitiesList);

    return finalResponsibilitiesList;
  }

  private addAdditionalResponsibilities(): string[] {
    const additionalResponsibilities = [
      // masters

      'getEmployees',
      'getoperatingunits',
      'getItemInstances',
      'getItemInstanceStatuses',
      'getItemInstanceAssets',
      'getSubinventories',
      'getLocators',
      'getDocForReceiving',
      'getRestrictedSubInventories',
      'getRestrictedLocators',
      'getOnHandQuantities',
      'getUnitOfMeasuresConversions',
      'getItemRevisions',
      'getOnHandTableType',
      'getlocatorswithsegments',
      'getPaginationsBatch',
      // CONFIG-API's

      'getGLPeriods',
      'getlpnsforpack',
      'getLPNsForUnPack',
      'getLPNsForSubInventoryTransfer',
      'getlpnsforwipcompletion',
      'getLPNsForPutAway',
      'getLots',
      'getAccountAliases',
      'getReturnSerialTransactions',
      'getSerialDetails',
      'getSerialTransactions',

      // TRANSACTIONAL-API'S

      'getSalesOrdersForPicking',
      'getSalesOrdersForShipping',
      'getLpnforSOPack',
      'getShippingMethods',
      'getPurchaseOrdersForReceiving',
      'getPurchaseOrdersForInspection',
      'getPurchaseOrdersForReturning',
      'getPutAwayTasks',
      'getPurchaseRequisitions',
      'getReceiptsForCorrection',
      'getVendorReceiptNumbers',
      'getPurchasingPeriods',
      'getMoveOrders',
      'getCycleCountItems',
      'getPhysicalCountItems',
      'getAllWMSTasks',
      'getPhysicalCountDefinitions',
      'getCycleCountSubinventories',
      'getItemCrossReferences',
      'getWorkOrdersForCompletion',
      'getWorkOrdersForMoveAndCompletion',
      'getWorkOrdersForAssemblyMove',
      'getWorkOrdersOperations',
    ];

    return Array.from(new Set([...additionalResponsibilities]));
  }
}
