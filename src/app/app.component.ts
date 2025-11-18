import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageComponent } from './components/System/message/message.component';
import { FooterComponent } from './components/System/footer/footer.component';
import { HeaderComponent } from './components/System/header/header.component';
import { NavbarComponent } from './components/System/navbar/navbar.component';
import { LoadingOverlayComponent } from './components/System/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavbarComponent, FooterComponent, MessageComponent, LoadingOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'NovyxDev';
}
