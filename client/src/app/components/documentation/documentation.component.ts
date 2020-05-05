import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {

  constructor(public router: Router, public _us: UserService) { }

  public doc;

  ngOnInit(): void {
    this.getDoc()
  }

  public getDoc(){
    this._us.getDoc().subscribe(
      data => this.doc = data,
      err => console.log(err)
    )
  }

}
