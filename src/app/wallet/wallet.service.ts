import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {
  Balance, SubmittedTransaction,
  SummarizedTransaction,
  Transaction,
  TransactionFee,
  TransactionRequirements
} from "./model/wallet.model";
import {
  BalanceDto,
  SubmittedTransactionDto,
  SummarizedTransactionDto,
  TransactionFeeDto,
  TransactionRequirementsDto
} from "./model/wallet.dto";
import {environment} from "../../environments/environment";
import {catchError, map, tap} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class WalletService {
  private timeoutMinutes = 1;
  private balanceSubject = new BehaviorSubject<Balance | null>(null);
  private balanceCheckTimeOut: any;

  constructor(private http: HttpClient, authService: AuthService) {
    authService.user.subscribe(user => {
      if (user) {
        this.updateBalance();
        return;
      }

      this.stopBalanceCheck();
      this.balanceSubject.next(null);
    });
  }

  getBalance(): Balance | null {
    return this.balanceSubject.getValue();
  }

  listenBalance(): Observable<Balance | null> {
    return this.balanceSubject.asObservable();
  }

  updateBalance(): void {
    this.scheduleBalanceCheck(this.timeoutMinutes);
    const url = `${environment.suchDogeApi}/wallet`;
    this.http.get<BalanceDto>(url)
      .pipe(
        map(dto => WalletService.balanceDtoToBalance(dto))
      )
      .subscribe(balance => {
        this.balanceSubject.next(balance);
      });
  }

  getTransactionRequirements(): Observable<TransactionRequirements> {
    const url = `${environment.suchDogeApi}/wallet/transaction/requirements`;
    return this.http.get<TransactionRequirementsDto>(url)
      .pipe(
        map(dto => WalletService.transactionRequirementsDtoToTransactionRequirements(dto))
      );
  }

  estimateTransactionFee(receiverUsername: string, transaction: Transaction): Observable<TransactionFee> {
    const params = new HttpParams().append('receiverUsername', receiverUsername);
    const url = `${environment.suchDogeApi}/wallet/transaction/estimatedFee`;
    return this.http.post<TransactionFeeDto>(url, transaction, {params})
      .pipe(
        map(dto => WalletService.transactionFeeDtoToTransactionFee(dto)),
        catchError(err => {
          let errMessage = "Something went wrong!";
          switch (err.error.message) {
            case "CAN_NOT_CALCULATE_NETWORK_FEE":
              errMessage = "Can't calculate network fee";
              break;
          }
          if (err.error.message.startsWith("MAX_TRANSACTION_AMOUNT_IS_")) {
            errMessage = `Transaction amount is too large`;
          }
          return throwError(errMessage);
        })
      );
  }

  summarizeDonation(memeId: number, transaction: Transaction): Observable<SummarizedTransaction> {
    const params = new HttpParams().append('memeId', memeId);
    const url = `${environment.suchDogeApi}/wallet/transaction/summarized`;
    return this.http.post<SummarizedTransactionDto>(url, transaction, {params})
      .pipe(
        map(dto => WalletService.summarizedTransactionDtoToSummarizedTransaction(dto)),
        catchError(err => {
          let errMessage = "Something went wrong!";
          switch (err.error.message) {
            case "CAN_NOT_TRANSFER_ASSETS_TO_THE_SAME_ADDRESS":
              errMessage = "Can't transfer assets to the same address";
              break;
            case "USER_NOT_CONFIRMED":
              errMessage = "Please confirm your email first.";
              break;
          }
          if (err.error.message.startsWith("MAX_TRANSACTION_AMOUNT_IS_")) {
            errMessage = `Transaction amount is too large`;
          }
          return throwError(errMessage);
        })
      );
  }

  donate(memeId: number, transaction: Transaction): Observable<SubmittedTransaction> {
    const params = new HttpParams().append('memeId', memeId);
    const url = `${environment.suchDogeApi}/wallet/transaction/donation`;
    return this.http.post<SubmittedTransactionDto>(url, transaction, {params})
      .pipe(
        tap(() => this.updateBalance()),
        map(dto => WalletService.submittedTransactionDtoToSubmittedTransaction(dto)),
        catchError(err => {
          let errMessage = "Something went wrong!";
          switch (err.error.message) {
            case "CAN_NOT_TRANSFER_ASSETS_TO_THE_SAME_ADDRESS":
              errMessage = "Can't transfer assets to the same address";
              break;
            case "USER_NOT_CONFIRMED":
              errMessage = "Please confirm your email first.";
              break;
          }
          if (err.error.message.startsWith("MAX_TRANSACTION_AMOUNT_IS_")) {
            errMessage = `Transaction amount is too large`;
          }
          return throwError(errMessage);
        })
      );
  }

  private scheduleBalanceCheck(minutes: number) {
    clearTimeout(this.balanceCheckTimeOut);
    this.balanceCheckTimeOut = setTimeout(() => {
      this.updateBalance();
    }, 60000 * minutes)
  }

  private stopBalanceCheck(): void {
    clearTimeout(this.balanceCheckTimeOut);
  }

  private static balanceDtoToBalance(dto: BalanceDto): Balance {
    return {
      address: dto.address,
      availableBalance: dto.availableBalance,
      pendingReceivedBalance: dto.pendingReceivedBalance,
      network: dto.network
    };
  }

  private static transactionRequirementsDtoToTransactionRequirements(dto: TransactionRequirementsDto): TransactionRequirements {
    return {
      maxTransactionAmount: dto.maxTransactionAmount,
      minTransactionAmount: dto.minTransactionAmount,
      transactionFeePercent: dto.transactionFeePercent,
      network: dto.network
    };
  }

  private static transactionFeeDtoToTransactionFee(dto: TransactionFeeDto): TransactionFee {
    return {
      additionalFee: dto.additionalFee,
      networkFee: dto.networkFee,
      transactionSize: dto.transactionSize,
      minCustomNetworkFee: dto.minCustomNetworkFee,
      maxCustomNetworkFee: dto.maxCustomNetworkFee,
      network: dto.network
    };
  }

  private static summarizedTransactionDtoToSummarizedTransaction(dto: SummarizedTransactionDto): SummarizedTransaction {
    return {
      amountToSend: dto.amountToSend,
      additionalFee: dto.additionalFee,
      networkFee: dto.networkFee
    };
  }

  private static submittedTransactionDtoToSubmittedTransaction(dto: SubmittedTransactionDto): SubmittedTransaction {
    return {
      transactionId: dto.transactionId,
      network: dto.network
    }
  }
}
