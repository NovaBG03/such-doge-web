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
import {filter, switchMap, take, tap} from "rxjs/operators";
import {Observable, Subscription} from "rxjs";
import {NotificationService} from "../../notification-panel/notification.service";
import {
  InfoNotificationComponent
} from "../../notification-panel/notifications/info-notification/info-notification.component";
import {NotificationCategory} from "../../notification-panel/model/notification.model";
import {
  AutoClosedNotificationComponent
} from "../../notification-panel/notifications/auto-closed-notification/auto-closed-notification.component";

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
    console.log(transaction);
    this.walletService.summarizeDonation(this.meme.id, transaction)
      .subscribe(summarizedTransaction => {
        this.summarizedTransaction = summarizedTransaction;
        this.isLoading = false;
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
      .subscribe(submittedTransaction => {
        this.notificationService.pushNotification({
          component: AutoClosedNotificationComponent,
          category: NotificationCategory.Success,
          title: "Successful donation",
          message: `Successfully donated ${this.amountControl.value} ${submittedTransaction.network} to ${this.meme.publisherUsername}.`
        })
        this.close.emit();
        this.isLoading = false;
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
      switchMap(() => this.calculateFee())
    ).subscribe();
  }

  private calculateFee(): Observable<TransactionFee> {
    return this.walletService.estimateTransactionFee(this.meme.publisherUsername, {
      amount: this.amountControl.value,
      priority: this.priorityControl.value
    }).pipe(
      tap(transactionFee => this.fee = transactionFee)
    );
  }
}
