import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { GameListService } from 'src/app/services/game-list.service';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public cartItems: any = []
  public cartByID;
  public total: number
  public form: FormGroup
  public newData: any = {}
  public ifLoggedIn: String
  public isAdmin: Boolean
  public firstName: String
  public errMessage: string
  public allOrders: any = []
  public productList: any = []

  constructor(public _fb: FormBuilder, public router: Router, public _us: UserService, public dialog: MatDialog, public _gls: GameListService) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      email: ["", [Validators.required, Validators.minLength(3)]],
      password: ["", Validators.required],
    })
    this.ifLoggedIn = sessionStorage.getItem('token')
    this.isAdmin = (sessionStorage.getItem('isAdmin') === "true")
    this.firstName = sessionStorage.getItem('name')
    if (this.ifLoggedIn) {
      this.getCartById()
      this.getItemsByID()
    }
    this.GetAllOrders()
    this.getAllGames()
  }
  //Get All GameList
  public getAllGames() {
    this._gls.getAllGames().subscribe(
      data => {
        this.productList = data
      },
      err => console.log(err)
    )
  }
  //Get The specific User Cart By ID
  public getCartById() {
    const userID = sessionStorage.getItem('u_id')
    this._gls.getCartByID(userID).subscribe(
      data => {
        if (data[0] === undefined) {
          console.log('stop')
        }
        else {
          sessionStorage.cart = JSON.stringify(data)
          this.cartByID = JSON.parse(sessionStorage.getItem("cart"))[0]._id
          this.getItemsByID()
        }
      }
    ),
      err => {
        console.log(err)
      }
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
      sum += this.cartItems[i].total_price
    }
    this.total = sum
  }
  //Sign In
  public sub() {
    this._us.logged = true
    this._us.login(this.form.value).subscribe(
      data => {
        this.newData = data
        const f_name = this.newData.user[0].f_name
        sessionStorage.name = f_name
        this.firstName = f_name
        sessionStorage.token = this.newData.token
        const admin = this.newData.user[0].isAdmin
        this.isAdmin = admin
        sessionStorage.isAdmin = admin
        const u_id = this.newData.user[0]._id
        sessionStorage.u_id = u_id
        this.ifLoggedIn = sessionStorage.getItem('token')
        this.getCartById()
        this.getItemsByID()
      },
      err => {
        const error = err
        this.errMessage = error.error
      }
    )
  }
  //login Validate
  public loginValid() {
    if (this.ifLoggedIn) {
      return false
    }
    else {
      return true
    }
  }
  //Start Shopping Button
  public startShop() {
    if (this.isAdmin) {
      this.router.navigate(['game-list/admin']);
    }
    else {
      this.router.navigate(['game-list/user']);
    }
  }
  //Register
  public register() {
    this.router.navigate(['/register']);
  }
  //Number Of All Orders From History
  public GetAllOrders() {
    this._us.getNumOfAllOrders().subscribe(
      data => {
        this.allOrders = data
      },
      err => console.log(err)
    )
  }
  //Open Cart Dialog
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { name: this.firstName, openItems: this.cartItems, isAdmin: this.isAdmin }
    });

    dialogRef.afterClosed()
  }

}

export interface DialogData {
  openItems: string;
  name: string;
  ifLoggedIn: string;
  startShop: any
  isAdmin: string
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})

export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public router: Router) { }

  public isAdmin: any = this.checkIfAdmin();
  onStartShop(): void {
    this.dialogRef.close();
    if (this.isAdmin) {
      this.router.navigate(['game-list/admin']);
    }
    else {
      this.router.navigate(['game-list/user']);
    }
  }
  public checkIfAdmin() {
    if (sessionStorage.getItem('token') === 'false') {
      return false
    }
    else if (sessionStorage.getItem('token') === 'true') {
      return true
    }
  }

}

