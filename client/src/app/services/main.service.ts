import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(public http: HttpClient) { }
  //Get All Users
  public getAllUsers(){
    return this.http.get('http://localhost:1001/api/users')
  }
  //Get User By ID
  public getUsertByID(id){
    console.log('id from service:', id)
    return this.http.get(`http://localhost:1001/api/users/${id}`)
  }
  // Number Of Whole Orders From History 
  public getNumOfAllOrders(){
    return this.http.get('http://localhost:1001/api/orders')
  }
}
