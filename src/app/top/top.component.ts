import { Component, OnInit } from '@angular/core';
import {MemeOrderFilter, OrderOptions} from "../meme/model/meme.model";

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {
  orderOptions: OrderOptions = {
    selectedFilter: MemeOrderFilter.TOP_TIPPED_LAST_WEEK,
    isTimeOrderAllowed: false,
    isTippedOrderAllowed: true,
    isTopFilterAllowed: true
  };

  constructor() { }

  ngOnInit(): void {
  }

}
