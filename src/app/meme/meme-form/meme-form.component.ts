import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {MemeService} from "../meme.service";
import {PopUpModel} from "../../util/pop-up/pop-up-model";
import * as CustomValidators from "../../util/validation/custom-validator.functions";

@Component({
  selector: 'app-meme-form',
  templateUrl: './meme-form.component.html',
  styleUrls: ['./meme-form.component.css']
})
export class MemeFormComponent implements OnInit {
  acceptedImageTypes = ['image/jpeg', 'image/png'];
  errorPopUpModel!: PopUpModel;
  successPopUpModel!: PopUpModel;
  isLoading = false;
  isReady = false;

  isResizing = false;
  fileMeme: File | null = null;
  resizedMeme: Blob | null = null;

  memeForm!: FormGroup;

  get title(): AbstractControl {
    return this.getControl('title');
  }

  get description(): AbstractControl {
    return this.getControl('description');
  }

  get fileName() {
    return (this.fileMeme as File).name
  }

  constructor(private memeService: MemeService) {
  }

  ngOnInit(): void {
    this.initMemeForm();
    this.initErrorPopUp();
    this.initSuccessPopUp();
  }

  onSelect(files: FileList | null) {
    if (files && this.isImage(files.item(0))) {
      this.fileMeme = files.item(0);
      this.isResizing = true;
    } else {
      this.fileMeme = null;
      this.resizedMeme = null;
      this.isResizing = false;
    }
  }

  setResizedImage(resizedImage: Blob | null): void {
    this.isResizing = false;
    this.resizedMeme = resizedImage;

    if (!resizedImage) {
      this.fileMeme = null;
    }
  }

  onSubmit(): void {
    this.errorPopUpModel.description = '';
    if (this.memeForm.invalid) {
      this.errorPopUpModel.description = "Don't try to cheat";
      return;
    }

    if (!this.resizedMeme) {
      this.errorPopUpModel.description = "No image uploaded!";
      return;
    }

    this.isLoading = true;
    this.memeService.postMeme(this.resizedMeme, this.title.value, this.description.value)
      .subscribe(() => {
          this.memeForm.reset();
          this.resizedMeme = null;
          this.fileMeme = null;
          this.isLoading = false;
          this.isReady = true;
        },
        err => {
          this.errorPopUpModel.description = err;
          this.isLoading = false;
          this.isReady = false;
        });
  }

  asInputElement(target: EventTarget | null): HTMLInputElement {
    return target as HTMLInputElement;
  }

  private isImage(file: File | null): boolean {
    return !!file && this.acceptedImageTypes.includes(file['type'])
  }

  private initMemeForm(): void {
    this.memeForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        CustomValidators.notOnlyWhitespaceValidator()
      ]),
      description: new FormControl('', [
        Validators.minLength(3),
        Validators.maxLength(100)
      ])
    });
  }

  private getControl(controlName: string): AbstractControl {
    return this.memeForm.get(controlName) as AbstractControl;
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
      message: 'Your meme has been <span class="success-colored-text">uploaded successfully</span>',
      description: 'It is scheduled to be reviewed by our team',
      buttonText: 'Continue',
      buttonStyle: 'success'
    }
  }
}
