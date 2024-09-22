import { Injectable, TemplateRef } from '@angular/core';
import { ToastInfo } from './toastInfo';

@Injectable({ providedIn: 'root' })
export class ToastService {

  showDanger(text: string) {
    this.show(text, { className: 'bg-danger text-light', delay: 5000 });
  }
  
  showInfo(text: string) {
    this.show(text);
  }
  
  showSuccess(text: string) {
    this.show(text, { className: 'bg-success text-light', delay: 5000 });
  }
  
  toasts: ToastInfo[] = [];

  show(text: string, options: any = {}) {
    
    this.toasts.push({ text, ...options });
  }
  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => t != toast);
  }
}