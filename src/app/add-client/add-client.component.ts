import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent {
  client = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    entreprise:'',
    
  };
  isClientAdded = false;
  
  
  constructor(private http: HttpClient, private router: Router) { }
  

  addClient() {
    
    this.http.post<any>('http://localhost:8080/api/clients/add', this.client).subscribe(
      response => {
        console.log('Client added successfully:', response);
        this.isClientAdded = true;
        console.log(this.isClientAdded); 
        setTimeout(() => {
          this.isClientAdded = false;
          this.router.navigateByUrl('');
        }, 3000);
        
        
      },
      error => {
        console.error('Error adding client:', error);
        
      }
    );
  }
}
