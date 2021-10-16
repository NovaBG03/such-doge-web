import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";
import {MemeService} from "../meme.service";

@Component({
  selector: 'app-meme-form',
  templateUrl: './meme-form.component.html',
  styleUrls: ['./meme-form.component.css']
})
export class MemeFormComponent implements OnInit {
  acceptedImageTypes = ['image/jpeg', 'image/png'];
  errorMessage = '';

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

  constructor(private memeService: MemeService) {
  }

  get fileName() {
    return (this.fileMeme as File).name
  }

  ngOnInit(): void {
    this.initMemeForm();
  }

  onSelect(files: FileList | null) {
    if (files && this.isImage(files.item(0))) {
      this.fileMeme = files.item(0);
      this.isResizing = true;
    } else {
      this.fileMeme = null;
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
    this.errorMessage = '';
    if (this.memeForm.invalid || !this.resizedMeme) {
      this.errorMessage = "Don't try to cheat";
      return;
    }

    this.memeService.postMeme(this.resizedMeme, this.title.value, this.description.value)
      .subscribe(value => {
        console.log(value);
        this.memeForm.reset();
        this.fileMeme = null;
      });
  }

  asInputElement(target: EventTarget | null): HTMLInputElement {
    return target as HTMLInputElement;
  }

  private isImage(file: File | null): boolean {
    return !!file && this.acceptedImageTypes.includes(file['type'])
  }

  private initMemeForm() {
    this.memeForm = new FormGroup({
      title: new FormControl('', []),
      description: new FormControl('', [])
    });
  }

  private getControl(controlName: string): AbstractControl {
    return this.memeForm.get(controlName) as AbstractControl;
  }
}
