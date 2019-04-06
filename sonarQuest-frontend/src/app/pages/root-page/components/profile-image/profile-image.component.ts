import { UserService } from './../../../../services/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { User } from 'app/Interfaces/User';
import { ImageService } from 'app/services/image.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss']
})
export class ProfileImageComponent implements OnInit {
  profileImage = null;
  @Input('user') set userSetter(userId: number) {
    if (userId) {
      this.loadProfileImage();
    }
  }

  constructor(private imageService: ImageService,
    private sanitizer: DomSanitizer, private userService: UserService) { }

  ngOnInit() {
  }

  loadProfileImage() {
    this.userService.getImage().subscribe(o => {
      const style = `url('data:image/jpeg;base64,${(o)}')`;
      this.profileImage = this.sanitizer.bypassSecurityTrustStyle(style);
    });
  }

}
