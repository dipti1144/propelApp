import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiServiceService } from '../../Service/api-service.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { SqliteService } from 'src/app/Service/sqlite.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NetworkService } from 'src/app/Service/network.service';
import { Subscription } from 'rxjs';

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
  private networkStatusSubscription!: Subscription;
  constructor(
    private apiService: ApiServiceService,
    private storage: Storage,
    private router: Router,
    private sqliteService: SqliteService,
    private networkService: NetworkService
  ) {}

  async ngOnInit() {
    await this.storage.create();

    this.getOrganizationFromDb();

    console.log(this.displayedData);
  }

  // Fetch data from API if online
  async getOrganizationFromApi() {
    const apiUrl =
      'https://testnode.propelapps.com/EBS/20D/getInventoryOrganizations/7923';
    const metaData =
      'https://testnode.propelapps.com/EBS/20D/getInventoryOrganizations/metadata';

    try {
      this.apiService
        .getOrganizationApi(metaData)
        .subscribe(async (resp: any) => {
          const data = resp;

          await this.sqliteService.createTableFromMetadata(
            'Organizations',
            data
          );
        });

      this.apiService.getAll(apiUrl).subscribe(async (apiData: any) => {
        const inventories = apiData?.ActiveInventories;

        this.userData = inventories;
        this.displayedData = [...this.userData];

        if (inventories && inventories.length > 0) {
          const db = await this.sqliteService.getDb();

          if (db) {
            const insertSuccess = await this.sqliteService.insertToTable(
              'Organizations',
              inventories,
              db
            );

            if (insertSuccess) {
              console.log('Data inserted successfully');
            } else {
              console.error('Data insertion failed');
            }
          } else {
            console.error('Database object is not available');
          }
        } else {
          console.warn('No inventories to insert');
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch data from SQLite DB if offline
  async getOrganizationFromDb() {
    try {
      const query = 'SELECT * FROM Organizations';
      const data = await this.sqliteService.getDataFromTable(query);

      this.userData = data;

      this.displayedData = [...this.userData];
    } catch (error) {
      console.log(error);
    }
  }

  // Handle pull-down-to-refresh
  async refreshOrganizations(event: any) {
    const isOnline = await this.networkService.checkNetworkStatus();

    if (isOnline) {
      await this.getOrganizationFromApi(); // Refresh from API if online
    } else {
      await this.getOrganizationFromDb(); // Refresh from DB if offline
    }

    event.target.complete();
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
    const details = this.displayedData.find(
      (org) => org.InventoryOrgId === orgName
    );
    await this.storage.set('orgDetails', details);

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
    if (results.length > 0) {
      this.displayedData = results;
    } else {
      console.log('Resetting to full userData:', this.userData);
      this.displayedData = [...this.userData]; // Reset to full list if search is cleared
    }
  }
  async confirmOrg(): Promise<void> {
    await this.getUserResponsibilities();
    this.router.navigate(['/activity']);
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
      'getSubinventories',
      'getoperatingunits',
      'getItemInstances',
      'getItemInstanceStatuses',
      'getItemInstanceAssets',

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
      'getSerial',
      'getLot',
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

    return additionalResponsibilities
  }

  ngOnDestroy() {
    // Unsubscribe from network status updates to avoid memory leaks
    if (this.networkStatusSubscription) {
      this.networkStatusSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
