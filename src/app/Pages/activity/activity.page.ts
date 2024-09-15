import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Subject, Subscription } from 'rxjs';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { SyncApiDataService } from 'src/app/Service/utils/sync-api-data.service';
import { ACTIVITY_CARDS } from './activity.constant';
import { FetchApiDataService } from 'src/app/Service/utils/fetch-api-data.service';
import { GlobalvariablesProvider } from 'src/app/constants/globalVariable';
// import _ from 'lodash';



@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {

  @ViewChild(IonContent) contentArea?: IonContent;


  selectedOrg: string | null = null;
  responsibility: any[] = [];
  loadingQueue = false;
  queueLoaded = false;
  isDisplayResp = false;
  activityCards = JSON.parse(JSON.stringify(ACTIVITY_CARDS));
  errorArray: any[] = [];
  refreshApis = new Subject();
  refreshApis$ = this.refreshApis.asObservable();
  loadingShowofflinedata = false;
  showOfflineData = false;
  finishedSync = false;

  loading: boolean = false; 
  status?: boolean; 
  module: string = ''; 
  count: number = 0;
  private countUpdateSubscription: Subscription;
  allTasksCompleted: boolean = false;

  constructor(private storage: Storage,
    private apiservice: ApiServiceService,
    private syncApiDataService: SyncApiDataService,
    private router: Router,
    private fetchApisDataService:FetchApiDataService,
    private globalVariablesProvider:GlobalvariablesProvider
  ) { 
    this.countUpdateSubscription = this.fetchApisDataService.countUpdate.subscribe(({ length, countName }) => {
      this.setCount(countName, length);
    });
  }

  async ngOnInit(): Promise<void> {

    
    this.isDisplayResp = true;
    const storedOrg = await this.storage.get('selectedOrganization');
    if (storedOrg) {
      this.selectedOrg = storedOrg;

      console.log('Selected Organization:', storedOrg);
    }
    const storageResponsibilities = await this.storage.get('responsibility');
    this.responsibility = storageResponsibilities;
    const syncResp = await this.executeSync(storageResponsibilities, false);
    this.checkForErrors(syncResp);
    this.loadResponsibilities();
  }

  setCount(resp: string, count: number): void {
    const indx = this.findIndexByResp(resp);
    if (indx > -1) this.activityCards[indx].count = count;
  }

  checkForErrors(syncData: any): void {
    if (this.errorArray.length === 0 ) {
      this.loadingShowofflinedata = true;
      this.showOfflineData = true;
      this.refreshApis.next(true);
      // this.globalVariablesProvider.setInitialLoadStatus(true);
      this.router.navigateByUrl('/dashboard');
    } else {
      this.finishedSync = true;
    }
  }

  async loadResponsibilities(): Promise<void> {
    const storageResponsibilities = await this.storage.get('responsibility');
    console.log('Stored Responsibility:', this.responsibility);
    this.responsibility = storageResponsibilities;
    await this.executeSync(storageResponsibilities, false)

  }

  async executeSync(retriveArray: string[], isDeltaSync: boolean): Promise<void> {
  
    this.globalVariablesProvider.setInitialLoadStatus(false);
    // Get all sync tasks based on responsibilities
    const tasks = this.syncApiDataService.getSyncAccordingToResp(isDeltaSync, retriveArray);
    
   
    for (let index = 0; index < tasks.length; index++) {
      const apiRequest = tasks[index];
      this.updateCurrentLoadingState(retriveArray, index); 
  
      try {
        const apiResponse = await apiRequest;
        this.handleSuccess(retriveArray, index, apiResponse); 
      } catch (error) {
        console.error(error);
        console.info('got error', new Date(), JSON.stringify(error, null, 2));
        this.handleError(retriveArray, index, error); 
      }
  
      this.updateNextLoadingState(retriveArray, index); 

      this.allTasksCompleted = true;
    }
  
    console.log("All tasks completed sequentially");
  }

  handleError(retriveArray: string[], index: number, error: any): void {
    const indx = this.findIndexByResp(retriveArray[index]);
    if (indx > -1) {
      this.activityCards[indx].isLoading = false;
      this.errorArray.push(error); // Store the error for further processing
    }
  }
  
  
  

  updateCurrentLoadingState(retriveArray: string[], index: number): void {
    if (retriveArray[index]) {
      this.setLoading(retriveArray[index]);
    }
  }
  setLoading(responsibility: string): void {
    const indx = this.findIndexByResp(responsibility);
    if (indx > -1) this.activityCards[indx].isLoading = true;
  }

  findIndexByResp(resp: string): number {
    return this.activityCards.findIndex((card:any) => card.responsibility === resp);
  }
  

  handleSuccess(retriveArray: string[], index: number, currentResult: any): void {
    this.updateStatus(currentResult, retriveArray, index, currentResult?.responsibility);
  }

  updateStatus(currentResult: any, retriveArray: string[], index: number, responsibility: string): void {
    const indx = this.findIndexByResp(responsibility);
    // console.log(responsibility)
    if (indx === -1) return;
    if (currentResult.status === true) {
      this.activityCards[indx].status = currentResult.status;
      
    } else {
      this.errorArray.push(currentResult);
      this.activityCards[indx].isLoading = false;
    }
    this.updateNextLoadingState(retriveArray, index);
    this.scrollToBottom();
  }

  updateNextLoadingState(retriveArray: string[], index: number): void {
    this.setLoading(retriveArray[index + 1]);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.contentArea) {
        this.contentArea.scrollToBottom();
    }
});
}
}
