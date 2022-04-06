import {Component, OnInit} from '@angular/core';
import {MemePublishType} from "../../model/meme.model";

@Component({
  selector: 'app-meme-pending',
  templateUrl: './meme-pending.component.html',
  styleUrls: ['./meme-pending.component.css']
})
export class MemePendingComponent implements OnInit {
  publishType = MemePublishType.PENDING;
  constructor() {
  }

  ngOnInit(): void {
  }

}
