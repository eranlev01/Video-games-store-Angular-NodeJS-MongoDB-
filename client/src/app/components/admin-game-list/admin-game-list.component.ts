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
      console.log('You Are not an admin')
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
    console.log(sessionStorage.getItem('token'))
    this.router.navigate(['/']);
    this.ifLoggedIn = null
  }
  //Side Bar
  public toggle() {
    if (this.opened) {
      this.opened = false
      this.addAction = false
      this.editAction = false
      console.log(this.opened)
      console.log( 'here:',this.addAction, 
        this.editAction )
    }
    else {
      this.opened = true
      console.log(this.opened)
    }
  } 
  //Apply Changes
  public editSub(){
    this._gls.edit(this.form.value, this.game_id).subscribe(
      data => {
        this.gameList = data
        console.log(this.gameList)
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
    console.log(g_name)
    this.form.setValue ({
      name : g_name,
      category: g_categoryId,
      price: g_price,
      productImage: g_productImage
    })
    this.game_id = g_id
    console.log(this.form.value, g_id)
  }
  //Add Game
  public add(): void {
    const fd: any = new FormData();
    fd.append('productImage', this.selectedFile, this.selectedFile.name);
    //fd.append('typeOfUser', user.typeOfUser);
    fd.append('name', this.form.value.name);
    fd.append('category', this.form.value.category);
    fd.append('price', this.form.value.price);
    console.log('fs:', fd)
    for (var p of fd) {
      console.log('p:', p);
    }
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
    console.log(event.target.files[0])
    console.log(this.selectedFile)
    this.selectedFile = event.target.files[0]
    this.form.setValue ({
      name : formValue.name,
      category: formValue.category,
      price: formValue.price,
      productImage: this.selectedFile.name
    })
    console.log(this.form.value)
    
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
