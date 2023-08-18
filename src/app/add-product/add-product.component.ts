import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  product = {
    intitule: '',
    categorie: '',
    description: '',
    prix:0
    
    
  };
  isProductAdded = false;

  constructor(private http: HttpClient, private router: Router) { }

  addProduct() {
    this.http.post<any>('http://localhost:8080/api/products/add', this.product).subscribe(
      response => {
        console.log('Client added successfully:', response);
        this.isProductAdded = true;
        console.log(this.isProductAdded); 
        setTimeout(() => {
          this.isProductAdded = false;
          this.router.navigateByUrl('/products');
        }, 3000);
        
        
      },
      error => {
        console.error('Error adding client:', error);
        
      }
    );
  }

}
