import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Meme} from "../../../model/meme.model";
import {DogeUser} from "../../../../auth/model/user.model";

@Component({
  selector: 'app-meme-drop-down',
  templateUrl: './meme-drop-down.component.html',
  styleUrls: ['./meme-drop-down.component.css']
})
export class MemeDropDownComponent implements OnInit {
  @Input() meme!: Meme;
  @Input() authUser!: DogeUser | null;
  isOpen = false;

  @Output() deleteOption = new EventEmitter<void>();

  constructor(private eRef: ElementRef) { }

  ngOnInit(): void {
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!this.eRef.nativeElement.contains(event.target)) {
      if (target.classList.contains('meme-drop-down-control')) {
        return;
      }
      this.closeDropDown();
    }
  }

  closeDropDown(): void {
    this.isOpen = false;
  }

  toggleDropDown(): void {
    this.isOpen = !this.isOpen;
  }

  delete(): void {
    this.closeDropDown();
    this.deleteOption.next();
  }
}
