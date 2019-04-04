import { Component, OnInit } from '@angular/core';
import { User } from 'app/Interfaces/User';
import { Router } from '@angular/router';
import { PermissionService } from 'app/services/permission.service';
import { UserService } from 'app/services/user.service';
import { ImageService } from 'app/services/image.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root-page',
  templateUrl: './root-page.component.html',
  styleUrls: ['./root-page.component.scss']
})
export class RootPageComponent implements OnInit {
  user: User = null;
  profileImage = null;
  allowedEntries = [];
  navigationEntries = [{
    icon: 'home',
    title: 'Home',
    path: '/start',
    permission:'start'
  },
  {
    icon: 'face',
    title: 'Avatar',
    path: '/myAvatar',
    permission:'myAvatar'
  },
  {
    icon: 'rowing',
    title: 'Adventures',
    path: '/adventures',
    permission:'adventures'
  },
  {
    icon: 'theaters',
    title: 'Quests',
    path: '/quests',
    permission:'quests'
  },
  {
    icon: 'local_grocery_store',
    title: 'Marketplace',
    path: '/marketplate',
    permission:'marketplace'
  }, {
    icon: 'near_me',
    title: 'Gamemaster',
    path: '/gamemaster',
    permission:'gamemaster'
  },
  {
    icon: 'settings',
    title: 'Admin',
    path: '/admin',
    permission:'admin'
  }];


  navigateToNavEntry(item) {
    this.router.navigate(['/app' + item.path]);
  }

  constructor(
    public router: Router,
    private permissionService: PermissionService,
    private userService: UserService,
    private imageService:ImageService,
    private sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.userService.getUser().then(user => {
      this.user = user;
      this.userService.getImage().subscribe(o=>{
       this.imageService.createImageFromBlob(o).subscribe(i=>{
        this.profileImage = this.sanitizer.bypassSecurityTrustStyle(`url('${i}')`);
        });
      })
    }).catch(_error => { });
    this.permissionService.getPermissions().then(permission=>{
      this.allowedEntries = this.navigationEntries.filter(item=>permission.includes(item.permission));
    });
  }


}

