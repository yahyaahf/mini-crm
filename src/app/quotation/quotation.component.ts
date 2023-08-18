import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css']
})


export class QuotationComponent implements OnInit {

  quotations: any[] = [];
  selectedQuotation: any;
  listProduit: any[] = [];
  productsDisplay : any[]=[];


  constructor(private http: HttpClient, private router: Router) {
    
  }

  ngOnInit() {
    this.getQuotations();
    
    
  }

  getQuotations() {
    this.http.get<any>('http://127.0.0.1:8080/api/quotations').subscribe(
      (data) => {
        this.quotations = data;
        this.quotations.map((q)=>{
           if (q.listProduit.length === 1) {
              console.log("option1");
              console.log(q.listProduit[0].intitule);
              this.productsDisplay.push(q.listProduit[0].intitule);
            } else {
              console.log("option2");
              this.productsDisplay.push(`${q.listProduit.length} produits`);
            }
          
          console.log(this.productsDisplay);
      });
      
      },
      (error) => {
        console.error('Error fetching client:', error);
      }
    );
  }

  onSelect(quotation: any) {
    this.selectedQuotation = quotation;
    this.http.get<any>('http://127.0.0.1:8080/api/products/quotation/' + this.selectedQuotation.id).subscribe(
      (data) => {
        this.listProduit = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
    
  }

  navigateToUpdateQuotation() {
    if (this.selectedQuotation) {
      this.router.navigate(['/update-quotation', this.selectedQuotation.id]);
    }
  }

  validatePurchaseOrder() {
    this.selectedQuotation.statut="validé";
    this.http
      .put<any>('http://127.0.0.1:8080/api/quotations/update/' + this.selectedQuotation.id, this.selectedQuotation)
      .subscribe(
        (response) => {
          console.log('quotation updated successfully:', response);
          
        },
        (error) => {
          console.error('Error updating client:', error);
        }
      );
    this.http.post<any>('http://localhost:8080/api/purchaseOrders/add/'+this.selectedQuotation.id, null).subscribe(
      response => {
        console.log('purchaseOrder added successfully:', response);
        
        
        setTimeout(() => {
          
          this.router.navigateByUrl('/purchaseOrders');
        }, 3000);
        
        
      },
      error => {
        console.error('Error adding purchaseOrder:', error);
        
      }
    );

    this.http.post<any>('http://localhost:8080/api/invoices/add/'+this.selectedQuotation.id, null).subscribe(
      response => {
        console.log('Invoice added successfully:', response);
        
        
        
        
        
      },
      error => {
        console.error('Error adding Invoice:', error);
        
      }
    );
    
  }

  

  generateQuotation(quotation: any) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont("Roboto", "Bold");
    const titleText = `Devis N°${quotation.numDevis}`;
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getStringUnitWidth(titleText) * doc.getFontSize() / doc.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2;

    doc.text(titleText, titleX, 40); // Move the title down

    doc.setFontSize(12);

    doc.text(`Date de génération: ${quotation.dateDebut.slice(0,10)}`, doc.internal.pageSize.width - 15, 50, { align: 'right' });
    doc.text(`Date d'expiration: ${quotation.dateExpiration.slice(0,10)}`, doc.internal.pageSize.width - 15, 60, { align: 'right' });

    doc.text(`Client: ${quotation.client.nom} ${quotation.client.prenom}`, 15, 70);
    doc.text(`Téléphone: ${quotation.client.telephone}`, 15, 80);
    doc.text(`Email: ${quotation.client.email}`, 15, 90);

    const enterpriseName = 'Your Enterprise Name';
    const enterpriseAddress = '123 Main Street, City, Country';
    doc.text(enterpriseName, doc.internal.pageSize.width - 15, 70, { align: 'right' });
    doc.text(enterpriseAddress, doc.internal.pageSize.width - 15, 80, { align: 'right' });
    const columns = ['Désignation', 'Description', 'Quantité', 'TVA', 'Prix unitaire'];
    const data = this.listProduit.map((product: any, index: number) => {
      const values = quotation.quantities.split(',').map((q: string) => parseInt(q));
      const quantity : string = values[index];
      const montant = product.prix;
      const montantTVA = product.prix * quotation.tva;
      const montantTTC = montant + montantTVA;
      console.log('prix:' + product.prix + ' TVA:' + quotation.tva);

      return [product.intitule, quotation.description, quantity, `${quotation.tva}%`, montant];
    });

    const startY = 100; // Define a startY value to make room for the text
    const mainTable = (doc as any).autoTable({
      head: [columns],
      body: data,
      startY: startY,
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 31 },
        1: { cellWidth: 60 },
        2: { cellWidth: 28 },
        3: { cellWidth: 28 },
        4: { cellWidth: 28 },
      },
    });

    const mainTableHeight = mainTable.lastAutoTable.finalY;
    const smallTableX = doc.internal.pageSize.getWidth() - 70;
    const smallTableY = mainTableHeight + 10;

    let smallTableData = [];

    if (quotation.quantities.includes(',')) {
      const quantityValues = quotation.quantities.split(',').map((q: string) => parseInt(q));
  
      smallTableData = [
        ['Montant', `${quantityValues.reduce((sum: number, quantity: string, index: number) => sum + parseInt(quantity) * data[index][4], 0)}`],
        ['Montant TVA', `${quantityValues.reduce((sum: number, quantity: string, index: number) => sum + parseInt(quantity) * data[index][4] * quotation.tva, 0)}`],
        ['Montant TTC', `${quantityValues.reduce((sum: number, quantity: string, index: number) => sum + parseInt(quantity) * data[index][4] * (1 + quotation.tva), 0)}`],
      ];
    } else {
      // If there's a single quantity
      const quantity = parseInt(quotation.quantities);
      smallTableData = [
        ['Montant', `${quantity * data[0][4]}`],
        ['Montant TVA', `${quantity * data[0][4] * quotation.tva}`],
        ['Montant TTC', `${quantity * data[0][4] * (1 + quotation.tva)}`],
      ];
    }

    const smallTableOptions = {
      startY: smallTableY,
      startX: smallTableX,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40 },
      },
    };

    (doc as any).autoTable({
      head: [['', '']],
      body: smallTableData,
      ...smallTableOptions,
    });

    // Save the PDF
    doc.save(`${quotation.numDevis}.pdf`);

  }
}


