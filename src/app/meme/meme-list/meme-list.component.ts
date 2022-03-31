import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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
  @Input() filterType!: string;
  @Input() isModeratorMode: boolean = false;
  @Input() showFilterTypeControls: boolean = false;


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
          let options: { type?: string, publisher?: string } = {};
          if (this.filterType) {
            options.type = this.filterType;
          } else if (this.showFilterTypeControls) {
            let type = "approved";
            if (this.isApproved && this.isPending) {
              type = 'all';
            } else if (this.isPending) {
              type = "pending";
            }
            options.type = type;
            options.publisher = this.authService.user.getValue()?.username;
          }

          return this.memeService.getMemes(this.currentPage - 1, this.size, options)
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

  moveToPage(page: number | string): void {
    const pageNumber = +page;
    if (!pageNumber) {
      return;
    }

    // todo check if isApproved or isPending is undefined
    // const updatedQueryParams: Params = {
    //   approved: this.isApproved,
    //   pending: this.isPending,
    //   size: this.size,
    //   page: page
    // };

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
    const persistedQueryParams: Params = {
      approved: this.isApproved,
      pending: this.isPending
    };

    // todo check if isApproved or isPending is undefined

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
