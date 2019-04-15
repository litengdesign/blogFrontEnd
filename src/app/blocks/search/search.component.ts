import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {
  @Output('search') searchFtn = new EventEmitter<any>();
  @Output('add') addFtn = new EventEmitter<any>();
  public isLoading: boolean = false;
  public keyword = '';
  constructor() { }

  ngOnInit() {
  }
  //搜索方法
  search() {
    this.isLoading = true;
    this.searchFtn.emit(this.keyword);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
  //新增方法
  add() {
    this.addFtn.emit();
  }
}
