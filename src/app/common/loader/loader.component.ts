import { Component } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [NgIf],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
isLoading = false;

  constructor(private coreService: CoreService) {}

  ngOnInit(): void {
    this.coreService.isLoading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }
}
