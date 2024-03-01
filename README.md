# angular-contextmenu

## Installation
```bash
npm i @yyyymmddhhmmss/angular-contextmenu
```

## Usage
```js
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { style, animate } from '@angular/animations'; 
import { 
  ContextmenuDirective, 
  IMenu, 
  IContextmenuOptions 
} from '@yyyymmddhhmmss/angular-contextmenu';

interface IAppContextMenu extends IMenu {
  id: number;
  children?: IAppContextMenu[][];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ContextmenuDirective],
  template: `
    <style>
      .container {
        display: flex; 
        justify-content: center;
        padding: 200px 50px; 
        background: #fffaaa;
      }
      span {
        background: #f00;
        padding: 12px;
      }
    </style>
    <div class="container"
      contextmenu 
      [menus]="menus"
      [callback]="callback"
      [options]="options"
    >
      <span
        contextmenu
        [menus]="menus"
        [callback]="callback"
      >hello angular</span>
    </div>
  `
})
export class AppComponent {
  menus: IAppContextMenu[][] = [];
  options: IContextmenuOptions = {};
  
  constructor() {
    this.menus = [
      [
        { id: 1, name: '打开', code: 'open', icon: '/assets/javascript.svg' },
        { id: 2, name: '刷新', code: 'refresh' },
      ],
      [
        { 
          id: 3, name: '新建', 
          code: 'new',
          children: [
            [
              { id: 31, name: '文件夹', code: 'folder' },
              {
                id: 32, name: '文件', code: 'file',
                children: [
                  [
                    { id: 321, name: '文本', code: 'text' },
                    { id: 322, name: '图片', code: 'image' },
                    { id: 323, name: '视频', code: 'video' },
                    { id: 324, name: '音频', code: 'audio' },
                  ]
                ]
              }
            ]
          ]
        },
      ]
    ];
    this.options = {
      animation: [
        style({ opacity: 0, transform: 'scale(1.6) translate3d(60px, -30px, 0) rotate(22deg)' }),
        animate('300ms', style({ opacity:1, transform: 'scale(1) translate3d(0, 0, 0) rotate(0deg)' })),
      ],
      contextmenuClass: 'custom-contextmenu'
    };
  }
  
  callback(item: IAppContextMenu) {
    console.log('callback', item);
  }
}
```
