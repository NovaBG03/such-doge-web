import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Meme} from "../../model/meme.model";
import {MemeService} from "../../meme.service";
import {PopUpModel} from "../../../util/pop-up/pop-up-model";
import {UserService} from "../../../profile/user.service";

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
  successPopUpModel!: PopUpModel;
  isReady = false;
  isDonationOpen = false;

  constructor(private memeService: MemeService, public userService: UserService) {
  }

  ngOnInit(): void {
    this.initErrorPopUp();
    this.initSuccessPopUp();
  }

  approve(): void {
    this.memeService.approveMeme(this.meme.id)
      .subscribe(
        () => this.isReady = true,
        err => this.errorPopUpModel.description = err
      );
  }

  memeUpdatedSuccessfully(): void {
    this.isReady = false;
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

  private initSuccessPopUp() {
    this.successPopUpModel = {
      bannerPath: 'assets/svgs/success-tick.svg',
      message: 'Meme approved successfully',
      description: `\'${this.meme.title}\' published by ${this.meme.publisherUsername}`,
      buttonText: 'Continue',
      buttonStyle: 'success'
    }
  }
}
