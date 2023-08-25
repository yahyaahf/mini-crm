import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Routes } from '@angular/router';
import { AddClientComponent } from './add-client/add-client.component';
import { FormsModule } from '@angular/forms';
import { UpdateClientComponent } from './update-client/update-client.component';
import { ProductsComponent } from './products/products.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { GenerateQuotationComponent } from './generate-quotation/generate-quotation.component';
import { QuotationComponent } from './quotation/quotation.component';
import { UpdateQuotationComponent } from './update-quotation/update-quotation.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { UpdateInvoiceComponent } from './update-invoice/update-invoice.component';
const routes: Routes = [
  { path: 'add-client', component: AddClientComponent },
  {path: 'update-client/:id',component: UpdateClientComponent},
  {path: 'products',component: ProductsComponent},
  { path: 'add-product', component: AddProductComponent },
  { path: 'update-product/:id', component: UpdateProductComponent },
  { path: 'generate-quotation/:id', component: GenerateQuotationComponent },
  {path: 'quotations',component: QuotationComponent},
  { path: 'update-quotation/:id', component: UpdateQuotationComponent },
  {path: 'purchaseOrders',component: PurchaseOrderComponent},
  {path: 'invoices',component: InvoicesComponent},
  { path: 'update-invoice/:id', component: UpdateInvoiceComponent },
  
];

@NgModule({
  declarations: [
    AppComponent,
    AddClientComponent,
    UpdateClientComponent,
    ProductsComponent,
    UpdateProductComponent,
    AddProductComponent,
    GenerateQuotationComponent,
    QuotationComponent,
    UpdateQuotationComponent,
    PurchaseOrderComponent,
    InvoicesComponent,
    UpdateInvoiceComponent,
  ],
  imports: [RouterModule.forRoot(routes), BrowserModule,
    AppRoutingModule, HttpClientModule, BrowserAnimationsModule,
    MatToolbarModule,  MatIconModule, FormsModule, MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
