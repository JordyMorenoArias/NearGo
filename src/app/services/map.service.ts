import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map: any;
  private marker: any;

  initializeMap(containerId: string, latitude: number, longitude: number): void {
    if (!this.map) {
      this.map = L.map(containerId).setView([latitude, longitude], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.addMarker(latitude, longitude, 'Tu ubicación', true);
    } else {
      this.setView(latitude, longitude);
    }
  }

  setView(latitude: number, longitude: number): void {
    if (this.map) {
      this.map.setView([latitude, longitude], 15);
      if (this.marker) {
        this.marker.setLatLng([latitude, longitude]);
      }
    }
  }

  addMarker(lat: number, lon: number, popupText: string, isUser: boolean = false): void {
    const iconUrl = isUser
      ? 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png'
      : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';

    const icon = L.icon({
      iconUrl,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.marker = L.marker([lat, lon], { icon }).addTo(this.map).bindPopup(popupText);
  }
}
