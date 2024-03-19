import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './cliente/cliente.component';
import { FormComponent } from './cliente/form.component';
import { DetalleComponent } from './cliente/detalle/detalle.component';

const routes: Routes = [{path: '',redirectTo: "/clientes", pathMatch:"full" },
{ path: 'clientes', component: ClienteComponent},
{ path: 'clientes/page/:page', component: ClienteComponent},
{ path: 'clientes/form', component: FormComponent},
{ path: 'clientes/form/:id', component: FormComponent},
];
//{path: '**', component: ErrorComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
