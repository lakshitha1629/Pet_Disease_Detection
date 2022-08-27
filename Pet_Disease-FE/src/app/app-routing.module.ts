import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './layout/about/about.component';
import { HomeComponent } from './layout/home/home.component';
import { DetectDisorderComponent } from './features/detect-disorder/detect-disorder.component';
import { HealthSupporterComponent } from './features/health-supporter/health-supporter.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'detect-disorder',
    component: DetectDisorderComponent,
  },
  {
    path: 'health-supporter',
    component: HealthSupporterComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
