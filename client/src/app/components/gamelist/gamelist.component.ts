import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameListService } from 'src/app/services/game-list.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import * as jsPDF from 'jspdf'

@Component({
  selector: 'app-gamelist',
  templateUrl: './gamelist.component.html',
  styleUrls: ['./gamelist.component.css']
})
export class GamelistComponent implements OnInit {

  constructor(public _fb: FormBuilder, public router: Router, public _gls: GameListService, public _us: UserService) { }
  public ifLoggedIn = sessionStorage.getItem('token')
  public gameList: any = []
  public categories: any = []
  public userByID;
  public searchForm: FormGroup
  public orderForm: FormGroup
  public orderDetailsByID: any = []
  public carts: any = []
  public cartItems: any = []
  public cartByID;
  public total: number
  public errMessage: String
  public order: boolean
  public orderSucceed: boolean = false
  public cities: any = [
    { name: "Tel-Aviv" },
    { name: "Jerusalem" },
    { name: "Haifa" },
    { name: "Rishon-Lezion" },
    { name: "Petach-Tikva" },
    { name: "Ashdod" },
    { name: "Natanya" },
    { name: "Beer-Sheva" },
    { name: "Bnei-Brak" },
    { name: "Holon" }
  ]
  public opened = false
  public minDate;
  public maxDate;

