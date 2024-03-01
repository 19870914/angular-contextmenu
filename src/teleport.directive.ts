import { 
  Directive, 
  Input, 
  Renderer2, 
  ElementRef,
  OnDestroy
} from '@angular/core';

@Directive({
  selector: '[contextmenu-teleport]',
  standalone: true,
})
export class TeleportDirective implements OnDestroy {
  @Input() to: string = '';

  private target: HTMLElement | null = null;

  constructor(
    private renderer: Renderer2, 
    private elementRef: ElementRef
  ) {
    this.target = this.to ? document.querySelector(this.to) : document.body
    this.renderer.appendChild(this.target, this.elementRef.nativeElement);
  }

  ngOnDestroy() {
    this.renderer.removeChild(this.target, this.elementRef.nativeElement);
  }
}