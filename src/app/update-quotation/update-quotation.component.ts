import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-quotation',
  templateUrl: './update-quotation.component.html',
  styleUrls: ['./update-quotation.component.css']
})
export class UpdateQuotationComponent {
  products: any[] = [];
  clients: any[] = [];
  selectedClient: number | null = null;
  quotation: any;
  isQuotationUpdated = false;
  
  
  constructor(private http :HttpClient, private router:Router, private route: ActivatedRoute) {}

  ngOnInit() {
    
    this.http.get<any>('http://127.0.0.1:8080/api/quotations/' + this.route.snapshot.paramMap.get('id')).subscribe(
      (data) => {
        this.quotation = data;
      },
      (error) => {
        console.error('Error fetching client:', error);
      }
    );
    this.http.get<any>('http://127.0.0.1:8080/api/clients').subscribe(
      (data: any[]) => {
        this.clients = data;
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );

  }
  
  updateQuotation(){
    this.http
      .put<any>('http://127.0.0.1:8080/api/quotations/update/' + this.route.snapshot.paramMap.get('id'), this.quotation)
      .subscribe(
        (response) => {
          console.log('Quotation updated successfully:', response);
          this.isQuotationUpdated = true;
          setTimeout(() => {
            this.isQuotationUpdated = false;
            this.router.navigateByUrl('/products');
          }, 3000);
        },
        (error) => {
          console.error('Error updating client:', error);
        }
      );
    
  }

 

}
