import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meme-list',
  templateUrl: './meme-list.component.html',
  styleUrls: ['./meme-list.component.css']
})
export class MemeListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  getArray(length: number): any[] {
    return Array(length);
  }
}
