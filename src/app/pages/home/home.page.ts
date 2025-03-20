import { Component } from '@angular/core';

import { MapComponent } from 'src/app/components/map/map.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [MapComponent],
})

export class HomePage {
  constructor() {}

}