  ngOnInit(): void {

    if (this.ifLoggedIn) {
      console.log('logged in')
      this.getAllGames()
      this.getAllCategories()
      this.getCartById()
      this.getUserByID()
      this.searchForm = this._fb.group({
        search: [""]
      })
      const currentYear = new Date().getFullYear();
      this.minDate = new Date(currentYear - 0, new Date().getMonth(), new Date().getDate() + 1);
      this.maxDate = new Date(currentYear + 1, 11, 31);
      this.orderForm = this._fb.group({
        user: ["", Validators.required],
        city: ["", [Validators.required, Validators.minLength(3)]],
        street: ["", [Validators.required, Validators.minLength(3)]],
        shipping_date: ["", Validators.required],
        credit_card: ["", Validators.required],
        order_price: [this.total, Validators.required],
        items: [this.cartItems, Validators.required]
      })
    }
    else {
      this.router.navigate(['/']);
    }
  }
  //Loguot
  public logout() {
    this._us.logout()
    sessionStorage.clear()
    console.log(sessionStorage.getItem('token'))
    this.router.navigate(['/']);
    this.ifLoggedIn = null
  }
  //Get All GameList
  public getAllGames() {
    this._gls.getAllGames().subscribe(
      data => {
        this.gameList = data
      },
      err => console.log(err)
    )
  }
  //Search for game
  public search() {
    if (this.searchForm.value.search !== "") {
      this._gls.search(this.searchForm.value).subscribe(
        data => this.gameList = data,
        err => console.log(err)
      )
    }
    else {
      this.getAllGames()
    }

  }
  //Search By Category
  public onChange(id) {
    this._gls.getByCategory(id).subscribe(
      data => this.gameList = data,
      err => console.log(err)
    )
  }
  //Open Cart
  public openCart() {
    const userID = sessionStorage.getItem('u_id')
    const newCart = { user: +userID, status: "open" }
    this._gls.openCart(newCart).subscribe(
      data => {
        this.carts = data
      },
      err => console.log(err)
    )
  }
  //Remove Cart 
  public removeCart() {
    const userID = sessionStorage.getItem('u_id')
    this._gls.removeCart(userID).subscribe(
      data => console.log(data),
      err => console.log(err)
    )
  }
  //Remove All CartItems 
  public clearCart() {
    this._gls.clearAllCartItems(this.cartByID).subscribe(
      data => this.getCartById(),
      err => console.log(err)
    )
  }
  //Get The specific User Cart By ID
  public getCartById() {
    const userID = sessionStorage.getItem('u_id')
    this._gls.getCartByID(userID).subscribe(
      data => {
        if (data[0] === undefined) {
          this.openCart()
          this.getCartById()
        }
        else if (data[0].status === "open") {
          sessionStorage.cart = JSON.stringify(data)
          this.cartByID = JSON.parse(sessionStorage.getItem("cart"))[0]._id
          this.getItemsByID()
        }
      }
    ),
      err => {
        console.log('err', err)
      }
  }
  //Add CartItem
  public addItemCart(g, quantity) {
    if (quantity == 0) {
      this.errMessage = "You must choose at least one product"
    }
    else {
      const newCartItem = { product: g._id, quantity: +quantity, total_price: quantity * g.price, cart: this.cartByID }
      console.log('find:', this.cartItems.find(i => i.product === g._id))
      this._gls.addCartItem(newCartItem).subscribe(
        data => this.getItemsByID(),
        err => console.log('err', err)
      )
    }
  }
  //Remove Specific cartItem
  public removeItem(id) {
    this._gls.removeCartItem(id).subscribe(
      data => this.getItemsByID(),
      err => console.log(err)
    )
  }
  //Get Item By Cart ID
  public getItemsByID() {
    const id = this.cartByID
    this._gls.getItemsByID(id).subscribe(
      data => {
        this.cartItems = data
        this.sumOfCartItems()
      },
      err => console.log(err)
    )
  }
  //Sum Of Cart  
  public sumOfCartItems() {
    let sum = 0
    for (let i = 0; i < this.cartItems.length; i++) {
      console.log(this.cartItems)
      sum += this.cartItems[i].total_price
    }
    this.total = sum
  }
  //Order Button
  public orderBtn() {
    const userID = sessionStorage.getItem('u_id')
    if (this.order === true) {
      this.order = false
    }
    else {
      this.order = true
      this.orderForm.setValue({
        user: userID,
        city: "",
        street: "",
        shipping_date: "",
        credit_card: "",
        order_price: this.total,
        items: this.cartItems
      })
    }
  }
  // Place Order
  public placeOrder() {
    this._gls.placeOrder(this.orderForm.value).subscribe(
      data => {
        this.orderByID()
        console.log('your order hes been successfully added:', data)
        this.orderSucceed = true
        this.order = false
        console.log('order:', this.order, 'orderSucceed:', this.orderSucceed)
      },
      err => console.log('err:', err)
    )
    //Remove All Cartitems By Cart ID
    this.clearCart()
  }
  public check() {
    console.log(this.orderForm.value)
  }
  //Get Order By ID
  public orderByID() {
    console.log('now its work')
    const userID = sessionStorage.getItem('u_id')
    this._gls.getOrderByID(userID).subscribe(
      data => this.orderDetailsByID = data,
      err => console.log('err:', err)
    )
  }
  //download PDF
  public downloadPDF() {
    const doc = new jsPDF()
    doc.setFont('courier')
    doc.setFontType('normal')
    doc.setFontSize(30)
    doc.text(45, 25, 'Receipt Of Payment')
    doc.setFontSize(10)
    doc.text(175, 10, `${this.orderDetailsByID[0].order_date.split('T')[0]}`)
    doc.text(175, 15, `${this.orderDetailsByID[0].order_date.split('T')[1].split('.')[0]}`)

    let margin = 0
    this.orderDetailsByID[0].items.forEach(i => {
      margin += 15
      doc.setFontSize(15)
      doc.text(45, 45 + margin, `${i.product.name} x ${i.quantity} - $${i.total_price}`)

    });
    doc.setFontSize(10)
    doc.text(45, 105, `Total: $${this.orderDetailsByID[0].order_price}`)
    doc.text(45, 125, `Shipping Address: ${this.orderDetailsByID[0].city}, ${this.orderDetailsByID[0].street}`)
    doc.text(45, 135, `Shipping Date: ${this.orderDetailsByID[0].shipping_date.split('T')[0]}`)
    doc.save()
  }
  //Side Bar
  public toggle() {
    if (this.opened) {
      this.opened = false
      console.log(this.opened)
    }
    else {
      this.opened = true
      console.log(this.opened)
    }
  }
  //Get User 
  public getUserByID() {
    const u_id = sessionStorage.getItem('u_id')
    this._us.getUsertByID(u_id).subscribe(
      data => {
        this.userByID = data
      }
    ),
      err => console.log(err)
  }
  //Inputs Auto Complete
  public autoComplete() {
    console.log(this.userByID[0].street)
    this.orderForm.setValue({
      street: this.userByID[0].street,
      city: this.userByID[0].city,
      shipping_date: "",
      credit_card: ""
    })
  }
  //Get All Categories
  public getAllCategories() {
    this._gls.getAllCategories().subscribe(
      data => this.categories = data,
      err => console.log(err)
    )
  }
}
