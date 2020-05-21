import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';

import { API_URL } from '../config/config';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  movies: Movie[] = [];
  titles: String[] = [];
  
  movies_url: string = `${API_URL}/movies`;
  
  constructor(private http: HttpClient, private papa: Papa) { }

  searchMovies( param: string ) {

    let url = this.movies_url + '/find/' + param;
    return this.http.get( url );

  }

  getAll(){
    return this.http.get<Movie[]>(this.movies_url);
  }

  deleteById(id:string){
    return this.http.delete(`${this.movies_url}/${id}`);
  }

  sendJson(movies:Movie[]){
   return this.http.post(this.movies_url, {movies} );
  }

  editTitle(id:string,titulo:string){
    return this.http.put(`${this.movies_url}/${id}`, { titulo } ).toPromise();
  }

  convertFiles(fileItem, actualTitles:String[]){
    return new Promise((resolve, reject)=>{
      const reader = new FileReader();
      reader.onload = () => {
        let text = String(reader.result);
        /**
         * CSV Parsing for UX
         */
        this.papa.parse(text,{
          delimiter:';',
          header:true,
          complete: (result ) => {
              const t_csv = result.data.reduce((a:Movie[],b)=> a.concat(b.titulo), []);
              const data_csv:Movie[] = result.data.filter((movie:Movie, index:number) => {
                  //Remove duplicates from csv, empty titles and existing movie titles
                  const removed = ( 
                    movie.titulo.trim() !== '' && 
                    actualTitles.indexOf(movie.titulo) === -1 && 
                    t_csv.indexOf(movie.titulo) === index
                  );
                  return removed;
              })
              resolve(data_csv)
          },
          error: (error)=>{
            reject(error)
          }
        });
      };
      reader.readAsText(fileItem.file.rawFile);
    })
  }


}
