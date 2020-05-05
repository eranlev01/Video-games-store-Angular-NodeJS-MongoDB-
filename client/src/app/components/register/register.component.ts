import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public firstForm: FormGroup
  public secondForm: FormGroup
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
  public users: any = []
  public existUser = false

  public registerData: any = {}
  constructor(public _fb: FormBuilder, public _us: UserService) { }

  ngOnInit(): void {
    this.firstForm = this._fb.group({
      _id: [0, [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.minLength(3)]],
      password: ["", Validators.required],
      password_confirm: ["", Validators.required]
    })
    this.secondForm = this._fb.group({
      city: ["", [Validators.required, Validators.minLength(3)]],
      street: ["", [Validators.required, Validators.minLength(3)]],
      f_name: ["", Validators.required],
      l_name: ["", Validators.required]
    })
    this._us.getAllUsers().subscribe(
      data => {
        console.log(data)
        this.users = data
      },
      err => console.log(err)
    )
    this.secondForm.disable()
  }
  //Submit Form
  public sub() {
    const fullForm = { ...this.firstForm.value, ...this.secondForm.value }
    this._us.register(fullForm)
  }
  //Continue To Next Form
  public continue() {
    this._us.register(this.firstForm.value).subscribe(
      data => {
        this.registerData = data
        if (this.registerData.message._message === "users validation failed") {
          this.secondForm.enable()
          this.firstForm.disable()
        }
      },
      err => {
        if (err.error.text === "ID already exist") {
          this.existUser = true
        }
        else {
          console.log(err)
        }

      }
    )
  }


}
