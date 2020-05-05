import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameListService {
  public token = sessionStorage.getItem('token')

  constructor(public http: HttpClient) { }
  //Get All Games
  public getAllGames() {
    return this.http.get('http://localhost:1001/api/products')
  }
  //Get All Categories
  public getAllCategories() {
    return this.http.get('http://localhost:1001/api/categories')
  }
  // Add Game (Admin)
  public addGame(body) {
    return this.http.post(`http://localhost:1001/api/products`, body)
  }
  //Edit Game (Admin)
  public edit(body, g_id) {
    return this.http.put(`http://localhost:1001/api/products/${g_id}`, body)
  }
  //Search For Game By Name
  public search(name) {
    return this.http.get('http://localhost:1001/api/products/products-by-name/' + name.search)
  }
  //Select By Category
  public getByCategory(category) {
    return this.http.get('http://localhost:1001/api/products/' + category)
  }
  //Open New Cart
  public openCart(body) {
    return this.http.post(`http://localhost:1001/api/carts`, body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
    })
  }
  //Remove Cart By User ID
  public removeCart(userID) {
    return this.http.delete(`http://localhost:1001/api/carts/${userID}`)
  }
  //Remove All Items From Cart By Cart ID
  public clearAllCartItems(cartID) {
    return this.http.delete(`http://localhost:1001/api/cartitem/by-cart/${cartID}`)
  }
  //Get Cart By User ID
  public getCartByID(id) {
    return this.http.get(`http://localhost:1001/api/carts/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
    })
  }
  //Get Items By Cart ID
  public getItemsByID(id) {
    return this.http.get(`http://localhost:1001/api/cartItem/${id}`)
  }
  //Add New Item To Cart
  public addCartItem(body) {
    return this.http.post(`http://localhost:1001/api/cartitem`, body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
    })
  }
  //Remove Item From Cart
  public removeCartItem(id) {
    return this.http.delete(`http://localhost:1001/api/cartItem/${id}`)
  }
  //Continue To Place Order
  public placeOrder(body) {

    return this.http.post(`http://localhost:1001/api/orders`, body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
    })
  }
  public getOrderByID(id) {
    return this.http.get(`http://localhost:1001/api/orders/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
    })
  }
  //Get PDF receipt
  public getReceipt() {
    return this.http.get('http://localhost:1001/api/orders/fetch-pdf', {
      responseType: 'blob'
    })
  }
  //Get Available Dates For Delivery
  // public availableDates(date) {
  //   return this.http.get(`http://localhost:1001/api/orders/dates/${date}`, {
  //     headers: { 'Content-Type': 'application/json' },
  //     responseType: 'json'
  //   })
  // }
}
