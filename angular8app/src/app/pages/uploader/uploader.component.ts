import { Component, OnInit } from '@angular/core';

import { API_URL } from '../../config/config';
import {  FileUploader } from 'ng2-file-upload';
import { Movie } from '../../models/movie';

import { Router, ActivatedRoute } from '@angular/router';
import { MoviesService } from '../../services/movies.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {
  
  movies: Movie[] = [];
  titles: String[] = [];
  csv_data: Movie[] = [];

  public uploader: FileUploader = new FileUploader({ url: `${API_URL}/csv`, itemAlias: 'file' });

  constructor(private _moviesService:MoviesService, public router: Router) { }

  ngOnInit() {
    this.getAllMovies();    
    this.uploader.onAfterAddingFile = (file) => { 
      this.convertFile(file);
      file.withCredentials = false; 
    };
      this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          console.log('FileUpload:uploaded successfully:', item, status, response);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Se realizó la carga correctamente.`,
            showConfirmButton: false,
            timer: 4000
          })
          setTimeout(()=>this.router.navigate(['/movies']),4000)
          
      };
  }
  convertFile = (fileItem) => {
      this._moviesService.convertFiles(fileItem,this.titles).then((response: Movie[])=>{
        if(response.length >= 1){
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Se reconocieron ${response.length} películas que aún no están en la base de datos.`,
            showConfirmButton: false,
            timer: 4000
          })
        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: `El archivo no contiene ningún registro válido para la carga, por favor seleccione otro.`,
            showConfirmButton: true,
            timer: 4000
          })
        }
       // console.log(response);
        this.csv_data = response ;
      })
    }
  
      // Get all movies from the API
      getAllMovies() {
        this._moviesService.getAll().subscribe(
          movies => {
            this.movies = movies;
            this.titles = movies.reduce((a,b)=> a.concat(b.titulo), []);
          }
        );
      }

}
