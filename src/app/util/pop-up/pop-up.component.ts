import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {PopUpModel} from "./pop-up-model";

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnInit, OnDestroy {
  @Input() model!: PopUpModel;
  @Output() buttonPressed = new EventEmitter<void>();

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'no-scroll');
  }

  onButtonPressed(): void {
    this.buttonPressed.emit();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'no-scroll');
  }
}
