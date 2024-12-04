import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-pager',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './pager.component.html',
  styleUrl: './pager.component.scss'
})
export class PagerComponent implements OnInit{
  @Input() totalCount = 0;
  @Input() pageSize = 6;
  @Output() pageChanged = new EventEmitter<number>();

  ngOnInit(): void {
  }

  onPagerChange(event: any)
  {
    this.pageChanged.emit(event.page);
  }

}
