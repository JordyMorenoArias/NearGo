import { Component, AfterViewInit} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})

export class MapComponent  implements AfterViewInit {
  map: any;

  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap(){
    this.map = L.map('map').setView([19.05272, -70.14939], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([19.05272, -70.14939]).addTo(this.map)
    .bindPopup('You')
    .openPopup();

  }
}
