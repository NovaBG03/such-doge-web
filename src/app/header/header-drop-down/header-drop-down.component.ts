import {Component, ElementRef, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-header-drop-down',
  templateUrl: './header-drop-down.component.html',
  styleUrls: ['./header-drop-down.component.css']
})
export class HeaderDropDownComponent implements OnInit {
  isDarkMode = false;

  @Output() close = new EventEmitter<void>();

  constructor(private eRef: ElementRef, private authService: AuthService) { }

  ngOnInit(): void {
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!this.eRef.nativeElement.contains(event.target)) {
      if (target.classList.contains('arrow-down-icon')
      || target.classList.contains('arrow-down-path')) {
        return;
      }

      this.closeDropDown();
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
  }

  logout(): void {
    this.authService.logout();
    this.close.emit();
  }

  closeDropDown(): void {
    this.close.emit();
  }
}
