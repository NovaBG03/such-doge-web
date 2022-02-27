import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {WalletService} from "../wallet.service";
import {Subscription} from "rxjs";
import {Balance} from "../wallet.model";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit, OnDestroy {
  balance: Balance | null = null;
  isTooltipOpen = false;
  private balanceSub!: Subscription;

  constructor(private walletService: WalletService) {
  }

  ngOnInit(): void {
    this.balanceSub = this.walletService.getBalance()
      .subscribe(balance => this.balance = balance);
  }

  get addressInfoLink(): string {
    return `${environment.chainSoUrlPrefix}/${this.balance?.network}/${this.balance?.address}`;
  }


  ngOnDestroy(): void {
    this.balanceSub?.unsubscribe();
  }
}
