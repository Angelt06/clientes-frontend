import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClienteComponent } from './cliente/cliente.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { FormComponent } from './cliente/form.component';
import { FormsModule } from '@angular/forms';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ClienteService } from './cliente/cliente.service';
import { PaginatorComponent } from './paginator/paginator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetalleComponent } from './cliente/detalle/detalle.component';


registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    ClienteComponent,
    FooterComponent,
    HeaderComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    FormsModule, BrowserAnimationsModule
  ],
  providers: [ClienteService, { provide: LOCALE_ID, useValue: 'es' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
