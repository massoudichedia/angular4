// circle-progress.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-circle-progress',
  standalone: true,
  template: `
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 36 36">
      <path
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#eee"
        stroke-width="3"
      />
      <path
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        [attr.stroke]="color"
        stroke-width="3"
        [attr.stroke-dasharray]="progress + ',100'"
      />
      <text x="18" y="20.5" text-anchor="middle" font-size="10" fill="#666">
        {{progress}}%
      </text>
    </svg>
  `,
})
export class CircleProgressComponent {
  @Input() progress: number = 0;
  @Input() color: string = '#42A5F5';
  @Input() size: number = 36;
}