import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  organizationCode:string | null=null;
  constructor(
   private storage: Storage,
   private router:Router
  ) { }

  ngOnInit() {
    this.getOrgCOde()
    

  }
   
  public async getOrgCOde(){
    const storedOrgCode = await this.storage.get('organizationCode');
    console.log(storedOrgCode)
    if(storedOrgCode){
      this.organizationCode=storedOrgCode
    }
  }

  public goodAndReceipt(){
    this.router.navigate(['/list']);
  }

  

}
