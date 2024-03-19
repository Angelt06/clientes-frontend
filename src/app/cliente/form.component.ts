import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  cliente : Cliente = new Cliente();
  regiones: Region[];
  titulo : string = "Formulario Clientes";
  errores : string[];


  constructor(private clienteService : ClienteService, private router : Router, private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones => {
      this.regiones =regiones;
    });
  }

  
  create():void{
    this.clienteService.create(this.cliente).subscribe({
      next:
      cliente => {
        this.router.navigate(['/clientes']);
        Swal.fire('Nuevo cliente', `Cliente ${this.cliente.nombre} creado con éxito!`, 'success')
        
    },
    error:
    (err : any) => {
      this.errores = err.error.errors as string[];
      console.error('Código del error del Backend:' + err.status);
      console.error(err.error.errors);
    }
  });
  }

  cargarCliente(){
    this.activatedRoute.params.subscribe(
      params => {
        let id = params['id'];
        if(id) {
           this.clienteService.getCliente(id).subscribe( cliente => this.cliente = cliente );
        }
      }
    )
  }

  update():void{
    this.clienteService.update(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes']);
        Swal.fire('Nuevo cliente actualizado', `Cliente ${cliente.nombre} Actualizado con éxito!`, 'success');
      }
    )
  }

  compararRegion(o1 : Region, o2 : Region) : boolean{

    if(o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 == null || o2 == null ? false : o1.id===o2.id;
  }
}
