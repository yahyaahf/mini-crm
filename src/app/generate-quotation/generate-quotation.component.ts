import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-generate-quotation',
  templateUrl: './generate-quotation.component.html',
  styleUrls: ['./generate-quotation.component.css']
})
export class GenerateQuotationComponent implements OnInit {
  quotation = {
    dateExpiration: '',
    description: '',
    quantity: '',
    products: '',
    quantities:''
    
  };
  isQuotationAdded = false;
  clients: any[] = [];  
  selectedClient: number | null = null;  
  expirationDate: Date | null = null;
  description: string = '';
  quantity: string = '';
  selectedProducts: { product: any, quantity: number}[] = []; 
  productQuantities: { product: any, quantity: number , selected: boolean}[] = [];

  constructor(private http : HttpClient,private router: Router, private route: ActivatedRoute) {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    this.quotation.dateExpiration = nextMonth.toISOString().slice(0, 10); 
   }
  ngOnInit() {
    this.http.get<any>('http://127.0.0.1:8080/api/clients').subscribe(
      (data: any[]) => {
        this.clients = data;
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );
    

    this.http.get<any>('http://127.0.0.1:8080/api/products').subscribe(
      (data) => {
        this.productQuantities = data.map((product: any) => ({
          product: product,
          quantity: 1,
          selected: false
        }));
        

      },
      (error) => {
        console.error('Error fetching client:', error);
      }
    );


  }

  onSubmit() {
    this.selectedProducts.map((item) => {
      
      if (this.quotation.products === '') { 
        this.quotation.products = '' + item.product;
      } else { 
        this.quotation.products = this.quotation.products + ',' + item.product;
      }
  
      if (this.quotation.quantities === '') { 
        this.quotation.quantities = '' + item.quantity;
      } else { 
        this.quotation.quantities = this.quotation.quantities + ',' + item.quantity;
      }
    });
    console.log(this.quotation.products+' '+this.quotation.quantities);
    this.http.post<any>('http://localhost:8080/api/quotations/add/'+this.selectedClient, this.quotation).subscribe(
      response => {
        console.log('Quotation added successfully:', response);
        this.isQuotationAdded = true;
        
        setTimeout(() => {
          this.isQuotationAdded = false;
          this.router.navigateByUrl('/quotations');
        }, 3000);
        
        
      },
      error => {
        console.error('Error adding client:', error);
        
      }
    );
    this.clearForm();
  }

  clearForm() {
    this.selectedClient = null;
    this.expirationDate = null;
    this.description = '';
    this.selectedProducts = [];
  }
  
  addSelectedProducts() {
    this.selectedProducts = this.productQuantities
    .filter(item => item.selected)
    .map(item => ({ product: item.product.id, quantity: item.quantity }));
  console.log(this.selectedProducts);
  
}
}