import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Meme} from "../../model/meme.model";
import {MemeService} from "../../meme.service";
import {UserService} from "../../../user/user.service";
import {AuthService} from "../../../auth/auth.service";
import {AlertService} from "../../../util/alert/alert.service";

@Component({
  selector: 'app-meme-card',
  templateUrl: './meme-card.component.html',
  styleUrls: ['./meme-card.component.css']
})
export class MemeCardComponent implements OnInit {
  @Input() meme!: Meme;
  @Input() isModeratorMode = false;
  @Output() memeUpdated = new EventEmitter<void>();

  isDonationOpen = false;

  constructor(public userService: UserService,
              public authService: AuthService,
              private memeService: MemeService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
  }

  approve(): void {
    this.memeService.approveMeme(this.meme.id)
      .subscribe({
        next: () => {
          this.memeUpdated.emit();
          this.alertService.showSuccessAlert(
            'Meme approved successfully',
            `\'${this.meme.title}\' published by ${this.meme.publisherUsername}`)
        },
        error: err => this.alertService.showErrorAlert(err)
      });
  }

  reject(): void {
    this.memeService.rejectMeme(this.meme.id)
      .subscribe({
        next: () => {
          this.memeUpdated.emit();
          this.alertService.showSuccessAlert(
            'Meme rejected',
            `\'${this.meme.title}\' is rejected and notification is sent to ${this.meme.publisherUsername}`);
        },
        error: err => this.alertService.showAlert(err)
      });
  }


  delete(): void {
    this.memeService.deleteMeme(this.meme.id)
      .subscribe({
        next: () => {
          this.memeUpdated.emit();
          this.alertService.showSuccessAlert(
            'Meme deleted',
            `\'${this.meme.title}\' is deleted`);
        },
        error: err => this.alertService.showErrorAlert(err)
      });
  }

  startDonation(): void {
    this.isDonationOpen = true;
  }

  donationFinished(): void {
    this.isDonationOpen = false;
  }
}
