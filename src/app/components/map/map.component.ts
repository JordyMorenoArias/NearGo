import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { PlacesService } from 'src/app/services/places.service';
import { Place } from 'src/app/models/place.model';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})

export class MapComponent implements AfterViewInit {
  latitude: number = 0;
  longitude: number = 0;
  map: any;
  marker: any;
  places: Place[] = [];

  constructor(private placesService: PlacesService) {}

  async ngAfterViewInit() {
    await this.getLocation();
    this.loadMap();
    this.loadNearbyPlaces();
  }

  async getLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log('Ubicación actual:', this.latitude, this.longitude);
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
    }
  }

  loadMap() {
    if (!this.map) {
      this.map = L.map('map').setView([this.latitude, this.longitude], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      const customIcon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      this.marker = L.marker([this.latitude, this.longitude], { icon: customIcon }).addTo(this.map)
        .bindPopup('Tu ubicación')
        .openPopup();
    } else {
      this.map.setView([this.latitude, this.longitude], 15);
      this.marker.setLatLng([this.latitude, this.longitude]);
    }
  }

  loadNearbyPlaces() {
    this.placesService.getNearbyPlaces(this.latitude, this.longitude, 5000).subscribe(
      (data) => {
        this.places = data;
        this.addPlaceMarkers();
      },
      (error) => {
        console.error('Error al obtener lugares:', error);
      }
    );
  }

  addPlaceMarkers() {
    this.places.forEach(place => {
      const placeIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      L.marker([place.lat, place.lon], { icon: placeIcon })
        .addTo(this.map)
        .bindPopup(`
          <b>${place.tags.name || 'Lugar desconocido'}</b><br>
          ${place.tags["addr:street"] || 'Dirección no disponible'}<br>
          Tipo: ${place.tags.shop || 'No especificado'}
        `);
    });
  }
}
