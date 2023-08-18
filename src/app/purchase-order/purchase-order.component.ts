import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent {
  
  purchaseOrders: any[] = [];
  selectedPurchaseOrder: any;
  listProduit: any[] = [];
  productsDisplay : any[]=[];


  constructor(private http: HttpClient, private router: Router) {
    
  }

  ngOnInit() {
    this.getPurchaseOrders();
    
  }

  getPurchaseOrders() {
    this.http.get<any>('http://127.0.0.1:8080/api/purchaseOrders').subscribe(
      (data) => {
        this.purchaseOrders = data;
        this.purchaseOrders.map((p)=>{
          if (p.listProduit.length === 1) {
             
             console.log(p.listProduit[0].intitule);
             this.productsDisplay.push(p.listProduit[0].intitule);
           } else {
             
             this.productsDisplay.push(`${p.listProduit.length} produits`);
           }
         
         console.log(this.productsDisplay);
     });
      },
      (error) => {
        console.error('Error fetching client:', error);
      }
    );
  }

  onSelect(purchaseOrder: any) {
    this.selectedPurchaseOrder = purchaseOrder;
    this.http.get<any>('http://127.0.0.1:8080/api/products/purchaseOrders/' + this.selectedPurchaseOrder.id).subscribe(
      (data) => {
        this.listProduit = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
    
  }

  navigateToUpdatePurchaseOrder() {
    if (this.selectedPurchaseOrder) {
      this.router.navigate(['/update-quotation', this.selectedPurchaseOrder.id]);
    }
  }

  getProduitDisplay(purchaseOrder : any): string {
    if (this.listProduit && this.listProduit.length > 0) {
      if (this.listProduit.length === 1) {
        
        return this.listProduit[0].intitule;
      } else {
        
        return `${this.listProduit.length} produits`;
      }
    }
    return '';
  }

  generatePurchaseOrder(purchaseOrder: any) {
    const doc = new jsPDF();

doc.setFontSize(18);
doc.setFont("Roboto", "Bold");
const titleText = `Bon de commande N°${purchaseOrder.numBonCommande}`;
const pageWidth = doc.internal.pageSize.getWidth();
const titleWidth = doc.getStringUnitWidth(titleText) * doc.getFontSize() / doc.internal.scaleFactor;
const titleX = (pageWidth - titleWidth) / 2;

doc.text(titleText, titleX, 40); // Move the title down

doc.setFontSize(12);

doc.text(`Date de génération: ${purchaseOrder.dateDebut.slice(0,10)}`, doc.internal.pageSize.width - 15, 50, { align: 'right' });
doc.text(`Date d'expiration: ${purchaseOrder.dateExpiration.slice(0,10)}`, doc.internal.pageSize.width - 15, 60, { align: 'right' });

doc.text(`Client: ${purchaseOrder.client.nom} ${purchaseOrder.client.prenom}`, 15, 70);
doc.text(`Téléphone: ${purchaseOrder.client.telephone}`, 15, 80);
doc.text(`Email: ${purchaseOrder.client.email}`, 15, 90);

const enterpriseName = 'Your Enterprise Name';
const enterpriseAddress = '123 Main Street, City, Country';
doc.text(enterpriseName, doc.internal.pageSize.width - 15, 70, { align: 'right' });
doc.text(enterpriseAddress, doc.internal.pageSize.width - 15, 80, { align: 'right' });
const columns = ['Désignation', 'Description', 'Quantité', 'TVA', 'Prix unitaire'];
const data = this.listProduit.map((product: any, index: number) => {
  const values = purchaseOrder.quantities.split(',').map((q: string) => parseInt(q));
  const quantity : string = values[index];
  const montant = product.prix;
  const montantTVA = product.prix * purchaseOrder.tva;
  const montantTTC = montant + montantTVA;
  console.log('prix:' + product.prix + ' TVA:' + purchaseOrder.tva);

  return [product.intitule, purchaseOrder.description, quantity, `${purchaseOrder.tva}%`, montant];
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

if (purchaseOrder.quantities.includes(',')) {
  const quantityValues = purchaseOrder.quantities.split(',').map((q: string) => parseInt(q));
  
  smallTableData = [
    ['Montant', `${quantityValues.reduce((sum: number, quantity: string, index: number) => sum + parseInt(quantity) * data[index][4], 0)}`],
    ['Montant TVA', `${quantityValues.reduce((sum: number, quantity: string, index: number) => sum + parseInt(quantity) * data[index][4] * purchaseOrder.tva, 0)}`],
    ['Montant TTC', `${quantityValues.reduce((sum: number, quantity: string, index: number) => sum + parseInt(quantity) * data[index][4] * (1 + purchaseOrder.tva), 0)}`],
  ];
} else {
  // If there's a single quantity
  const quantity = parseInt(purchaseOrder.quantities);
  smallTableData = [
    ['Montant', `${quantity * data[0][4]}`],
    ['Montant TVA', `${quantity * data[0][4] * purchaseOrder.tva}`],
    ['Montant TTC', `${quantity * data[0][4] * (1 + purchaseOrder.tva)}`],
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
doc.save(`${purchaseOrder.numBonCommande}.pdf`);

  }
}


