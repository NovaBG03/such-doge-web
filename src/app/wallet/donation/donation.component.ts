import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {WalletService} from "../wallet.service";
import {Meme} from "../../meme/model/meme.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {
  Priority,
  SummarizedTransaction,
  Transaction,
  TransactionFee,
  TransactionRequirements
} from "../model/wallet.model";
import {catchError, filter, switchMap, take, tap} from "rxjs/operators";
import {Observable, of, Subscription} from "rxjs";
import {NotificationService} from "../../util/notification/notification.service";
import {NotificationCategory} from "../../util/notification/model/notification.model";
import {
  InfoNotificationComponent
} from "../../util/notification/notification-components/info-notification/info-notification.component";

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.css']
})
export class DonationComponent implements OnInit, OnDestroy {
  @Input() meme!: Meme;
  @Output() close = new EventEmitter<void>();

  donationForm!: FormGroup;
  requirements!: TransactionRequirements;
  fee: TransactionFee | null = null;
  summarizedTransaction: SummarizedTransaction | null = null;
  errMessage = '';
  isMoreInfoOpen = false;
  isLoading = true;

  private feeSub!: Subscription;

  get priorities(): string[] {
    return Object.keys(Priority);
  }

  get amountControl(): FormControl {
    return <FormControl>this.donationForm.get('amount');
  }

  get priorityControl(): FormControl {
    return <FormControl>this.donationForm.get('priority');
  }

  constructor(private walletService: WalletService,
              private notificationService: NotificationService,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'no-scroll');
    this.walletService.getTransactionRequirements()
      .subscribe(requirements => {
        this.requirements = requirements;
        this.initDonationForm();
        this.manageFee();
        this.isLoading = false;
      });
  }

  setPriority(priority: string): void {
    this.priorityControl.setValue(priority);
  }

  isPriorityActive(priority: string): boolean {
    return this.priorityControl.value === priority;
  }

  previewDonation(): void {
    this.isLoading = true;
    const transaction: Transaction = {
      amount: this.donationForm.value.amount,
      priority: this.donationForm.value.priority
    };
    this.walletService.summarizeDonation(this.meme.id, transaction)
      .subscribe({
        next: summarizedTransaction => {
          this.summarizedTransaction = summarizedTransaction;
          this.isLoading = false;
        },
        error: err => {
          this.isLoading = false;
          this.errMessage = err;
        },
        complete: () => this.isLoading = false
      });
  }

  cancelDonationPreview(): void {
    this.summarizedTransaction = null;
  }

  confirmDonation(): void {
    this.isLoading = true;
    const transaction: Transaction = {
      amount: this.donationForm.value.amount,
      priority: this.donationForm.value.priority
    };
    this.walletService.donate(this.meme.id, transaction)
      .subscribe({
        next: submittedTransaction => {
          this.notificationService.pushNotification({
            component: InfoNotificationComponent,
            category: NotificationCategory.Success,
            title: "Successful donation",
            message: `Successfully donated ${this.amountControl.value} ${submittedTransaction.network} to ${this.meme.publisherUsername}.`
          })
          this.close.emit();
          this.meme.donations += transaction.amount;
          this.isLoading = false;
        },
        error: err => {
          this.isLoading = false;
          this.errMessage = err;
        },
      })
  }

  onClose(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'no-scroll');
    this.feeSub?.unsubscribe();
  }

  private initDonationForm() {
    this.donationForm = new FormGroup({
      amount: new FormControl(this.requirements.minTransactionAmount, [
        Validators.required,
        Validators.min(this.requirements.minTransactionAmount),
        Validators.max(this.requirements.maxTransactionAmount)
        // todo validate user have enough balance
        // todo validate input is no more than 8 digits after the floating point
      ]),
      priority: new FormControl(Priority.LOW, Validators.required),
    });
  }

  private manageFee() {
    this.calculateFee()
      .pipe(take(1))
      .subscribe();

    this.feeSub?.unsubscribe();
    this.feeSub = this.donationForm.valueChanges.pipe(
      tap(() => this.fee = null),
      filter(() => !this.amountControl.errors && !this.amountControl.errors),
      switchMap(() => this.calculateFee()),
      filter(value => !!value)
    ).subscribe();
  }

  private calculateFee(): Observable<TransactionFee | null> {
    return this.walletService.estimateTransactionFee(this.meme.publisherUsername, {
      amount: this.amountControl.value,
      priority: this.priorityControl.value
    }).pipe(
      catchError(err => {
        this.errMessage = err;
        return of(null);
      }),
      tap(fee => {
        this.fee = fee;
        if (fee) {
          this.checkBalanceIsEnough(fee.networkFee + fee.additionalFee)
        }
      }),
    );
  }

  private checkBalanceIsEnough(fee: number): void {
    const walletBalance = this.walletService.getBalance()?.availableBalance;
    const balanceNeeded = fee + this.amountControl.value;
    if (!walletBalance || walletBalance < balanceNeeded) {
      this.errMessage = "Transaction amount is too large";
    } else {
      this.errMessage = '';
    }
  }
}
