import { 
  AnimationStyleMetadata, 
  AnimationAnimateMetadata 
} from '@angular/animations';  

export interface IMenu {
  name: string;
  code: string;
  icon?: string;
  children?: IMenu[][];
}

export interface ISubRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface IContextmenuOptions {
  contextmenuClass?: string;
  animation?: (AnimationStyleMetadata | AnimationAnimateMetadata)[];
}