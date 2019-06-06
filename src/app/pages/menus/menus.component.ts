
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServersService } from '../../servers.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.less']
})
export class MenusComponent implements OnInit {
  // api
  public api_list = '/api/menuManage/list'; // 页面数据列表api
  public api_add = '/api/menuManage/add'; // 新增行api
  public api_update = '/api/menuManage/update'; // 更新行api
  public api_delete = '/api/menuManage/delete'; // 删除行api
  public api_upload = environment.API + '/upload';

  public menuType = ''; //菜单名称
  public menuId = ''; //菜单id
  public isVisible = false; //默认显示modal
  public modalTitle: any = '新增菜单'; //model title
  public menus = [];  //菜单类型列表
  //列表相关数据
  public displayData: any = []; //存储列表数据
  public isLoading = false; //用于加载效果
  public Page = 1;          //初始页码
  public Rows = 10;         //显示行数
  public total = 1;         //总条数
  public Sord = null;       //正反序
  public OrderBy = null;    //排序字段
  public loading = true;    //开启加载
  public Sidx = '0';
  public colData = [];
  //modal 参数
  public isOkLoading = false;
  validateForm: FormGroup; //表单

  constructor(public activeRouter: ActivatedRoute, public server: ServersService, private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]], //菜单名称
      link:[null, [Validators.required]], //菜单链接
      serial: [null], //菜单排序
      target: [null], //是否打开新窗口
    });
  }

  ngOnInit() {
    this.getMenus()
  }
  //获取菜单列表
  getMenus() {
    const options: any = {
      api: this.api_list,
      params: {}
    }
    this.server.getRxjsData(options).subscribe((data) => {
      this.displayData = data.data;
    })
  }
  //搜索列表
  //搜索事件
  searchData(keyword?, reset: boolean = false): void {
    this.isLoading = true;
    if (reset) {
      this.Page = 1;
    }
    this.loading = true;
    this.getList(keyword, this.Page, this.Rows, this.Sidx).subscribe((data: any) => {
      this.loading = false;
      this.total = data.total;
      this.colData = data.data;
      this.displayData = [...this.colData];
      this.isLoading = false;
    });
  }
  getList(keyword, pageIndex: number = 1, pageSize: number = 10, Sidx): Observable<{}> {
    let params: any = {}
    params.name = keyword ? keyword : '';
    params.type = this.menuType;
    if (this.Page) {
      params.Page = this.Page;
    }
    if (this.Rows) {
      params.Rows = this.Rows;
    }
    if (this.Sidx) {
      params.Sidx = this.Sidx;
    }
    if (this.Sord) {
      params.Sord = this.Sord;
    }
    let options = {
      api: this.api_list,
      params: params
    }
    return this.server.getRxjsData(options);
  }
  //编辑和新增弹框
  showModal(): void {
    this.menuId = '';
    this.isVisible = true;
    this.resetForm();
  }
  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  //表单重置
  resetForm(): void {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }
  //保存表单数据
  submitForm(value): void {
    let paramsObj: any = value
    if (this.menuId) {
      paramsObj.id = this.menuId;
    }
    const options: any = {
      api: paramsObj.id ? this.api_update : this.api_add,
      params: paramsObj
    }
    let postData = this.server.postRxjsData(options);
    postData.subscribe((data) => {
      this.isVisible = false;
      this.getMenus();
    })
  }
  //删除数据 
  deleteRow(value): void {
    const options = {
      api: this.api_delete + '/' + value._id,
    }
    let postPremissionData = this.server.postRxjsData(options);
    postPremissionData.subscribe(() => {
      this.searchData();
    });
  }
  //修改行
  updateRow(value): void {
    this.menuId = value._id;
    //初始化表单值
    let initformData = new Observable<any>((observer) => {
      this.validateForm.setValue({ name: value.name, link: value.link, serial: value.serial, target: value.target });
      observer.next();
    })
    initformData.subscribe(() => {
      this.isVisible = true;
    })
  }
}