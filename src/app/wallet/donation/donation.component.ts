import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {WalletService} from "../wallet.service";
import {Meme} from "../../meme/model/meme.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Priority, TransactionFee, TransactionRequirements} from "../model/wallet.model";
import {catchError, filter, switchMap, tap} from "rxjs/operators";
import {Observable, of, throwError} from "rxjs";

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.css']
})
export class DonationComponent implements OnInit, OnDestroy {
  @Input() meme!: Meme;
  @Output() close = new EventEmitter<void>();

  requirements!: TransactionRequirements;
  fee!: TransactionFee;
  donationForm!: FormGroup;
  isLoading = true;

  get priorities(): string[] {
    return Object.keys(Priority);
  }

  get amountControl(): FormControl {
    return <FormControl>this.donationForm.get('amount');
  }

  get priorityControl(): FormControl {
    return <FormControl>this.donationForm.get('priority');
  }

  constructor(private walletService: WalletService, private renderer: Renderer2) {
    this.walletService.getTransactionRequirements()
      .subscribe(requirements => {
        this.requirements = requirements;
        this.initDonationForm();
        this.manageFee();
        this.isLoading = false;
      })
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'no-scroll');
  }

  setPriority(priority: string): void {
    this.priorityControl.setValue(priority);
  }

  isPriorityActive(priority: string): boolean {
    return this.priorityControl.value === priority;
  }

  previewDonation() {
    console.log(this.donationForm.value);
  }

  onClose(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'no-scroll');
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
    this.calculateFee().subscribe();

    this.donationForm.valueChanges.pipe(
      filter(() => !this.amountControl.errors && !this.amountControl.errors),
      switchMap(() => this.calculateFee())
    ).subscribe();
  }

  private calculateFee(): Observable<TransactionFee> {
    return this.walletService.calculateTransactionFee(this.meme.publisherUsername, {
      amount: this.amountControl.value,
      priority: this.priorityControl.value
    }).pipe(
      tap(transactionFee => {
        this.fee = transactionFee;
        console.log(this.fee);
      })
    );
  }
}
