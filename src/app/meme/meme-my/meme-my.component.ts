import {Component, OnDestroy, OnInit} from '@angular/core';
import {Meme} from "../model/meme.model";
import {environment} from "../../../environments/environment";
import {Subscription} from "rxjs";
import {MemeService} from "../meme.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {concatMap, tap} from "rxjs/operators";
import {AuthService} from "../../auth/auth.service";

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
              private authService: AuthService,
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
            this.navigateToDefaultPage();
          }

          if (!params.pending) {
            this.isPending = true;
          } else if (this.isValidBoolean(params.pending)) {
            this.isPending = JSON.parse(params.pending);
          } else {
            this.navigateToDefaultPage();
          }

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
        tap(() => {
          const different = this.isApproved != this.isPending;
          this.approvedCheckboxValue = different && this.isApproved;
          this.pendingCheckboxValue = different && this.isPending;
        }),
        concatMap(() => {
          // todo make component url to use better type filtering param
          // approved=true/false pending=true/false ---> type=all/approved/pending
          let type = "approved";
          if (this.isApproved && this.isPending) {
            type = 'all';
          } else if (this.isPending) {
            type = "pending";
          }

          return this.memeService.getMemes(this.currentPage - 1, this.size, {
            publisher: this.authService.user.getValue()?.username,
            type: type
          });
        })
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
