// Class for representating every classroom command
export class Classroom {
  constructor(room_code, room_name, lat, long) {
    this.room_code = room_code;
    this.room_name = room_name;
    this.lat = lat;
    this.long = long;
  }

  getClassDetails() {
    return {
      room_code: this.room_code,
      room_name: this.room_name,
      lat: this.lat,
      long: this.long,
    };
  }
}
