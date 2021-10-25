import {Component, OnDestroy, OnInit} from '@angular/core';
import {MemeService} from "../meme.service";
import {Meme} from "../model/meme.model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {concatMap, tap} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-meme-list',
  templateUrl: './meme-list.component.html',
  styleUrls: ['./meme-list.component.css']
})
export class MemeListComponent implements OnInit, OnDestroy {
  memes: Meme[] = [];
  isLoading = true;
  lastPage = 1;
  currentPage = 1;
  size = environment.defaultMemePageSize;

  private loadMemesSub!: Subscription;

  get validParams(): boolean {
    return this.currentPage >= 1 && this.size >= 1;
  }

  constructor(private memeService: MemeService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
     this.loadMemesSub = this.route.queryParams
      .pipe(
        tap(() => {
          this.isLoading = true;
          window.scroll(0, 0);
        }),
        tap(params => {
          if (params.size) {
            this.size = +params.size;
          } else {
            this.size = environment.defaultMemePageSize;
          }
          if (params.page) {
            this.currentPage = +params.page;
          } else {
            this.currentPage = 1;
          }
        }),
        tap(() => {
          if (!this.validParams) {
            this.navigateToDefaultPage();
          }
        }),
        concatMap(() => {
          return this.memeService.getMemeCount()
            .pipe(
              tap(count => this.lastPage = Math.ceil(count / this.size))
            )
        }),
        tap(() => {
          if (this.currentPage > this.lastPage) {
            this.navigateToDefaultPage();
          }
        }),
        concatMap(() => {
          return this.memeService.getMemePage(this.currentPage - 1, this.size)
        })
      ).subscribe(memes => {
      this.memes = memes;
      this.isLoading = false;
    });
  }

  getArray(length: number): any[] {
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
    const pageNumber = +page;
    if (!pageNumber) {
      return;
    }

    const updatedQueryParams: Params = {
      size: this.size,
      page: page
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: updatedQueryParams
    });
  }

  private navigateToDefaultPage() {
    this.router.navigate([], {
      relativeTo: this.route,
    });
  }

  ngOnDestroy(): void {
    this.loadMemesSub?.unsubscribe();
  }
}
