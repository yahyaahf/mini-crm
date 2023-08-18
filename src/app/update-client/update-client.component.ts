import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router , ActivatedRoute  } from '@angular/router';


@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.css']
})
export class UpdateClientComponent {
  
  client: any;
  isClientUpdated = false;
  constructor(private http :HttpClient, private router:Router, private route: ActivatedRoute ) {}
  

  ngOnInit() {
    
    this.http.get<any>('http://127.0.0.1:8080/api/clients/' + this.route.snapshot.paramMap.get('id')).subscribe(
      (data) => {
        this.client = data;
      },
      (error) => {
        console.error('Error fetching client:', error);
      }
    );
    
  }

  updateClient(){
    this.http
      .put<any>('http://127.0.0.1:8080/api/clients/update/' + this.route.snapshot.paramMap.get('id'), this.client)
      .subscribe(
        (response) => {
          console.log('Client updated successfully:', response);
          this.isClientUpdated = true;
          setTimeout(() => {
            this.isClientUpdated = false;
            this.router.navigateByUrl('');
          }, 5000);
        },
        (error) => {
          console.error('Error updating client:', error);
        }
      );
    
  }

}
