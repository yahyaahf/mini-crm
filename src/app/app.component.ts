import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
[x: string]: any;
  clients: any[] = [];
  selectedClient: any;
  showedFormatAdd: Boolean = false;
  showedFormatUpdate: Boolean = false;
  showedTable: Boolean = true;
  

  constructor(private http :HttpClient,private router: Router) {}
  
  navigateToAddClient() {
    this.selectedClient=false;
    this.showedFormatAdd=true;
    this.router.navigate(['/add-client']);
  }

  ngOnInit() {
    this.getClients();
  }

  getClients() {
    this.selectedClient=false;
    this.showedTable=true;
    this.http.get<any>('http://127.0.0.1:8080/api/clients').subscribe(
      (data: any[]) => {
        this.clients = data;
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );
    this.router.navigate(['']);
  }

  onSelect(client: any) {
    this.selectedClient = client;
  }

  navigateToUpdateClient() {
    if (this.selectedClient) {
      this.router.navigate(['/update-client', this.selectedClient.id]);
    }
  }
  navigateToProducts() {
    this.selectedClient=false;
    this.showedTable=false;
    this.router.navigateByUrl('/products');
  }

  navigateToQuotations() {
    this.selectedClient=false;
    this.showedTable=false;
    this.router.navigateByUrl('/quotations');
  }
  navigateToPurchaseOrders() {
    this.selectedClient=false;
    this.showedTable=false;
    this.router.navigateByUrl('/purchaseOrders');
  }

  
  navigateToInvoices() {
    this.selectedClient=false;
    this.showedTable=false;
    this.router.navigateByUrl('/invoices');
  }


}

