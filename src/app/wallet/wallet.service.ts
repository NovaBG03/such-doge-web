import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Balance, Transaction, TransactionFee, TransactionRequirements} from "./model/wallet.model";
import {BalanceDto, TransactionFeeDto, TransactionRequirementsDto} from "./model/wallet.dto";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
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

  getBalance(): Observable<Balance | null> {
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

  calculateTransactionFee(receiverUsername: string, transaction: Transaction): Observable<TransactionFee> {
    const params = new HttpParams().append('receiverUsername', receiverUsername);
    const url = `${environment.suchDogeApi}/wallet/transaction/fee`;
    return this.http.post <TransactionFeeDto>(url, transaction, {params})
      .pipe(
        map(dto => WalletService.transactionFeeDtoToTransactionFee(dto))
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
}
