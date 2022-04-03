import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Meme} from "../../model/meme.model";
import {MemeService} from "../../meme.service";
import {PopUpModel} from "../../../util/pop-up/pop-up-model";
import {UserService} from "../../../user/user.service";
import {AuthService} from "../../../auth/auth.service";

@Component({
  selector: 'app-meme-card',
  templateUrl: './meme-card.component.html',
  styleUrls: ['./meme-card.component.css']
})
export class MemeCardComponent implements OnInit {
  @Input() meme!: Meme;
  @Input() isModeratorMode = false;

  @Output() memeUpdated = new EventEmitter<void>();

  errorPopUpModel!: PopUpModel;
  successPopUpModel: PopUpModel | null = null;
  isDonationOpen = false;

  constructor(public userService: UserService,
              public authService: AuthService,
              private memeService: MemeService) {
  }

  ngOnInit(): void {
    this.initErrorPopUp();
  }

  approve(): void {
    this.memeService.approveMeme(this.meme.id)
      .subscribe({
        next: () => this.successPopUpModel = {
          bannerPath: 'assets/svgs/success-tick.svg',
          message: 'Meme approved successfully',
          description: `\'${this.meme.title}\' published by ${this.meme.publisherUsername}`,
          buttonText: 'Continue',
          buttonStyle: 'success'
        },
        error: err => this.errorPopUpModel.description = err
      });
  }

  reject(): void {
    this.memeService.rejectMeme(this.meme.id)
      .subscribe({
        next: () => this.successPopUpModel = {
          bannerPath: 'assets/svgs/success-tick.svg',
          message: 'Meme rejected',
          description: `\'${this.meme.title}\' is rejected and notification is sent to ${this.meme.publisherUsername}`,
          buttonText: 'Continue',
          buttonStyle: 'success'
        },
        error: err => this.errorPopUpModel.description = err
      });
  }


  delete(): void {
    this.memeService.deleteMeme(this.meme.id)
      .subscribe({
        next: () => this.successPopUpModel = {
          bannerPath: 'assets/svgs/success-tick.svg',
          message: 'Meme deleted',
          description: `\'${this.meme.title}\' is deleted`,
          buttonText: 'Continue',
          buttonStyle: 'success'
        },
        error: err => this.errorPopUpModel.description = err
      });
  }

  memeUpdatedSuccessfully(): void {
    this.successPopUpModel = null;
    this.memeUpdated.emit();
  }

  startDonation(): void {
    this.isDonationOpen = true;
  }

  donationFinished(): void {
    this.isDonationOpen = false;
  }

  private initErrorPopUp(): void {
    this.errorPopUpModel = {
      bannerPath: 'assets/svgs/error-cross.svg',
      message: 'Error',
      description: '',
      buttonText: 'Continue',
      buttonStyle: 'danger'
    }
  }
}
