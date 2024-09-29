import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiServiceService } from '../../Service/api-service.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { SqliteService } from 'src/app/Service/sqlite.service';

interface ResponseData {
  STATUS: number;
  RESPONSIBILITY: string;
  // Add other properties here as needed
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnDestroy {
  loginForm: FormGroup;
  private destroy$ = new Subject<void>(); // Subject to trigger unsubscription
  userData: any[] = [];
  orgId:any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiServiceService,
    private router: Router,
    private storage: Storage, // Inject Ionic Storage
    private loader: LoadingController,
    private sqliteService: SqliteService
  ) {
    this.loginForm = this.fb.group({
      username: ['kiran r', [Validators.required]],
      password: ['Propel@123', [Validators.required]],
    });

    this.initStorage();
  }

  async initStorage() {
    await this.storage.create(); // Initialize the storage
  }

  async onLogin() {
    const { username, password } = this.loginForm.value;

    if (this.loginForm.invalid) {
      if (!username && !password) {
        await this.apiService.presentToast(
          'Please enter username and password.',
          'danger'
        );
        return;
      } else if (!username) {
        this.apiService.presentToast('Please enter username', 'danger');
        return;
      } else if (!password) {
        this.apiService.presentToast('Please enter password', 'danger');
        return;
      }
    }

    // Show loader
    const loading = await this.loader.create({
      message: 'Please wait...',
    });

    await loading.present();

    if (this.loginForm.valid) {
      this.apiService
        .login(username, password)
        .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe on destroy
        .subscribe(
          async (res) => {
            await loading.dismiss();
            if (res.data[0].STATUS == 1) {

              const responsibilities = res.data.map(
                (item: ResponseData) => item.RESPONSIBILITY
              );

              // Store the RESPONSIBILITY in Ionic Storage
              this.orgId=res.data[0].DEFAULT_ORG_ID
              await this.storage.set('RESPONSIBILITY', responsibilities);

              await this.apiService.saveUserData(res.data);
              await this.apiService.presentToast('Login Successful', 'success');

              // organiztion id
              const orgIds = res.data
                .map((item: any) => item.DEFAULT_ORG_ID)
                .filter((id: string) => id !== '' && id !== null);

              console.log(orgIds);

              this.getOrganization();

              this.router.navigate(['/organization']);
              this.loginForm.reset();
            } else if (res.data[0].STATUS == 0) {
              await this.apiService.presentToast(res.data[0].ERROR, 'danger');
            }
          },
          async (error) => {
            await loading.dismiss();
            await this.apiService.presentToast(
              'Login failed: An error occurred',
              'danger'
            );
          }
        );
    }
  }

  async getOrganization() {
    const apiUrl =
      `https://testnode.propelapps.com/EBS/20D/getInventoryOrganizations/${this.orgId}`;
    const metaData =
      'https://testnode.propelapps.com/EBS/20D/getInventoryOrganizations/metadata';

    try {
      this.apiService
        .getOrganizationApi(metaData)
        .subscribe(async (resp: any) => {
          const data = resp;
          console.log(data);

          await this.sqliteService.createTableFromMetadata(
            'Organizations',
            data
          );
        });

      this.apiService.getAll(apiUrl).subscribe(async (apiData: any) => {
        const inventories = apiData?.ActiveInventories;

        if (inventories && inventories.length > 0) {
          console.log('Active Inventories:', inventories);

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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
