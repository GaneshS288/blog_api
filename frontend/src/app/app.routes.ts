import { Routes } from '@angular/router';
import { Signup } from './pages/signup/signup';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: Home, title: 'Homepage' },
  {
    path: 'signup',
    component: Signup,
    title: 'Signup',
  },
  {
    path: "login",
    component: Login,
    title: "Login"
  }
];
