import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';

import { LocationService } from 'src/app/services/location.service';
import { MapService } from 'src/app/services/map.service';
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
  places: Place[] = [];

  constructor (
    private locationService: LocationService,
    private mapService: MapService,
    private placesService: PlacesService
  ) {}

  async ngAfterViewInit() {
    try{
      const location = await this.locationService.getCurrentLocation();
      this.latitude = location.latitude
      this.longitude = location.longitude;

      this.mapService.initializeMap('map', this.latitude, this.longitude);
      this.loadNearbyPlaces();
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
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
      const popupText = `
        <b>${place.tags.name || 'Lugar desconocido'}</b><br>
        ${place.tags["addr:street"] || 'Dirección no disponible'}<br>
        Tipo: ${place.tags.shop || 'No especificado'}
      `;
      this.mapService.addMarker(place.lat, place.lon, popupText);
    });
  }
}
