import {Component, OnInit} from '@angular/core';
import {MemeService} from "../meme.service";
import {Meme} from "../model/meme.model";

@Component({
  selector: 'app-meme-list',
  templateUrl: './meme-list.component.html',
  styleUrls: ['./meme-list.component.css']
})
export class MemeListComponent implements OnInit {
  memes: Meme[] = [];
  lastPage = 1;

  currentPage = 1;
  private size = 3;

  constructor(private memeService: MemeService) {
  }

  ngOnInit(): void {
    this.memeService.getMemeCount()
      .subscribe(count => this.lastPage = Math.ceil(count / this.size));

    this.memeService.getMemePage(this.currentPage - 1, this.size)
      .subscribe(memes => this.memes = memes);
  }

  getArray(length: string): any[] {
    return Array(length);
  }

  get firstDots(): string {
    return this.currentPage - 1 === 3 ? '2' : '...';
  }

  get secondDots(): string {
    return this.lastPage - this.currentPage === 3
    || (this.currentPage === 1 && this.lastPage === 5)
      ? (this.lastPage - 1).toString() : '...';
  }

  moveToPage(page: number | string): void {
    const pageNumber = page as number;
    if (!pageNumber) {
      return;
    }
    this.currentPage = pageNumber;
  }
}
