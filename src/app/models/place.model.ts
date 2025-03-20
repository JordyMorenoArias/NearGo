export class Place {
    type: string;
  id: number;
  lat: number;
  lon: number;
  tags: {
    "addr:street"?: string;
    name?: string;
    shop?: string;
  };

  constructor(data: any) {
    this.type = data.type;
    this.id = data.id;
    this.lat = data.lat;
    this.lon = data.lon;
    this.tags = {
      "addr:street": data.tags?.["addr:street"],
      name: data.tags?.name,
      shop: data.tags?.shop
    };
  }
}