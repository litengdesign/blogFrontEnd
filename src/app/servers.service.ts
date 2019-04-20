import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class ServersService {
  configUrl = environment.API;
  public api_category = '/api/categoryManage/list'
  public token =''
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient, private msg: NzMessageService) { }
  getSystemName(){
    return "内容管理系统"
  }
  //通过rxjs获取数据
  getRxjsData(options) {
    return new Observable<any>((observer) => {
      this.http.get(this.configUrl + options.api, { params: options.params }).subscribe((response: any) => {
        if (response.status !== 0) {
          observer.next(response);
        } else {
          return false;
        }
      })
    })
  }
  //post提交数据
  postRxjsData(options) {
    return new Observable<any>((observer) => {
      this.http.post(environment.API + options.api, JSON.stringify(options.params), { headers: this.headers }).subscribe(
        (response: any) => {
          this.msg.info(response.message);
          if (response.status) {
            observer.next(response);
          } else {
            return false;
          }
        },
        (error) => {
          if (error.status == 400 || error.status == 404) {
            this.msg.info(error.error)
          } else {
            this.msg.info('操作成功！');
            observer.next();
          }
        }
      );
    });
  }
  //获取应用程序列表
  getCategory(type) {
    //获取应用程序列表
    let options = {
      api: this.api_category,
      params: {
        type: type
      }
    }
    return new Observable<any>((observer) => {
      this.getRxjsData(options).subscribe((data) => {
        //数据处理成可识别的下拉数据
        let array = [];
        data.data.forEach(element => {
          let obj: any = {
            value: element._id,
            label: element.name,
            id: element._id,
          }
          array.push(obj)
        });
        observer.next(array);
      })
    })

  }
}
