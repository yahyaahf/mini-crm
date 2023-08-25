import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  products: any[] = [];
  selectedProduct: any;
  

  constructor(private http :HttpClient,private router: Router) {}
  
  ngOnInit() {
    this.getProducts();
  }
  getProducts() {
    this.http.get<any>('http://127.0.0.1:8080/api/products').subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching client:', error);
      }
    );
  }

  onSelect(product: any) {
    this.selectedProduct = product;
  }

  navigateToUpdateProduct() {
    if (this.selectedProduct) {
      this.router.navigate(['/update-product', this.selectedProduct.id]);
    }
  }

  navigateToAddProduct() {
    this.selectedProduct=false;
    this.router.navigate(['/add-product']);
  }

  generateQuotation(productId: number) {
    this.router.navigateByUrl(`/generate-quotation/${productId}`);
  }

  deleteProduct() {
    this.http.delete<any>('http://127.0.0.1:8080/api/products/delete/' + this.selectedProduct.id).subscribe(
      (data) => {
        console.log("produit suprrimé avec succée " + data);
      },
      (error) => {
        console.error('Error deletting product:', error);
      }
    );
  }

}
