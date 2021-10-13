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

  memeFile: File | null = null;
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
    return (this.memeFile as File).name
  }

  ngOnInit(): void {
    this.initMemeForm();
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.memeForm.invalid || !this.memeFile) {
      this.errorMessage = "Don't try to cheat";
      return;
    }

    console.log(this.title.value, this.description.value);
    this.memeService.postMeme(this.memeFile, this.title.value, this.description.value)
      .subscribe(value => {
        this.memeForm.reset();
        this.memeFile = null;
      });
  }

  asInputElement(target: EventTarget | null): HTMLInputElement {
    return target as HTMLInputElement;
  }

  onDrop(files: FileList | null) {
    if (files && this.isImage(files.item(0))) {
      this.memeFile = files.item(0);
    }
    else {
      this.memeFile = null;
    }
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
