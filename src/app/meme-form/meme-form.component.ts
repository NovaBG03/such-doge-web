import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-meme-form',
  templateUrl: './meme-form.component.html',
  styleUrls: ['./meme-form.component.css']
})
export class MemeFormComponent implements OnInit {
  file: unknown = undefined;

  constructor() {
  }

  get fileName() {
    return (this.file as File).name
  }

  ngOnInit(): void {
  }

  onFileSelect(event: any) {
    this.file = event.target.files[0];
    console.log(this.file);
  }
}
