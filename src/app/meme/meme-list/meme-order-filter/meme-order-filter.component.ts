import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {MemeOrderFilter, OrderOptions} from "../../model/meme.model";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-meme-order-filter',
  templateUrl: './meme-order-filter.component.html',
  styleUrls: ['./meme-order-filter.component.css']
})
export class MemeOrderFilterComponent implements OnInit {
  @Input() orderOptions: OrderOptions = {
    selectedFilter: MemeOrderFilter.NEWEST,
    isTimeOrderAllowed: false,
    isTippedOrderAllowed: false,
    isTopFilterAllowed: false
  }

  isOpen = false;

  get orderFilterKeys(): MemeOrderFilter[] {
    const orderFilters: MemeOrderFilter[] = [];

    if (this.orderOptions.isTimeOrderAllowed) {
      orderFilters.push(MemeOrderFilter.NEWEST, MemeOrderFilter.OLDEST);
    }
    if (this.orderOptions.isTippedOrderAllowed) {
      orderFilters.push(MemeOrderFilter.LATEST_TIPPED, MemeOrderFilter.MOST_TIPPED);
    }
    if (this.orderOptions.isTopFilterAllowed) {
      orderFilters.push(MemeOrderFilter.TOP_TIPPED_LAST_3_DAYS, MemeOrderFilter.TOP_TIPPED_LAST_WEEK, MemeOrderFilter.TOP_TIPPED_LAST_MONTH)
    }

    return orderFilters;
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private eRef: ElementRef) {
  }

  ngOnInit(): void {
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!this.eRef.nativeElement.contains(event.target)) {
      if (target.classList.contains('filter-btn')) {
        return;
      }
      this.closeDropDown();
    }
  }

  closeDropDown() {
    this.isOpen = false;
  }

  toggleDropDown() {
    this.isOpen = !this.isOpen;
  }

  getFilterDisplayName(x: string): string {
    return x.toLowerCase()
      .split('_')
      .map(x => x.charAt(0).toUpperCase() + x.slice(1))
      .join(' ');
  }

  selectOrderFilter(orderStr: string) {
    this.isOpen = false;
    const orderFilter = MemeOrderFilter[orderStr as keyof typeof MemeOrderFilter];
    if (orderFilter && orderFilter !== this.orderOptions.selectedFilter) {
      const persistedQueryParams: Params = {
        order: orderFilter,
      };

      if (orderFilter != MemeOrderFilter.NEWEST && orderFilter != MemeOrderFilter.OLDEST) {
        persistedQueryParams.approved = true;
        persistedQueryParams.pending = false;
      }

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: persistedQueryParams,
        queryParamsHandling: 'merge'
      });
    }
  }
}
