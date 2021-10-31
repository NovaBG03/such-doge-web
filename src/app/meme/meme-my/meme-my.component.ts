import {Component, OnDestroy, OnInit} from '@angular/core';
import {Meme} from "../model/meme.model";
import {environment} from "../../../environments/environment";
import {Subscription} from "rxjs";
import {MemeService} from "../meme.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {concatMap, tap} from "rxjs/operators";

@Component({
  selector: 'app-meme-my',
  templateUrl: './meme-my.component.html',
  styleUrls: ['./meme-my.component.css']
})
export class MemeMyComponent implements OnInit, OnDestroy {
  memes: Meme[] = [];
  isLoading = true;
  memesCount = 0;
  currentPage = 1;
  size = environment.defaultMemePageSize;
  isApproved = true;
  isPending = true;
  approvedCheckboxValue = false;
  pendingCheckboxValue = false;

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
          if (!params.approved) {
            this.isApproved = true;
          } else if (this.isValidBoolean(params.approved)) {
            this.isApproved = JSON.parse(params.approved);
          } else {
            console.log("invalid approved")
            this.navigateToDefaultPage();
          }

          if (!params.pending) {
            this.isPending = true;
          } else if (this.isValidBoolean(params.pending)) {
            this.isPending = JSON.parse(params.pending);
          } else {
            console.log("invalid pending")
            this.navigateToDefaultPage();
          }

          if (!params.size) {
            this.size = environment.defaultMemePageSize;
          } else if (+params.size >= 1) {
            this.size = +params.size;
          } else {
            console.log("invalid size")
            this.navigateToDefaultPage();
          }

          if (!params.page) {
            this.currentPage = 1;
          } else if (+params.page >= 1) {
            this.currentPage = +params.page;
          } else {
            console.log("invalid page")
            this.navigateToDefaultPage();
          }
        }),
        tap(() => {
          const different = this.isApproved != this.isPending;
          this.approvedCheckboxValue = different && this.isApproved;
          this.pendingCheckboxValue = different && this.isPending;
        }),
        concatMap(() => {
          return this.memeService.getMyMemesCount(this.isApproved, this.isPending)
            .pipe(
              tap(count => this.memesCount = count)
            )
        }),
        concatMap(() => {
          return this.memeService.getMyMemesPage(
            this.currentPage - 1,
            this.size,
            this.isApproved,
            this.isPending)
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
      approved: this.isApproved,
      pending: this.isPending,
      size: this.size,
      page: page
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: updatedQueryParams
    });
  }

  pendingOnlyToggle($event: Event): void {
    $event.preventDefault();

    const persistedQueryParams: Params = {
      approved: this.isPending && !this.isApproved,
      pending: true,
      page: 1
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: persistedQueryParams,
      queryParamsHandling: 'merge'
    });
  }

  approvedOnlyToggle($event: Event): void {
    $event.preventDefault();

    const persistedQueryParams: Params = {
      approved: true,
      pending: this.isApproved && !this.isPending,
      page: 1
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: persistedQueryParams,
      queryParamsHandling: 'merge'
    });
  }

  private navigateToDefaultPage() {
    const persistedQueryParams: Params = {
      approved: this.isApproved,
      pending: this.isPending
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: persistedQueryParams
    });
  }

  private isValidBoolean(str: String) {
    return str.toLowerCase() === 'true' || str.toLowerCase() === 'false';
  }

  ngOnDestroy(): void {
    this.loadMemesSub?.unsubscribe();
  }
}
