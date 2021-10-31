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
  memesCount = 0;
  currentPage = 1;
  size = environment.defaultMemePageSize;

  private loadMemesSub!: Subscription;

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
          if (!params.size) {
            this.size = environment.defaultMemePageSize;
          } else if (+params.size >= 1) {
            this.size = +params.size;
          } else {
            this.navigateToDefaultPage();
          }

          if (!params.page) {
            this.currentPage = 1;
          } else if (+params.page >= 1) {
            this.currentPage = +params.page;
          } else {
            this.navigateToDefaultPage();
          }
        }),
        concatMap(() => {
          return this.memeService.getMemesCount()
            .pipe(
              tap(count => this.memesCount = count)
            )
        }),
        concatMap(() => {
          return this.memeService.getMemesPage(this.currentPage - 1, this.size)
        })
      ).subscribe(memes => {
        this.memes = memes;
        this.isLoading = false;
      });
  }

  getArray(length: number): any[] {
    return Array(length);
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
