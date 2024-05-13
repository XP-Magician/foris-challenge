// Class for handling the Travel of a student within a specific day
import { DateTime } from "luxon";
export class Travel {
  constructor(room, enter_hour, day) {
    this.room = room;
    this.enter_hour = DateTime.fromISO(enter_hour);
    this.day = day;
  }

  getTravel() {
    return {
      room: this.room,
      enter_hour: this.enter_hour,
      day: this.day,
    };
  }
}
