import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {MemeService} from "../meme.service";
import {Meme, MemeFilter, MemeOrderFilter, MemePublishFilter, OrderOptions} from "../model/meme.model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {map, switchMap, tap} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";
import {NgxMasonryOptions} from "ngx-masonry/lib/ngx-masonry-options";

@Component({
  selector: 'app-meme-list',
  templateUrl: './meme-list.component.html',
  styleUrls: ['./meme-list.component.css']
})
export class MemeListComponent implements OnInit, OnDestroy {
  @Input('publisher') set setPublisher(publisher: string) {
    this.publisher = publisher;
    this.loadMemes();
  }

  @Input() orderOptions: OrderOptions = {
    selectedFilter: MemeOrderFilter.NEWEST,
    isTimeOrderAllowed: false,
    isTippedOrderAllowed: false,
    isTopFilterAllowed: false
  }

  @Input() publishType!: MemePublishFilter;
  @Input() isModeratorMode: boolean = false;
  @Input() showFilterTypeControls: boolean = false;

  publisher!: string;
  memes: Meme[] = [];
  isLoading = true;
  memesCount = 0;
  currentPage = 1;
  size = environment.defaultMemePageSize;

  isApproved = true;
  isPending = false;
  approvedCheckboxValue = false;
  pendingCheckboxValue = false;

  masonryOptions: NgxMasonryOptions = {
    gutter: 10,
    animations: {},
    fitWidth: true
  };

  private loadMemesSub!: Subscription;

  constructor(public authService: AuthService,
              private memeService: MemeService,
              private route: ActivatedRoute,
              private router: Router,
              private elementRef: ElementRef<HTMLElement>) {
  }

  ngOnInit(): void {
    this.loadMemes();
    window.scroll(0, 0);
  }

  loadMemes(): void {
    this.isLoading = true;
    this.loadMemesSub?.unsubscribe();
    this.loadMemesSub = this.route.queryParams
      .pipe(
        tap(() => {
          this.isLoading = true;
          const offsetTop = this.elementRef.nativeElement.offsetTop;
          if (offsetTop) {
            window.scroll(0, offsetTop - 100);
          }
        }),
        tap(params => {
          if (!params.approved) {
            this.isApproved = true;
          } else if (MemeListComponent.isValidBoolean(params.approved)) {
            this.isApproved = JSON.parse(params.approved);
          } else {
            this.navigateToDefaultPage();
          }

          if (!params.pending) {
            this.isPending = true;
          } else if (MemeListComponent.isValidBoolean(params.pending)) {
            this.isPending = JSON.parse(params.pending);
          } else {
            this.navigateToDefaultPage();
          }

          const orderFilter: MemeOrderFilter = MemeOrderFilter[params.order?.toUpperCase() as keyof typeof MemeOrderFilter]
          if (orderFilter) {
            this.orderOptions.selectedFilter = orderFilter;
          } else if (this.orderOptions.isTimeOrderAllowed) {
            this.orderOptions.selectedFilter = MemeOrderFilter.NEWEST;
          } else if (this.orderOptions.isTopFilterAllowed) {
            this.orderOptions.selectedFilter = MemeOrderFilter.TOP_TIPPED_LAST_3_DAYS;
          } else if (this.orderOptions.isTippedOrderAllowed) {
            this.orderOptions.selectedFilter = MemeOrderFilter.LATEST_TIPPED;
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
        map(() => {
          let memeFilter: MemeFilter = {};
          if (this.publishType) {
            memeFilter.publishFilter = this.publishType;
          } else if (this.showFilterTypeControls) {
            let memePublishType = MemePublishFilter.APPROVED;
            if (this.isApproved && this.isPending) {
              memePublishType = MemePublishFilter.ALL;
            } else if (this.isPending) {
              memePublishType = MemePublishFilter.PENDING;
            }
            memeFilter.publishFilter = memePublishType;
            memeFilter.publisher = this.authService.user.getValue()?.username;
          }

          if (this.publisher) {
            memeFilter.publisher = this.publisher;
          }

          memeFilter.orderFilter = this.orderOptions.selectedFilter;

          return memeFilter;
        }),
        switchMap(options => this.memeService.getMemes(this.currentPage - 1, this.size, options))
      ).subscribe({
        next: response => {
          this.memesCount = response.totalCount;
          this.memes = response.memes;
          this.isLoading = false;
        },
        error: () => {
          // todo fix not working
          this.navigateToDefaultPage()
        }
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

    if (this.orderOptions.selectedFilter != MemeOrderFilter.NEWEST
      && this.orderOptions.selectedFilter != MemeOrderFilter.OLDEST) {
      persistedQueryParams.order = MemeOrderFilter.NEWEST;
    }

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

    if (persistedQueryParams.pending
      && this.orderOptions.selectedFilter != MemeOrderFilter.NEWEST
      && this.orderOptions.selectedFilter != MemeOrderFilter.OLDEST) {
      persistedQueryParams.order = MemeOrderFilter.NEWEST;
    }

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

    const updatedQueryParams: Params = {
      approved: this.isApproved,
      pending: this.isPending,
      order: this.orderOptions.selectedFilter,
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
      size: this.size,
      page: this.currentPage,
      approved: this.isApproved,
      pending: this.isPending
    };

    this.router.navigate([], {
      // relativeTo: this.route,
      queryParams: persistedQueryParams
    });
  }


  private static isValidBoolean(str: String) {
    return str.toLowerCase() === 'true' || str.toLowerCase() === 'false';
  }

  ngOnDestroy(): void {
    this.loadMemesSub?.unsubscribe();
  }
}
