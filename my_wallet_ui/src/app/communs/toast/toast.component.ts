import { Component } from "@angular/core";
import { ToastService } from "./toast.service";

@Component({
  selector: 'app-toasts',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']

})
export class ToastComponent {
  constructor(public toastService: ToastService) { }
}