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

  async fetchItemsByQueryItemNumber(uniqueId: string, tableName:string): Promise<any[]> {
    const query = `SELECT * FROM ${tableName} WHERE ItemNumber = ?`; // Adjust table name
    return this.getDataFromTable(query, [uniqueId]);
  }

  async executeQueryData(query:string, data:any=[]):Promise<any>{
    const result=await this.db?.executeSql(query,data)
    return result
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
  
// Create Table ********************* 

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
          
          // Handle primary key
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
  

  // InsertData into table ************************

  async insertToTable(tableName: string, itemsList: any[], db?: SQLiteObject): Promise<boolean> {
    if (!this.db) this.db = this.db; 

    
    if (!db) {
      console.error('Database object is not available.');
      return false;
    }
  
  
    try {
      for (const rowObject of itemsList) {
        const dataList: any[] = Object.values(rowObject); 
        let tableInsertion: string = 'INSERT OR REPLACE INTO ' + tableName + ' VALUES(';
  
        const columnCreation: string = dataList.map(() => '?').join(',');
        tableInsertion += columnCreation + ')';
  
        await db.executeSql(tableInsertion, dataList); 
        const result = await db.executeSql(tableInsertion, dataList);
        if (result.rowsAffected > 0) {
          // console.log('Data inserted successfully into', tableName);
        } else {
          console.warn('No rows affected during insertion into', tableName);
        }
      }
  
      return true; 
    } catch (error) {
      if (error instanceof Error) {
        console.error({ msg: error.message, tableName, itemsList });
      } else {
        console.error({ msg: 'An unknown error occurred', tableName, itemsList });
      }
      return false;
    }
  }


  // clear database **************************

  async clearDatabase(): Promise<boolean> {
    try {
      const db: SQLiteObject = await this.sqlite.create({
        name: 'propel.db',
        location: 'default'
      });
  
      const tables =  [
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
      ]; // Add all your table names here
  
      for (const table of tables) {
        const dropTableQuery = `DROP TABLE IF EXISTS ${table}`;
        console.log(table)
        await db.executeSql(dropTableQuery, []);
      }
  
      console.log('All tables dropped successfully');
      return true;
    } catch (error) {
      console.error('Error while dropping tables:', error);
      return false;
    }
  }


  // Transaction Histoty dataBase

  async createTable(query: string, tableName: string) {
    return this.db?.executeSql(query, [])
  }

  async createTransactionHistoryTable(tableName: string) {
    let query = `CREATE TABLE IF NOT EXISTS ${tableName} (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
      poNumber TEXT,
      titleName TEXT,
      createdTime DATETIME,
      quantityReceived INTEGER,
      error TEXT,
      status TEXT,
      shipLaneNum TEXT,
      vendorId TEXT,
      unitOfMeasure TEXT,
      poHeaderId TEXT,
      poLineLocationId TEXT,
      poLineId TEXT,
      poDistributionId TEXT,
      destinationTypeCode TEXT,
      itemNumber TEXT,
      Subinventory TEXT,
      Locator TEXT,
      ShipmentNumber TEXT,
      LpnNumber TEXT,
      OrderLineId TEXT,
      SoldtoLegalEntity TEXT,
      SecondaryUnitOfMeasure TEXT,
      ShipmentHeaderId TEXT,
      ItemRevision TEXT,
      ReceiptSourceCode TEXT,
      MobileTransactionId TEXT,
      TransactionType TEXT,
      AutoTransactCode TEXT,
      OrganizationCode TEXT,
      serialNumbers TEXT,
      lotQuantity TEXT,
      lotCode TEXT,
      userId TEXT,
      employeeId TEXT,
      bussinessUnitId TEXT,
      inventoryOrgId TEXT
      )`

    await this.createTable(query, tableName);
  }

  async insertData(query: string, data: any) {

    try {
      if (!this.db) this.db = this.db; 
      const res = await this.db?.executeSql(query, data);
      if (res) {
        console.log('Insert successful:', res);
        console.log('Rows affected:', res.rowsAffected);
        console.log('Insert ID:', res.insertId); 
      } else {
        console.error('Insert resulted in undefined response');
      }
      return res;
    } catch (error) {
      console.error('Error inserting data:', error); // Enhanced error logging
      throw error;
    }
  }

  insertTransaction(item: any, tableName: string) {
    const query = `INSERT INTO ${tableName} (poNumber, titleName, createdTime, quantityReceived,error,status,shipLaneNum,
    vendorId,unitOfMeasure,poHeaderId,poLineLocationId,poLineId,poDistributionId,destinationTypeCode,itemNumber,Subinventory,Locator,
    ShipmentNumber,LpnNumber,OrderLineId,SoldtoLegalEntity,SecondaryUnitOfMeasure,ShipmentHeaderId,ItemRevision,ReceiptSourceCode,MobileTransactionId,TransactionType ,
    AutoTransactCode,
    OrganizationCode,serialNumbers,lotQuantity,lotCode)
    VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;
  const data = [
    item.poNumber,
    item.titleName,
    item.createdTime.toISOString(),
    item.quantityReceived,
    item.error,
    item.status,
    item.shipLaneNum,
    item.vendorId,
    item.unitOfMeasure,
    item.poHeaderId,
    item.poLineLocationId,
    item.poLineId,
    item.poDistributionId,
    item.destinationTypeCode,
    item.itemNumber,
    item.Subinventory,
    item.Locator,
    item.ShipmentNumber,
    item.LpnNumber,
    item.OrderLineId,
    item.SoldtoLegalEntity,
    item.SecondaryUnitOfMeasure,
    item.ShipmentHeaderId,
    item.ItemRevision,
    item.ReceiptSourceCode,
    item.MobileTransactionId,
    item.TransactionType,
    item.AutoTransactCode,
    item.OrganizationCode,
    item.serialNumbers,
    item.lotQuantity,
    item.lotCode
  ];
  
    console.log('Insert query:', query);
    console.log('Data to insert:', data);
    
    return this.insertData(query, data);
  }



  
  
  

 

  
}
