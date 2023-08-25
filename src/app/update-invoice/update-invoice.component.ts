import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-invoice',
  templateUrl: './update-invoice.component.html',
  styleUrls: ['./update-invoice.component.css']
})
export class UpdateInvoiceComponent {
  products: any[] = [];
  statuts: any[] = ["validé","payé","envoyé"];
  selectedStatut: String = "";
  invoice: any;
  isInvoiceUpdated = false;
  
  
  constructor(private http :HttpClient, private router:Router, private route: ActivatedRoute) {}

  ngOnInit() {
    
    this.http.get<any>('http://127.0.0.1:8080/api/invoices/' + this.route.snapshot.paramMap.get('id')).subscribe(
      (data) => {
        this.invoice = data;
      },
      (error) => {
        console.error('Error fetching client:', error);
      }
    );
    

  }
  
  updateInvoice(){
    this.invoice.statut=this.selectedStatut;
    if(this.selectedStatut === "payé" ){
        this.invoice.montantPayé=this.invoice.montantTotal;
    }else if(this.selectedStatut === "envoyé"){
      this.invoice.montantPayé=0;
    }
    this.http
      .put<any>('http://127.0.0.1:8080/api/invoices/update/' + this.route.snapshot.paramMap.get('id'), this.invoice)
      .subscribe(
        (response) => {
          console.log('Quotation updated successfully:', response);
          this.isInvoiceUpdated = true;
          setTimeout(() => {
            this.isInvoiceUpdated = false;
            this.router.navigateByUrl('/products');
          }, 3000);
        },
        (error) => {
          console.error('Error updating client:', error);
        }
      );
    
  }

 

}
