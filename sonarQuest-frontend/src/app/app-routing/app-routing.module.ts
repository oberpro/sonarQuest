import { AdminPageComponent } from './../pages/admin-page/admin-page.component';
import { MarketplacePageComponent } from '../pages/marketplace-page/marketplace-page.component';
import { QuestPageComponent } from './../pages/quest-page/quest-page.component';
import { AdventurePageComponent } from '../pages/adventure-page/adventure-page.component';
import { StartPageComponent } from './../pages/start-page/start-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAvatarPageComponent } from '../pages/my-avatar-page/my-avatar-page.component';
import { GamemasterPageComponent } from '../pages/gamemaster-page/gamemaster-page.component';
import { AuthenticationGuard } from '../login/authentication.guard';
import { RoutingUrls } from './routing-urls';
import { RootPageComponent } from 'app/pages/root-page/root-page.component';
import { LoginPageComponent } from 'app/pages/login-page/login-page.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/app/start', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  {
    path: 'app', component: RootPageComponent, canActivate: [AuthenticationGuard],canActivateChild:[AuthenticationGuard], children: [
      { path: 'start', component: StartPageComponent },
      { path: RoutingUrls.myAvatar, component: MyAvatarPageComponent },
      { path: RoutingUrls.adventures, component: AdventurePageComponent },
      { path: RoutingUrls.quests, component: QuestPageComponent },
      { path: RoutingUrls.marketplace, component: MarketplacePageComponent },
      { path: RoutingUrls.gamemaster, component: GamemasterPageComponent },
      { path: RoutingUrls.admin, component: AdminPageComponent },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
