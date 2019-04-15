import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ServersService} from '../../servers.service'
import { environment } from '../../../environments/environment';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less']
})

export class ProductsComponent implements OnInit {
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  @ViewChild("myckeditor") ckeditor: any;
  //列表数据
  isVisible = false;
  //model
  public modalTitle='新增'
  public validateForm: FormGroup; //表单
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
  //api
  public api_upload = environment.API + '/upload';
  public api_list = '/api/productsManage/list'; // 页面数据列表api
  public api_add = '/api/productsManage/add'; // 新增行api
  public api_update = '/api/productsManage/update'; // 更新行api
  public api_delete = '/api/productsManage/delete'; // 删除行api
  public productId = '';

  //存储数据
  public previewImage = '';
  public previewVisible = false;
  public fileList = []; //上传文件存储列表
  public editFileList = []; //编辑文件列表
  public categorys = [];
  public brands = [];

  constructor(private fb: FormBuilder, public server: ServersService) {
    this.mycontent = `请输入内容`;
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      description:[null],
      content: [null],
      category: [null,Validators.required],
      brand: [null, Validators.required],
      priceMonth:[null, Validators.required],
      status: [null],
      isTop: [null],
    });
   }

  ngOnInit() {
    //初始化编辑器
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
    //获取产品分类
    this.server.getCategory('product').subscribe((data) => {
      this.categorys = data;
    })
    //brand
    this.server.getCategory('brand').subscribe((data) => {
      this.brands = data;
    })
    //获取产品列表
    this.getProducts();
  }
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
  //获取分类列表
  getProducts() {
    const options: any = {
      api: this.api_list,
    }
    this.server.getRxjsData(options).subscribe((data) => {
      this.displayData = data.data;
    })
  }
  //编辑和新增弹框
  showModal(): void {
    this.productId = '';
    this.mycontent = '';
    this.fileList = [];
    this.resetForm();
    this.isVisible = true;
  }
  //表单重置
  resetForm(): void {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }
  //编辑行
  editRow(item) {
    this.resetForm();
    this.productId = item._id;
    this.fileList = [];
    item.thumb.forEach(item => {
      let obj = {
        uid: item.uid,
        responseUrl: item.url,
        url: environment.API +'/'+ item.url,
      }
      this.fileList.push(obj);
    })
    let selectCategory = null;
    let selectBrand = null;
    this.categorys.forEach((element)=>{
      if (element.id == item.category.id){
        selectCategory = element
      }
    })
    this.brands.forEach((element) => {
      if (element.id == item.brand.id) {
        selectBrand = element
      }
    })
    //初始化表单值
    let initformData = new Observable<any>((observer) => {
      this.mycontent = item.content;
      this.validateForm.setValue({ name: item.name, status: item.status, isTop: item.isTop, description: item.description, content: item.content, category: selectCategory, brand: selectBrand, priceMonth: item.priceMonth });
      observer.next();
    })
    initformData.subscribe(() => {
      this.isVisible = true;
      this.modalTitle = '编辑';
    })
  }
  //保存表单数据
  submitForm(value): void {
    let paramsObj: any = value
    paramsObj.thumb = [];
    paramsObj.content = this.mycontent;
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
    if (this.productId) {
      paramsObj.id = this.productId;
    }
    const options: any = {
      api: this.productId ? this.api_update:this.api_add,
      params: paramsObj
    }
    let postData = this.server.postRxjsData(options);
    postData.subscribe((data) => {
      this.isVisible = false;
      this.getProducts();
    })
  }
  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  //删除数据 
  deleteRow(value): void {
    const options = {
      api: this.api_delete,
      params:{
        id: value._id
      }
    }
    let postPremissionData = this.server.postRxjsData(options);
    postPremissionData.subscribe(() => {
      this.searchData();
    });
  }
  //图片预览
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
}
