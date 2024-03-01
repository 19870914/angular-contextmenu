import { Directive, HostListener } from '@angular/core';
import { Input } from '@angular/core';
import { ViewContainerRef, ComponentRef, Renderer2 } from '@angular/core';
import { ContextmenuComponent } from './contextmenu.component';
import{ IMenu, IContextmenuOptions } from './contextmenu.interface';
import { ContextMenuManagerService } from './contextmenu.service'

@Directive({
  selector: '[contextmenu]',
  standalone: true
})
export class ContextmenuDirective<T extends IMenu> {  
  @Input() menus: T[][] = [];
  @Input() callback?: (menu: T) => void;
  @Input() options?: IContextmenuOptions;

  public componentRef!: ComponentRef<ContextmenuComponent<IMenu>>;
  public clickListener: (() => void) | undefined = undefined;
 
  constructor(
    public viewContainerRef: ViewContainerRef,
    public renderer: Renderer2,
    private contextMenuManagerService: ContextMenuManagerService<T>
  ) {

  }

  @HostListener('contextmenu', ['$event'])
  onContextmenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const { clientX, clientY } = event;

    this.contextMenuManagerService.show(
      this, 
      clientX, clientY, 
      this.menus, this.callback, this.options
    );
  }
}