import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { ServersService } from '../../servers.service';
import { AuthService} from '../../auth/auth.service'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {  } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' }); //发送post请求头部
  public api = '/api/auth';
  validateForm: FormGroup;

  constructor(private fb: FormBuilder, public http: HttpClient, public router: Router, public server: ServersService, public AuthService: AuthService) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    let options = {
      api: this.api,
      params: this.validateForm.value
    }
    let postData = this.server.postRxjsData(options);
    postData.subscribe((data) => {
      //跳转主页
      this.router.navigate(['/posts/']);
      sessionStorage.setItem('token', data.token);
      this.AuthService.saveToken(data.token)
    })
  }
}
