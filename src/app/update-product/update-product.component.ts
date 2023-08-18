import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent {
  product: any;
  isProductUpdated = false;
  constructor(private http :HttpClient, private router:Router, private route: ActivatedRoute) {}

  ngOnInit() {
    
    this.http.get<any>('http://127.0.0.1:8080/api/products/' + this.route.snapshot.paramMap.get('id')).subscribe(
      (data) => {
        this.product = data;
      },
      (error) => {
        console.error('Error fetching client:', error);
      }
    );
    
  }
  updateProduct(){
    this.http
      .put<any>('http://127.0.0.1:8080/api/products/update/' + this.route.snapshot.paramMap.get('id'), this.product)
      .subscribe(
        (response) => {
          console.log('Client updated successfully:', response);
          this.isProductUpdated = true;
          setTimeout(() => {
            this.isProductUpdated = false;
            this.router.navigateByUrl('/products');
          }, 3000);
        },
        (error) => {
          console.error('Error updating client:', error);
        }
      );
    
  }

}
