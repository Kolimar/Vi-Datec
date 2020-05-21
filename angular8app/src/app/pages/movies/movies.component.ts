import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Movie } from '../../models/movie';
import { MoviesService } from '../../services/movies.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})

export class MoviesComponent implements OnInit {

    movies: Movie[] = [];
    titles: String[] = [];
    csv_data: Movie[] = [];

    displayedColumns: string[] = ['año','titulo', 'actores', 'genero', 'director','opciones'];
    
    dataSource = new MatTableDataSource<Movie>(this.movies);

 
  
    constructor(private _moviesService:MoviesService) { }

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    ngOnInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.getAllMovies();      
    }

      

      editRow(id,titulo){
        Swal.fire({
          title: `Escriba el nuevo título para la película ${titulo}`,
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Cambiar titulo',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: `Cancelar`,
          showLoaderOnConfirm: true,
          preConfirm: (nuevo_titulo) => {
            return this._moviesService.editTitle(id,nuevo_titulo)
              .then(response => {
                return response;
              })
              .catch(error => {
                Swal.showValidationMessage(
                  `Falló al editar: ${error}`
                )
              })
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result) {
            Swal.fire({
              title: `Se editó correctamente el registro `
            })
          }
        })
      }

      deleteRow(id,titulo){
        Swal.fire({
          title: 'Eliminar',
          text: `¿Quieres eliminar la película ${titulo}?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: `No, me arrepentí`,
          confirmButtonText: `Si, destruye!`
        }).then((result) => {
          if (result.value) {
            this._moviesService.deleteById(id).subscribe(
              res => {
                Swal.fire(
                  'Borrado!',
                  'Película eliminada correctamente.',
                  'success'
                )
                this.getAllMovies();
              }
            )

          }
        })
        
      }

      searchMovies(params : string){
        if ( params.length <= 0 ) {
          this.getAllMovies();
          return;
        }
    
        this._moviesService.searchMovies( params ).subscribe((movies:Movie[]) =>  {
                this.movies = movies;
                this.dataSource.data = movies;
        });
      }
      // Get all movies from the API
      getAllMovies() {
        this._moviesService.getAll().subscribe(
          movies => {
            this.movies = movies;
            this.dataSource.data = movies;
            this.titles = movies.reduce((a,b)=> a.concat(b.titulo), []);
          }
        );
      }

}

