import {Component, OnInit} from '@angular/core';
import {MemeOrderFilter, MemePublishFilter, OrderOptions} from "../../model/meme.model";

@Component({
  selector: 'app-meme-pending',
  templateUrl: './meme-pending.component.html',
  styleUrls: ['./meme-pending.component.css']
})
export class MemePendingComponent implements OnInit {
  orderOptions: OrderOptions = {
    selectedFilter: MemeOrderFilter.NEWEST,
    isTimeOrderAllowed: true,
    isTippedOrderAllowed: false,
    isTopFilterAllowed: false
  }

  publishType = MemePublishFilter.PENDING;

  constructor() {
  }

  ngOnInit(): void {
  }

}
