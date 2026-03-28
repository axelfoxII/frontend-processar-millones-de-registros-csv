import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  seletedFile: File | null = null;

  isLoading = false;

  progress = 0;

  totalRows = 0;

  data: any[] = [];

  columnNames: string[] = [];

  currentPage = 1;
  totalPages = 1;

  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {

    this.fetchPage(this.currentPage);

  }

  onFileSelected(event: any) {

    this.seletedFile = event.target.files[0];
  }

  uploadFile(event: Event) {

    event.preventDefault();

    if (!this.seletedFile) return;

    this.isLoading = true;

    this.progress = 0;

    this.uploadService.uploadFile(this.seletedFile).subscribe({

      next: (event) => {

        if (event.type === HttpEventType.UploadProgress && event.total) {

          this.progress = Math.round(
            (event.loaded / event.total) * 100
          );
        }

        if (event.type === HttpEventType.Response) {
          this.progress = 100;

          this.totalRows = event.body.totalRows;

          this.currentPage=1;

          this.fetchPage(this.currentPage);

          this.isLoading = false;

        }

      },
      error: (err) => {
        console.error('Error uploading file:', err);
        this.isLoading = false;

      },
      complete: () => {

        this.seletedFile = null;
        this.fileInput.nativeElement.value = '';

      }

    });

  }

  fetchPage(page:number){

    const limit = 10;
    this.uploadService.getPaginatedData(page, limit).subscribe(res=>{
      this.data = res.data;

      this.totalRows = res.totalRows;

      this.totalPages = res.totalPages;

      this.currentPage = res.currentPage;

      this.columnNames = Object.keys(this.data[0] || {});

    })

  }

  changePage(page:number){

    if (page < 1 || page > this.totalPages) return;

    this.fetchPage(page);

  }

clearData(){

  this.uploadService.clearServerData().subscribe({

    next:()=>{

      this.data = [];

      this.totalRows = 0;

      this.totalPages = 1;

      this.currentPage = 1;

      this.columnNames = [];

      this.fileInput.nativeElement.value = '';

      alert('Registros eliminados correctamente');

    },
    error:(err)=>{

      console.error('Error al eliminar regitros', err);
      alert('Error al eliminar registros del servidor');


    }

  })

}



  goToFirst(){

    if(this.currentPage === 1) return;
    this.fetchPage(1);

  }

  goToLast(){

    if(this.currentPage === this.totalPages) return;
    this.fetchPage(this.totalPages);

  }



}
