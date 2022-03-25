import {Component, OnDestroy, OnInit} from '@angular/core';
import {MemeService} from "../meme.service";
import {Meme} from "../model/meme.model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {concatMap, tap} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";

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

  constructor(public authService: AuthService,
              private memeService: MemeService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loadMemes();
  }

  loadMemes(): void {
    this.isLoading = true;
    this.loadMemesSub?.unsubscribe();
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
        concatMap(() => this.memeService.getMemes(this.currentPage - 1, this.size))
      ).subscribe(response => {
        this.memesCount = response.totalCount;
        this.memes = response.memes;
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
