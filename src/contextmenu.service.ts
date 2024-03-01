import { Injectable } from '@angular/core';
import { ContextmenuDirective } from './contextmenu.directive';
import { IMenu, IContextmenuOptions } from './contextmenu.interface';
import { ContextmenuComponent } from './contextmenu.component';

@Injectable({
  providedIn: 'root'
})

export class ContextMenuManagerService<T extends IMenu> {
  private currentContextMenuInstance: ContextmenuDirective<T> | null = null;
  private visible: boolean = false;
  
  public show(instance: ContextmenuDirective<T>, 
    x: number, 
    y: number, 
    menus: T[][], 
    callback?: (menu: T) => void,
    options?: IContextmenuOptions
  ): void {
    this.close();
    const componentRef = instance.viewContainerRef.createComponent(ContextmenuComponent);
    componentRef.instance.x = x;
    componentRef.instance.y = y;
    componentRef.instance.menus = menus;
    componentRef.instance.callback = callback as any;
    componentRef.instance.options = options;
    componentRef.instance.closeMenu.subscribe(
      () => this.close()
    );
    instance.componentRef = componentRef;
    instance.clickListener = instance.renderer.listen('document', 'click', 
      () => {
        this.close();
      }
    );

    this.currentContextMenuInstance = instance;
    this.visible = true;
  }
  
  public close() {
    this.visible = false;
    if (!this.currentContextMenuInstance) return
    if (this.currentContextMenuInstance.componentRef) {
      this.currentContextMenuInstance.componentRef.destroy();
    }    
    if (this.currentContextMenuInstance.clickListener) {
      this.currentContextMenuInstance.clickListener();
      this.currentContextMenuInstance.clickListener = undefined;
    } 
  }
}