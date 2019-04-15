import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServersService } from '../../servers.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { environment } from '../../../environments/environment';
import { FileUploader } from 'ng2-file-upload';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
@Component({
  selector: 'app-categorys',
  templateUrl: './categorys.component.html',
  styleUrls: ['./categorys.component.less']
})
export class CategorysComponent implements OnInit {
  // api
  public api_list = '/api/categoryManage/list'; // 页面数据列表api
  public api_add = '/api/categoryManage/add'; // 新增行api
  public api_update = '/api/categoryManage/update'; // 更新行api
  public api_delete = '/api/categoryManage/delete'; // 删除行api
  public api_upload = environment.API +'/upload';

  public categoryType = ''; //分类名称
  public categoryId = ''; //分类id
  public isVisible = false; //默认显示modal
  public modalTitle: any = '新增分类'; //model title
  public categorys = [];  //分类类型列表
  //列表相关数据
  public displayData:any = []; //存储列表数据
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
  previewImage = '';
  previewVisible = false;
  public fileList = []; //上传文件存储列表
  public editFileList = []; //编辑文件列表
  
  constructor(public activeRouter: ActivatedRoute, public server: ServersService, private fb: FormBuilder) { 
    this.validateForm = this.fb.group({
      categoryName: [null, [Validators.required]], //分类名称
    });
  }

  ngOnInit() {
    //获取router
    this.activeRouter.queryParams.subscribe((params) => {
      this.categoryType = params['type']
    });
    this.getCategorys()
  }
  //获取分类列表
  getCategorys(){
    const options: any = {
      api: this.api_list,
      params: {
        type: this.categoryType
      }
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
    params.type = this.categoryType;
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
    this.categoryId = '';
    this.isVisible = true;
    this.fileList = [];
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
  submitForm(value):void{
    let paramsObj: any = {
      name: value.categoryName,
      type: this.categoryType,
      thumb:[]
    }

    this.fileList.forEach(element => {
      if (element.response) {
        paramsObj.thumb.push({
          uid: element.uid,
          url: element.response.path
        });
      } else {
        paramsObj.thumb.push({
          uid: element.uid,
          url: element.responseUrl
        });
      }
    });
    if(this.categoryId){
      paramsObj.id = this.categoryId;
    }
    const options: any = {
      api: paramsObj.id?this.api_update:this.api_add,
      params: paramsObj
    }
    let postData = this.server.postRxjsData(options);
    postData.subscribe((data)=>{
      this.isVisible = false;
      this.getCategorys();
    })
  }
  //删除数据 
  deleteRow(value):void {
    const options = {
      api: this.api_delete +'/'+ value._id,
    }
    let postPremissionData = this.server.postRxjsData(options);
    postPremissionData.subscribe(() => {
      this.searchData();
    });
  }
  //修改行
  updateRow(value):void{
    this.categoryId = value._id;
    this.fileList = [];
    value.thumb.forEach(item => {
      let obj = {
        uid: item.uid,
        responseUrl: item.url,
        url: environment.API + '/' + item.url,
      }
      this.fileList.push(obj);
    })

    //初始化表单值
    let initformData = new Observable<any>((observer) => {
      this.validateForm.setValue({ categoryName: value.name });
      observer.next();
    })
    initformData.subscribe(() => {
      this.isVisible = true;
    })
  }
  //图片预览
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
}