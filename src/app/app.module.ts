import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NavComponent } from './blocks/nav/nav.component';
import { PremissionComponent } from './blocks/premission/premission.component';
import { SearchComponent } from './blocks/search/search.component';
import { LoginComponent } from './pages/login/login.component';
import { DefaultComponent } from './layout/default/default.component';
import { ProductsComponent } from './pages/products/products.component';
import { CategorysComponent } from './pages/categorys/categorys.component';
import { PostsComponent } from './pages/posts/posts.component'
import { FileUploadModule } from 'ng2-file-upload';
import { CKEditorModule } from 'ng2-ckeditor';
import { MenusComponent } from './pages/menus/menus.component';
registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    PremissionComponent,
    SearchComponent,
    LoginComponent,
    DefaultComponent,
    ProductsComponent,
    CategorysComponent,
    PostsComponent,
    MenusComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FileUploadModule,
    CKEditorModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent]
})
export class AppModule {

}

