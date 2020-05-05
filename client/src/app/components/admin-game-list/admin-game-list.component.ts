import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameListService } from 'src/app/services/game-list.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-admin-game-list',
  templateUrl: './admin-game-list.component.html',
  styleUrls: ['./admin-game-list.component.css']
})
export class AdminGameListComponent implements OnInit {

  constructor(public _fb: FormBuilder, public router:Router, public _gls:GameListService, public _us:UserService) { }

  public ifLoggedIn = sessionStorage.getItem('token')
  public ifAdmin = JSON.parse(sessionStorage.getItem('isAdmin')) 
  public gameList : any = [] 
  public categories : any = []
  public form: FormGroup
  public game_id = 0
  public opened = false
  public selectedFile : File = null;
  public addAction = false
  public editAction = false
  
  ngOnInit(): void {
   
    if(this.ifLoggedIn && this.ifAdmin){
      this.getAllgames()
      this.getAllCategories()
    }
    else{
      this.router.navigate(['/']);
    }
   
    this.form = this._fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      category: [0, Validators.required],
      price: ["", Validators.required],
      productImage: [File],
    })
  }
   //Loguot
   public logout() {
    this._us.logout()
    sessionStorage.clear()
    this.router.navigate(['/']);
    this.ifLoggedIn = null
  }
  //Side Bar
  public toggle() {
    if (this.opened) {
      this.opened = false
      this.addAction = false
      this.editAction = false
    }
    else {
      this.opened = true
    }
  } 
  //Apply Changes
  public editSub(){
    this._gls.edit(this.form.value, this.game_id).subscribe(
      data => {
        this.gameList = data
      },
      err => {
        console.log(err)
      }
    )
  }
  //Edit Icon
  public editBtn(g_id, g_name, g_categoryId, g_price, g_productImage){
    this.opened = true
    this.editAction = true
    this.form.setValue ({
      name : g_name,
      category: g_categoryId,
      price: g_price,
      productImage: g_productImage
    })
    this.game_id = g_id
  }
  //Add Game
  public add(): void {
    const fd: any = new FormData();
    fd.append('productImage', this.selectedFile, this.selectedFile.name);
    fd.append('name', this.form.value.name);
    fd.append('category', this.form.value.category);
    fd.append('price', this.form.value.price);
    this._gls.addGame(fd)
      .subscribe(
        addedProduct => {
          alert("Product has been successfully added. ID:" + addedProduct);
        },
        err => {
          alert(err.error);
        }
      )
  }
  //On Picture Selected 
  public onFileSelected(event , formValue){
    this.selectedFile = event.target.files[0]
    this.form.setValue ({
      name : formValue.name,
      category: formValue.category,
      price: formValue.price,
      productImage: this.selectedFile.name
    })
  }
  //Plus Icon
  public plusBtn(){
    this.addAction = true
    this.opened = true
  }
  //Get All Games
  public getAllgames(){
    this._gls.getAllGames().subscribe(
      data => this.gameList = data,
      err =>console.log(err)
    )
  }
  //Get All Categories
  public getAllCategories(){
    this._gls.getAllCategories().subscribe(
      data => this.categories = data,
      err => console.log(err)
    )
  }

}
