import {Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {WalletService} from "../../wallet.service";
import {Balance} from "../../model/wallet.model";
import {Subscription} from "rxjs";
import {environment} from "../../../../environments/environment";

@Component({
  selector: ' app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  balance: Balance | null = null;
  private balanceSub!: Subscription;

  get addressQrCode(): string {
    return `${environment.qrGeneratorUrlPrefix}${this.balance?.address}`;
  }

  constructor(private walletService: WalletService, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'no-scroll');
    this.balanceSub = this.walletService.listenBalance()
        .subscribe(balance => this.balance = balance)
  }

  onClose(): void {
    this.walletService.updateBalance();
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'no-scroll');
    this.balanceSub?.unsubscribe();
  }

}
