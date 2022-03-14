import {Component, OnDestroy, OnInit} from '@angular/core';
import {WalletService} from "../wallet.service";
import {Subscription} from "rxjs";
import {Balance} from "../model/wallet.model";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit, OnDestroy {
  balance: Balance | null = null;
  isTooltipOpen = false;
  isDepositOpen = false;
  private balanceSub!: Subscription;

  get addressInfoLink(): string {
    return `${environment.chainSoUrlPrefix}/${this.balance?.network}/${this.balance?.address}`;
  }

  constructor(private walletService: WalletService) {
  }

  ngOnInit(): void {
    this.balanceSub = this.walletService.listenBalance()
        .subscribe(balance => this.balance = balance);
  }

  ngOnDestroy(): void {
    this.balanceSub?.unsubscribe();
  }
}
