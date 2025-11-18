import { Routes } from '@angular/router';
import { HomepageComponent } from './components/System/homepage/homepage.component';
import { NotfoundComponent } from './components/System/notfound/notfound.component';
import { RefSiteComponent } from './components/Fivem/ref-site/ref-site.component';
import { RefEsxComponent } from './components/Fivem/ref-esx/ref-esx.component';
import { RefQbcoreComponent } from './components/Fivem/ref-qbcore/ref-qbcore.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  {
    path: 'fivem',
    component: RefSiteComponent
  },
  {
    path: 'fivem/esx',
    component: RefEsxComponent
  },
  {
    path: 'fivem/qbcore',
    component: RefQbcoreComponent
  },
  {
    path: '**',
    component: NotfoundComponent,
    data: { title: '404 - Oldal nem található' }
  }
];
