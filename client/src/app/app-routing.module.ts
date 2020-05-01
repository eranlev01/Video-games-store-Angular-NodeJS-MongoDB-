import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { RegisterComponent } from './components/register/register.component';
import { GamelistComponent } from './components/gamelist/gamelist.component';
import { AdminGameListComponent } from './components/admin-game-list/admin-game-list.component';


const routes: Routes = [
  {path:"game-list/admin", component:AdminGameListComponent},
  {path:"game-list/user", component:GamelistComponent},
  {path:"register", component:RegisterComponent},
  {path:"", pathMatch:"full", component: MainComponent},
  {path:"**", redirectTo:""}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
