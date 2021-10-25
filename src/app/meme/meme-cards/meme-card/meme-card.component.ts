import {Component, Input, OnInit} from '@angular/core';
import {Meme} from "../../model/meme.model";

@Component({
  selector: 'app-meme-card',
  templateUrl: './meme-card.component.html',
  styleUrls: ['./meme-card.component.css']
})
export class MemeCardComponent implements OnInit {
  @Input() meme!: Meme;

  constructor() { }

  ngOnInit(): void {
  }

}
