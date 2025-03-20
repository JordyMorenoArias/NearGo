import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Place } from '../models/place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private overpassUrl = "https://overpass-api.de/api/interpreter";

  constructor(private http: HttpClient) {}

  getNearbyPlaces(lat: number, lon: number, radius: number): Observable<Place[]> {
    const query = `[out:json];
    (
      node(around:${radius},${lat},${lon})["name"];
      node(around:${radius},${lat},${lon})["amenity"];
      node(around:${radius},${lat},${lon})["shop"];
      node(around:${radius},${lat},${lon})["leisure"];
      node(around:${radius},${lat},${lon})["tourism"];
      node(around:${radius},${lat},${lon})["building"];
    );
    out body;
  `;
  
    const url = `${this.overpassUrl}?data=${encodeURIComponent(query)}`;

    return this.http.get<any>(url).pipe(
      map(response => response.elements.map((item: any) => new Place(item)))
    );
  }
}
