import {Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {ThemeService} from "../../util/theme.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header-drop-down',
  templateUrl: './header-drop-down.component.html',
  styleUrls: ['./header-drop-down.component.css']
})
export class HeaderDropDownComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  isDarkMode = false;
  private themeSub!: Subscription;

  constructor(private eRef: ElementRef,
              private authService: AuthService,
              private themeService: ThemeService) {
  }

  ngOnInit(): void {
    this.themeSub = this.themeService.isDarkThemeActive()
      .subscribe(isDarkMode => this.isDarkMode = isDarkMode);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!this.eRef.nativeElement.contains(event.target)) {
      if (target.classList.contains('header-drop-down-control')) {
        return;
      }

      this.closeDropDown();
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.toggleColorTheme();
  }

  logout(): void {
    this.authService.logout();
    this.close.emit();
  }

  closeDropDown(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }
}
