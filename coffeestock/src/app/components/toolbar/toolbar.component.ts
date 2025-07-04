import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: false,
})
export class ToolbarComponent {
  @Input() title: string = '';
  @Input() leftIcon: string = '';
  @Input() rightIcon: string = '';
  @Input() showLeftIcon: boolean = true;
  @Input() showRightIcon: boolean = true;

  @Output() leftIconClick = new EventEmitter<void>();
  @Output() rightIconClick = new EventEmitter<void>();

  onLeftIconClick() {
    this.leftIconClick.emit();
  }

  onRightIconClick() {
    this.rightIconClick.emit();
  }
}