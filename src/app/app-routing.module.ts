import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from '../app/pages/products/products.component';
import { PostsComponent } from '../app/pages/posts/posts.component';
import { CategorysComponent } from '../app/pages/categorys/categorys.component';
import { LoginComponent} from './pages/login/login.component';
import { DefaultComponent} from '../app/layout/default/default.component';
import { AuthGuard } from '../app/auth/auth.guard';
import { MenusComponent } from './pages/menus/menus.component';




const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      { 
        path: '', redirectTo: 'dashboard', pathMatch: 'full' ,
        data:{
          breadcrumb:'产品列表'
        }
      },
      { path: 'dashboard', component: ProductsComponent ,
        data: {
          breadcrumb: '产品列表'
        }
      },
      { path: 'products', component: ProductsComponent ,
        data: {
          breadcrumb: '产品列表'
        }
      },
      { path: 'posts', component: PostsComponent ,
        data: {
          breadcrumb: '文章列表'
        }
      },
      { path: 'categorys', component: CategorysComponent,
        data: {
          breadcrumb: '产品分类'
        }
      },
      { path: 'brand', component: CategorysComponent,
        data: {
          breadcrumb: '品牌列表'
        }
       },
      {
        path: 'menus', component: MenusComponent,
        data: {
          breadcrumb: '导航管理'
        }
      },
      
    ],
    canActivate: [AuthGuard]
    
  },
  { path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
