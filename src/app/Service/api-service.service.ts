import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
 
  
  

  private RootApi="https://testnode.propelapps.com/EBS/20D"

  constructor( private http : HttpClient, private storage : Storage, private toast: ToastController) { 
    this.storage.create();
  }

  // ****************login*************//

  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http.post(`${this.RootApi}/login`, loginData);
  }


  async saveUserData(userData: any) {
    await this.storage.set('user_data', userData);
  }


 async getUserData() {
    return await this.storage.get('user_data');
  }

  async clearData() {
    await this.storage.remove('user_data');
  }

  async logout() {
    await this.storage.remove('auth_token');
  }
  //************* Toast*************//
  
  async presentToast(message: string, color: string = 'dark') {
    const toast = await this.toast.create({
      message: message,
      duration: 2000, 
      color: color,
      position: 'bottom'
    });
    toast.present();
  }


  getAll<T>(url: string): Observable<T> {
    console.log('url: ', url);
    const headers = {};

    return this.http.get<T>(url, { headers: headers });
}

getOrganizationApi(url:any): Observable<any[]> {
  return this.http.get<any[]>(url);
}
}
