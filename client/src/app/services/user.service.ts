import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http: HttpClient) { }
  public logged:boolean
  public logout(){
    this.logged = false
  }
  public login(body){
    this.logged = true
    return this.http.post('http://localhost:1001/api/users/login', body, {
      headers:{'Content-Type':'application/json'},
      responseType: 'json'
    })
  }
  public getAllUsers(){
    return this.http.get('http://localhost:1001/api/users')
  }
  public getUsertByID(id){

    return this.http.get(`http://localhost:1001/api/users/${id}`)
  }
  public register(body){
    return this.http.post('http://localhost:1001/api/users/', body, {
      headers:{'Content-Type':'application/json'},
      responseType: 'json'
    })
  }
  public getNumOfAllOrders(){
    return this.http.get('http://localhost:1001/api/orders')
  }
  public getToken(){
    return sessionStorage.getItem('token')
  }
  public getDoc(){
    return this.http.get('http://localhost:1001/api/doc')
  }
}
