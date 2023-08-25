import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent { 
  invoices: any[] = [];
  selectedInvoice: any;
  listProduit: any[] = [];
  paymentAmount: number = 0;
  restAmount: number = 0;
  

  constructor(private http: HttpClient, private router: Router) {
    
  }

  ngOnInit() {
    this.getInvoices();
  }

  getInvoices() {
    this.http.get<any>('http://127.0.0.1:8080/api/invoices').subscribe(
      (data) => {
        this.invoices = data;
        
      
      },
      (error) => {
        console.error('Error fetching client:', error);
      }
    );
  }

  onSelect(invoice: any) {
    this.selectedInvoice = invoice;
    this.restAmount=this.selectedInvoice.prixTotal-this.selectedInvoice.montantPayé;
    this.http.get<any>('http://127.0.0.1:8080/api/products/quotation/' + this.selectedInvoice.devis.id).subscribe(
      (data) => {
        this.listProduit = data;
        console.log(this.listProduit);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
    
  }
    
    
  

  navigateToUpdateInvoice() {
    if (this.selectedInvoice) {
      this.router.navigate(['/update-invoice', this.selectedInvoice.id]);
    }
  }

  sendInvoice() {
    this.selectedInvoice.statut="envoyé";
    this.http
      .put<any>('http://127.0.0.1:8080/api/invoices/update/send/' + this.selectedInvoice.id,null)
      .subscribe(
        (response) => {
          console.log('invoice updated successfully:', response);
          
        },
        (error) => {
          console.error('Error updating client:', error);
        }
      );
    
    
  }

  validateInvoice() {
    this.selectedInvoice.statut="validé";
    this.http
      .put<any>('http://127.0.0.1:8080/api/invoices/update/' + this.selectedInvoice.id,this.selectedInvoice)
      .subscribe(
        (response) => {
          console.log('invoice updated successfully:', response);
          
        },
        (error) => {
          console.error('Error updating client:', error);
        }
      );
    
    
  }

  payInvoice() {
    
    console.log(this.selectedInvoice.prixTotal-(this.paymentAmount+this.selectedInvoice.montantPayé));
    if(this.selectedInvoice.prixTotal-(this.paymentAmount+this.selectedInvoice.montantPayé)<0){
      console.error("montant invalide");
    }
    if(this.selectedInvoice.prixTotal - (this.paymentAmount + this.selectedInvoice.montantPayé)===0){
      this.selectedInvoice.statut="payé";
      this.selectedInvoice.montantPayé=this.paymentAmount+this.selectedInvoice.montantPayé;
      this.http
        .put<any>('http://127.0.0.1:8080/api/invoices/update/' +this.selectedInvoice.id,this.selectedInvoice)
        .subscribe(
          (response) => {
            console.log('invoice updated successfully:', response);
          
          },
          (error) => {
            console.error('Error updating client:', error);
          }
        );
      }
      else{
        this.selectedInvoice.montantPayé=this.paymentAmount+this.selectedInvoice.montantPayé;
      this.http
        .put<any>('http://127.0.0.1:8080/api/invoices/update/' +this.selectedInvoice.id,this.selectedInvoice)
        .subscribe(
          (response) => {
            console.log('invoice updated successfully:', response);
          
          },
          (error) => {
            console.error('Error updating client:', error);
          }
        );

      }
    
    this.router.navigate(['/invoices']);
  }

  

  generateInvoice(invoice: any) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont("Roboto", "Bold");
    const titleText = `Facture N°${invoice.numFacture}`;
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getStringUnitWidth(titleText) * doc.getFontSize() / doc.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2;

    doc.text(titleText, titleX, 40); // Move the title down

    doc.setFontSize(12);
    

    doc.text(`Date d'émission': ${invoice.dateEmission.slice(0,10)}`, doc.internal.pageSize.width - 15, 50, { align: 'right' });
    doc.text(`Date d'écheance: ${invoice.dateEcheance.slice(0,10)}`, doc.internal.pageSize.width - 15, 60, { align: 'right' });

    doc.setFillColor(220, 220, 220); // Soft gray color for the rounded rectangle
    doc.setDrawColor(0, 0, 0); // Border color
    doc.roundedRect(15 - 5, 70 - 5, 70, 30, 5, 5, 'FD');
      
    doc.text(`Client: ${invoice.client.nom} ${invoice.client.prenom}`, 15, 70);
    doc.text(`Téléphone: ${invoice.client.telephone}`, 15, 80);
    doc.text(`Email: ${invoice.client.email}`, 15, 90);

    doc.setFillColor(220, 220, 220); // Soft gray color for the rounded rectangle
    doc.setDrawColor(0, 0, 0); // Border color
    doc.roundedRect(doc.internal.pageSize.width - 110, 70 - 5, 100, 20, 5, 5, 'FD');

    const enterpriseName = 'FINANCIAL DERIVATIVES CONSULTING';
    const enterpriseAddress = '19 RUE DES LILAS, ARGENTEUIL, 95100, France';
    doc.text(enterpriseName, doc.internal.pageSize.width - 15, 70, { align: 'right' });
    doc.text(enterpriseAddress, doc.internal.pageSize.width - 15, 80, { align: 'right' });
    const columns = ['Désignation', 'Description', 'Quantité', 'TVA', 'Prix unitaire (€)'];
    const data = this.listProduit.map((product: any, index: number) => {
      const values = invoice.devis.quantities.split(',').map((q: string) => parseInt(q));
      const quantity : string = values[index];
      const montant = product.prix;
      const montantTVA = product.prix * invoice.devis.tva;
      const montantTTC = montant + montantTVA;
      console.log('prix:' + product.prix + ' TVA:' + invoice.devis.tva);

      return [product.intitule, invoice.devis.description, quantity, `${invoice.devis.tva}%`, montant];
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

    if (invoice.devis.quantities.includes(',')) {
      const quantityValues = invoice.devis.quantities.split(',').map((q: string) => parseInt(q));
  
      smallTableData = [
        ['Montant (€)', `${quantityValues.reduce((sum: number, quantity: string, index: number) => sum + parseInt(quantity) * data[index][4], 0)}`],
        ['Montant TVA (€)', `${quantityValues.reduce((sum: number, quantity: string, index: number) => sum + parseInt(quantity) * data[index][4] * invoice.devis.tva, 0)}`],
        ['Montant TTC (€)', `${quantityValues.reduce((sum: number, quantity: string, index: number) => sum + parseInt(quantity) * data[index][4] * (1 + invoice.devis.tva), 0)}`],
      ];
    } else {
      // If there's a single quantity
      const quantity = parseInt(invoice.devis.quantities);
      smallTableData = [
        ['Montant (€)', `${quantity * data[0][4]}`],
        ['Montant TVA (€)', `${quantity * data[0][4] * invoice.devis.tva}`],
        ['Montant TTC (€)', `${quantity * data[0][4] * (1 + invoice.devis.tva)}`],
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

    const secondSectionY = smallTableY + 40; // Keep the Y value as it is

// Set font size and style for the second section
doc.setFontSize(12);
doc.setFont("Arial"); 

// Calculate the X position to align to the right
const secondSectionX = doc.internal.pageSize.getWidth() - 75; // Adjust the value as needed

// Draw rounded rectangle with a softer color
doc.setFillColor(220, 220, 220); // Soft gray color for the rounded rectangle
doc.setDrawColor(0, 0, 0); // Border color
doc.roundedRect(secondSectionX - 5, secondSectionY - 5, 60, 30, 5, 5, 'FD'); // Adjust dimensions and corner radii as needed


doc.text(`Prix Total (€): ${invoice.prixTotal}`, secondSectionX, secondSectionY);
doc.text(`Montant Payé (€): ${invoice.montantPayé}`, secondSectionX, secondSectionY + 10);
doc.text(`Reste à Payer (€): ${invoice.prixTotal - invoice.montantPayé}`, secondSectionX, secondSectionY + 20);

    doc.save(`${invoice.numFacture}.pdf`);

  }
}


