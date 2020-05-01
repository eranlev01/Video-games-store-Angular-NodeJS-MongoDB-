import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from "@angular/common/http";
import { UserService } from "./user.service";
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  
  public token = sessionStorage.getItem('token')

  constructor(public injector:Injector) { }

  intercept(req, next) {
    let authService = this.injector.get(UserService)
    let tokenizedReq = req.clone({
      setHeaders: {
        authorization: `${authService.getToken()}`
      }
    })
    return next.handle(tokenizedReq)
  }
}
