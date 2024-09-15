  import { Injectable } from '@angular/core';
  import { SqliteService } from '../sqlite.service';
  import { SQLiteObject } from '@ionic-native/sqlite';


  @Injectable({
    providedIn: 'root'
  })
  export class MasterserviceService {

    constructor(
      private sqlite:SqliteService,
      
    ) { }

    async GetInserted(db: SQLiteObject, dataArray: any[], tableName: string): Promise<void> {
      try {
        if (dataArray && dataArray.length > 0) {
          const isSuccess = await this.sqlite.insertToTable(tableName, dataArray, db);
          if (isSuccess) {
            console.log('Data inserted successfully into table:', tableName);
            await this.queryTable(db, tableName); // Query to verify the insertion
          } else {
            console.error('Failed to insert data into table:', tableName);
          }
        } else {
          console.warn('No data to insert for table:', tableName);
        }
      } catch (error) {
        console.error('Error inserting assets:', error);
      }
    }
  
    async queryTable(db: SQLiteObject, tableName: string): Promise<void> {
      try {
        const result = await db.executeSql(`SELECT * FROM ${tableName}`, []);
        if (result.rows.length > 0) {
          console.log(`Data found in ${tableName}:`, result.rows);
        } else {
          console.log(`No data found in ${tableName}`);
        }
      } catch (error) {
        console.error('Error querying table:', error);
      }
    }
  }
