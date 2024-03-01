import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewportService {
  private vwSubject = new BehaviorSubject<number>(document.documentElement.clientWidth);
  private vhSubject = new BehaviorSubject<number>(document.documentElement.clientHeight);

  vw$ = this.vwSubject.asObservable();
  vh$ = this.vhSubject.asObservable();

  constructor() {
    window.addEventListener('resize', () => {
      this.vwSubject.next(document.documentElement.clientWidth);
      this.vhSubject.next(document.documentElement.clientHeight);
    });
  }
}