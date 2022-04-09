import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {MemeOrderFilter, OrderOptions} from "../meme/model/meme.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  orderOptions: OrderOptions = {
    selectedFilter: MemeOrderFilter.NEWEST,
    isTimeOrderAllowed: true,
    isTippedOrderAllowed: false,
    isTopFilterAllowed: false
  };

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
