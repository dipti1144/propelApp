import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { firstValueFrom, map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  private db: SQLiteObject | null = null;
  private dbConfig = {
    name: 'propel.db',
    location: 'default'
  };

  constructor(
    private sqlite: SQLite,
  ) {}

  async openDB(): Promise<void> {
    try {
      if (!this.db) {
        this.db = await this.sqlite.create(this.dbConfig);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('Unexpected error', error);
      }
    }
  }

  async getDb(): Promise<SQLiteObject | null> {
    if (this.db) {
      return this.db;
    }
    await this.openDB();
    return this.db;
  }

  async resetDB(): Promise<void> {
    try {
      if (this.db) {
        await this.sqlite.deleteDatabase(this.dbConfig);
        this.db = null;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('Unexpected error', error);
      }
    }
  }


  async getDataFromTable(query: string, params: any[] = []): Promise<any[]> {
    return firstValueFrom((await this.executeQuery(query, params)).pipe(map(this.extractData)));
  }

  async fetchItemsByQuery(uniqueId: string, tableName:string): Promise<any[]> {
    const query = `SELECT * FROM ${tableName} WHERE PoNumber = ?`; // Adjust table name
    return this.getDataFromTable(query, [uniqueId]);
  }

  async checkTableExist(tableName: string): Promise<any[]> {
    const query = 'SELECT name FROM sqlite_master WHERE type = ? AND name = ?';
    const params = ['table', tableName];

    return this.getDataFromTable(query, params);
  }


  extractData(result:any) : any[] {
    const list = [];
    for (let i = 0; i < result.rows.length; i++) {
      list.push(result.rows.item(i));
    }
    return list;
  }
 

  async executeQuery(query: string, param: any[]): Promise<Observable<unknown>> {
    await this.openDB();
  
    return new Observable((observer) => {
      if (!this.db) {  // Check if db is null or undefined
        const error = new Error('Database connection is not available.');
        console.error({ error, query, param });
        observer.error(error);
        observer.complete();
        return;
      }
  
      this.db.executeSql(query, param).then((data) => {
        console.log('Query executed successfully', { query, param, data });
        observer.next(data);
        observer.complete();
      }).catch((err) => {
        console.error({ err, query, param });
        observer.error(err);
        observer.complete();
      });
    });
  }


  private ifRecordExists(records:any) {
    const objValues = Object.values(records);
    return objValues[0] == 0 ? false : true;
  }


  async checkIfRecordInTableExist(tableName: string): Promise<boolean> {
    // In SQLite, you cannot use parameter binding (?) for table names or column names, only for values.
    const query = `SELECT EXISTS(SELECT 1 FROM ${tableName})`;

    const data: any = await this.getDataFromTable(query, []);
    const ifRecordExist = data && data.length > 0 ? this.ifRecordExists(data[0]) : false;

    return ifRecordExist;
  }
  


  async createTableFromMetadata(tableName: string, metadataList: any): Promise<any> {
    if (!this.db) this.db = this.db; 

   
    if (!this.db) {
      console.error('Database object is not available.');
      return false;
    }
    try {
      const db: SQLiteObject = await this.sqlite.create({ name: 'propel.db', location: 'default' });
      await db.transaction(async (tx) => {
          let createQuery = "CREATE TABLE IF NOT EXISTS " + tableName + "(";
        let primaryKeyQuery = "PRIMARY KEY (";
        let isPrimaryKeyAvailable = false;
        const propertyArray = metadataList.filter((v:any, i:any, a:any) => a.findIndex((t:any) => (t.name === v.name)) === i);
        
        for (let i = 0; i < propertyArray.length; i++) {
          const field = propertyArray[i];
          let type = field.type;
          if (type.toLowerCase() === "number") {
            
            type = "INTEGER";
          } else if (type.toLowerCase() === "string") {
            type = "TEXT";
          } else {
            type = "TEXT";
          }
          createQuery = createQuery + field.name + " " + type; 
          if (field.primarykey || field.primaryKey) {
            isPrimaryKeyAvailable = true;
            primaryKeyQuery = primaryKeyQuery + field.name;
            if (i !== propertyArray.length - 1) {
              primaryKeyQuery = primaryKeyQuery + ",";
            }
          }
          if (i !== propertyArray.length - 1) {
            createQuery = createQuery + ",";
          }
        }

        
        primaryKeyQuery = primaryKeyQuery.replace(/.$/, "");
       
        primaryKeyQuery = primaryKeyQuery + ")";
       
        if (isPrimaryKeyAvailable) {
          createQuery = createQuery + "," + primaryKeyQuery;
        }
        
        createQuery = createQuery + ")";

        console.log("Create Table Query:", createQuery);

        await tx.executeSql(createQuery, []);
        
      });

      return db;
    } catch (error) {
      if (error instanceof Error) {
        console.error({ msg: error.message, tableName, metadataList });

      }
    }
  }


  async insertToTable(tableName: string, itemsList: any[], db?: SQLiteObject): Promise<boolean> {
    if (!this.db) this.db = this.db; 

    
    if (!db) {
      console.error('Database object is not available.');
      return false;
    }
  
  
    try {
      for (const rowObject of itemsList) {
        const dataList: any[] = Object.values(rowObject); // Extract the values directly
        let tableInsertion: string = 'INSERT OR REPLACE INTO ' + tableName + ' VALUES(';
  
        const columnCreation: string = dataList.map(() => '?').join(',');
        tableInsertion += columnCreation + ')';
  
        await db.executeSql(tableInsertion, dataList); // Execute the SQL statement
        const result = await db.executeSql(tableInsertion, dataList);
        if (result.rowsAffected > 0) {
          console.log('Data inserted successfully into', tableName);
        } else {
          console.warn('No rows affected during insertion into', tableName);
        }
      }
  
      return true; // Return true after all data is inserted successfully
    } catch (error) {
      if (error instanceof Error) {
        console.error({ msg: error.message, tableName, itemsList });
      } else {
        console.error({ msg: 'An unknown error occurred', tableName, itemsList });
      }
      return false;
    }
  }

 

  
}
