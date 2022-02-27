import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Balance} from "./wallet.model";
import {BalanceDto} from "./wallet.dto";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class WalletService {
  private timeoutMinutes = 1;
  private balanceSubject = new Subject<Balance | null>();
  private balanceCheckTimeOut: any;

  constructor(private http: HttpClient, authService: AuthService) {
    authService.user.subscribe(user =>{
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
}
