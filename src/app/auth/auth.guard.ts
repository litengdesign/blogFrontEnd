import { ServersService } from '../servers.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
@Injectable({
    providedIn: 'root',
})

export class AuthGuard implements CanActivate {
    constructor(public router: Router, public server: ServersService, public msg: NzMessageService, public authService: AuthService ) {
    }
    canActivate() {
        if (!sessionStorage.getItem('token') || this.authService.token != sessionStorage.getItem('token')) {
            this.router.navigate(['/login/']);
        }
        return true;
    }
}
