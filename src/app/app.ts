import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UploadComponent } from "./upload/upload.component";

@Component({
  selector: 'app-root',
  imports: [UploadComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontContarRegistros');
}
