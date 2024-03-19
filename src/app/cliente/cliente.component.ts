import { Component, OnInit } from '@angular/core';
import { ClienteService } from './cliente.service';
import { Cliente } from './cliente';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
})
export class ClienteComponent implements OnInit {
  clientes: Cliente[] = [];
  paginador : any;
  clienteSeleccionado: Cliente;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService

  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {

      let page: number = +params.get('page'); //el + es para convertir el params.get en un number, también podría utilizar parseInt()

      if(!page) {
        page = 0;
      }
      this.clienteService
        .getClientes(page)
        .pipe(
          tap((response: any) => {
            console.log('Mostrando datos por tap num2'); //Estos apareceran en MAYUSCULAS, ya que luego del primer tap, pasan por un map que si retorna un valor y efectua los cambios.
            (response.content as Cliente[]).forEach((cliente) => {
              console.log(cliente.nombre);
            });
          })
        )
        .subscribe(
          (response) => {
            this.clientes = response.content as Cliente[],
            this.paginador = response
          }
          
        );
    });

    this.modalService.notificarUpload.subscribe(
      cliente => {
        this.clientes = this.clientes.map( clienteSeleccionado =>{
          if(cliente.id == clienteSeleccionado.id){
            clienteSeleccionado.foto = cliente.foto;
          }
          return clienteSeleccionado;
        })
      }
    )
  }

  delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Está seguro?',
        text: `Está  seguro que desea eliminar el cliente: ${cliente.nombre}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.clienteService.delete(cliente.id).subscribe((response) => {
            //Método filter sirve para mostrar o filttrar solo los elementos que le especifiquemos y los devuelve en un nuevo array
            this.clientes = this.clientes.filter((cli) => cli !== cliente); //si cli (filter filtra cliente por cliente del arreglo clientes, si cli es diferente del cliente eliminado, entonces crea metelo en el nuevo arrray. O sea solo dejará por fuera al cliente eliminado)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `El cliente ${cliente.nombre} ha sido eliminado con éxito`,
              'success'
            );
          });
        }
      });
  }

  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
