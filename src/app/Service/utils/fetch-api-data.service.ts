import { EventEmitter, Injectable } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { SqliteService } from '../sqlite.service';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatePipe } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { Storage } from '@ionic/storage';
import { MasterserviceService } from '../masterService/masterservice.service';
import { transition } from '@angular/animations';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  public countUpdate: EventEmitter<{ length: number, countName: string }> = new EventEmitter();
  constructor(
    private apiService: ApiServiceService,
    private sqliteService: SqliteService,
    private datePipe: DatePipe,
    private storage: Storage,
    private masterServie:MasterserviceService
  ) {}

  async retrieveDataFromApi(listUrl: string, metadataUrl: string | null, tableName: string, isDeltaSync: boolean, responsibility?:any): Promise<any> {
    try {
      isDeltaSync = await this.checkIfTableExist(tableName, isDeltaSync);
  
      let db: SQLiteObject | null = null;
      const callMetadata = !isDeltaSync && metadataUrl;
  
      if (callMetadata) {
        db = await this.getMetadataAndCreateTable(metadataUrl, tableName);
      } else {
        db = await this.sqliteService.getDb();
      }
       
      console.log('Database object:', db); 
      if (db) {
      return await this.getListDataAndInsert(listUrl, db, tableName, isDeltaSync,responsibility);
      } else {
        throw new Error('Failed to get database object');
      }
    } catch (error) {
      console.error(error);
    }
  }
  

  private async getListDataAndInsert(listUrl: string, db: SQLiteObject, tableName: string, isDeltaSync: boolean,responsibility:any): Promise<any> {
    try {
      const apiResponse = await lastValueFrom(this.apiService.getAll(listUrl));
      const lastSyncDate = this.getCurrentServerDate();
      this.setLastSyncDate(tableName, lastSyncDate);
  
      await this.insertDataIntoTables(tableName, db, apiResponse, responsibility);
      return { status: true, responsibility: responsibility };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return { status: false, msg: error.message };
      } else {
        console.error('An unknown error occurred');
        return { status: false, msg: 'An unknown error occurred' };
      }
    }
  }

  async insertDataIntoTables(
    tableName: string,
    db: SQLiteObject,
    data: any,
    responsibility:any
  ): Promise<void> {
    let dataArray: any[] = [];

    switch (tableName) {
      case 'getEmployees': 
        dataArray = data?.items || data?.EmployeeList;
        await this.masterServie.GetInserted(db, dataArray,tableName);
        break;
        case 'getDocForReceiving': 
        dataArray = data?.items || data?.Docs4Receiving;
        await this.masterServie.GetInserted(db, dataArray,tableName);
        break;

        case "getoperatingunits":
          dataArray = data?.items || data?.ActiveOperatingUnits;
          await this.masterServie.GetInserted(db, dataArray,tableName);
        break;

        case "getItemInstances":
          dataArray = data?.items || data?.ActiveOperatingUnits;
          await this.masterServie.GetInserted(db, dataArray,tableName);
        break;
        case "getItemInstanceStatuses":
          dataArray = data?.items || data?.Items;
          await this.masterServie.GetInserted(db, dataArray,tableName);
        break;
         case "getGLPeriods":
          dataArray = data?.items || data?.GLPeriods;
          await this.masterServie.GetInserted(db, dataArray,tableName);
        break;
       case "getLpnforSOPack":
          dataArray = data?.items || data?.Response;
          await this.masterServie.GetInserted(db, dataArray,tableName);
        break; 
       case "getSubinventories":
        dataArray=data?.items || data?.ActiveSubInventories;
        await this.masterServie.GetInserted(db,dataArray,tableName)
        break;
        case "getLocators":
         dataArray=data?.items || data?.ActiveLocators;
         await this.masterServie.GetInserted(db,dataArray,tableName)
         break;
         case "getSerial":
         dataArray=data?.items || data?.ActiveSerials;
         await this.masterServie.GetInserted(db,dataArray,tableName)
         break;
         
      default:
        // console.error(tableName);
        return;
    }

    if (dataArray) {
      this.setCountOfLoadedItems(dataArray.length,responsibility);
    }
  }

  private async getMetadataAndCreateTable(
    metadataUrl: string,
    tableName: string
  ): Promise<SQLiteObject> {
    try {
      const metadata = await this.apiService.getAll<any>(metadataUrl).toPromise();
      const db: SQLiteObject = await this.sqliteService.createTableFromMetadata(tableName, metadata);
      return db;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get metadata and create table');
    }
  }

  async checkIfTableExist(tableName: string, isDeltaSync: boolean): Promise<boolean> {
    const data = await this.sqliteService.checkTableExist(tableName);
    let ifRecordExist = true;

    if (data?.length) {
      ifRecordExist = await this.sqliteService.checkIfRecordInTableExist(tableName);
    }

    if (((data && data.length === 0) || !ifRecordExist) && isDeltaSync) {
      return false;
    } else if (data?.length && ifRecordExist && !isDeltaSync) {
      return true;
    } else {
      return isDeltaSync;
    }
  }

  getCurrentServerDate(): any {
    const offsetTime = '-06:00';
    const adjustedServerTime = new Date().getTime() - 15000; // Adjust for offset
    const currentServerDate = new Date(adjustedServerTime).toUTCString();
    const serverTime = this.datePipe.transform(currentServerDate, 'MM-dd-yyyy', 'UTC ' + offsetTime);
    // console.log(serverTime, 'server..');
    return serverTime;
  }

  async setLastSyncDate(tableName: string, lastSyncDate?: string): Promise<void> {
    lastSyncDate = lastSyncDate || this.getCurrentServerDate();
    await this.storage.set("LAST_SYNC" + tableName, lastSyncDate);
  }

  async setCountOfLoadedItems(length: number, countName: string): Promise<void> {
    this.countUpdate.emit({ length, countName });
  }
}
