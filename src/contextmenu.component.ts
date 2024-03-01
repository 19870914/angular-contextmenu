import { Component, ViewEncapsulation } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';
import { ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IMenu, ISubRect, IContextmenuOptions } from './contextmenu.interface';
import { useNamespace, IUseNamespace } from './use-namespace';
import { ViewportService } from './viewport-service';
import { TeleportDirective } from './teleport.directive';
import { 
  style, animate, 
  AnimationStyleMetadata, 
  AnimationAnimateMetadata,
  AnimationBuilder
} from '@angular/animations'; 

const offset = 3;

@Component({
  selector: 'app-menu',
  templateUrl: './contextmenu.component.html',
  imports: [TeleportDirective],
  standalone: true,
  styleUrls: ['./style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContextmenuComponent<T extends IMenu> implements OnInit, AfterViewInit {
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Input() menus: T[][] = [];
  @Input() callback?: (menu: IMenu) => void;
  @Input() options?: IContextmenuOptions;
  @Input() isSub: boolean = false;

  @Output() closeMenu = new EventEmitter<void>();
  @ViewChild('contextmenuRef') contextmenuRef!: ElementRef; 

  ns: IUseNamespace = useNamespace('angular-contextmenu')
  hoverIndex: string = '';
  private width: number = 0;
  private height: number = 0;
  private vw: number = 0;
  private vh: number = 0;

  @Input() subRect: ISubRect | null = null;
  subMenuRect: ISubRect | null = null;

  constructor(
    private viewportService: ViewportService,
    private animationBuilder: AnimationBuilder,
    private cdr: ChangeDetectorRef
  ) {
    
  }

  ngOnInit() {
    this.viewportService.vw$.subscribe(vw => this.vw = vw);
    this.viewportService.vh$.subscribe(vh => this.vh = vh);
  }

  ngAfterViewInit() {
    if (!this.contextmenuRef) return;
    const { clientWidth, clientHeight } = this.contextmenuRef.nativeElement;
    this.width = clientWidth;
    this.height = clientHeight;
    this.showMenu()
  }

  get contextmenuStyle(): { [key: string]: string | number } {
    const { x, y, width, height, vw, vh } = this;
    const subRect = this.subRect!;
    let left = 0;
    let top = 0;
    if (this.isSub) {
      let _left = subRect.left + subRect.width + width - offset
      left = _left > vw ? subRect.left - width + offset : subRect.left + subRect.width + offset;
      top = subRect.top + height + offset > vh 
        ? subRect.top - height + subRect.height + offset 
        : subRect.top - offset;
    } else {
      left = x + width + offset > vw ? vw - width - offset : x + offset;
      top = y + height + offset > vh ? vh - height - offset : y + offset;
    }    
    
    return {
      left: `${left}px`,
      top: `${top}px`,
    };
  }

  get className(): { [key: string]: boolean } {
    const { ns } = this;
    const { contextmenuClass = '' } = this.options || {}
    return {
      [ns.b()]: true,
      [contextmenuClass]: !!contextmenuClass
    };
  }

  handleContextMenuClick(e: MouseEvent) {
    e.stopPropagation();
  }
  handleContextMenuContextmenu(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  private getOffset(element: HTMLElement, left: number, top: number): {[key: string]: number} {
    const parent = element.offsetParent as HTMLElement
    if (!parent) {
      return {
        left,
        top,
      }
    }
    const { offsetLeft, offsetTop } = parent
    return this.getOffset(parent, left + offsetLeft, top + offsetTop)
  }

  handleItemClick(item: IMenu) {
    if (item.children && item.children.length > 0) return
    this.callback && this.callback(item);
    this.closeMenu.emit();
  }
  handleItemMouseOver(e: MouseEvent, item: T, index: number, itemIndex: number): void  {    
    const target = e.currentTarget as HTMLElement
    const { offsetLeft, offsetTop } = target
    const offset = this.getOffset(target, offsetLeft, offsetTop)
    this.subMenuRect = {
      left: offset['left'],
      top: offset['top'],
      width: target.clientWidth,
      height: target.clientHeight
    }
    this.hoverIndex = `${index}_${itemIndex}`
  }  
  onCloseMenu() {
    this.closeMenu.emit();
  }

  private readonly DEFAULT_ANIMATION: (AnimationStyleMetadata | AnimationAnimateMetadata)[] = [
    style({ opacity: 0, transform: 'rotateX(22deg)' }),
    animate('300ms', style({ opacity:1, transform: 'rotateX(0deg)' })),
  ]

  setInitialStyle(styles: { [key: string]: string | number }) {
    Object.keys(styles).forEach(property => {
      this.contextmenuRef.nativeElement.style[property] = styles[property];
    });
  }

  showMenu() {
    this.cdr.detectChanges()
    const { animation } = this.options || {}
    const animations = this.isSub ? this.DEFAULT_ANIMATION 
      : animation ? animation : this.DEFAULT_ANIMATION
    this.setInitialStyle(animations[0].styles as { [key: string]: string | number })
    const ani = this.animationBuilder.build(animations);
    const player = ani.create(this.contextmenuRef.nativeElement);
    this.contextmenuRef.nativeElement.style['pointer-events'] = 'none';
    player.play();   
    player.onDone(() => {
      this.contextmenuRef.nativeElement.style['pointer-events'] = '';
    })
  }
}