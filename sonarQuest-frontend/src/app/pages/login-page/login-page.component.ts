import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/login/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username:new FormControl('',[Validators.required]),
    password:new FormControl('',[Validators.required])
  });
  loading = false;
  error = false;

  constructor(private authService: AuthenticationService,private router:Router) {
  }

  ngOnInit() {
  }

  onSubmit() {
    if(this.form.valid){
      this.loading = true;
      this.error = false;
      this.authService.login(this.form.value.username, this.form.value.password).then(_result=>{
        this.loading = false;
        this.router.navigate(['/app/myAvatar']);
      }).catch(_error=>{
        this.loading = false;
        this.error = true;
      });
    }
  }

}
