import { VALIDATOR_PRESENCE_DETAILS } from "../helpers/validators";
// New entity class added for making the whole process more flexible
export class Presence {
  // constructor for defining the Presence

  constructor(room, minutes, student_id, enter_hour, left_hour) {
    this.room = room;
    this.minutes = minutes;
    this.student_id = student_id;
    this.enter_hour = enter_hour;
    this.left_hour = left_hour;
  }

  getPresence() {
    return {
      room: this.room,
      minutes: this.minutes,
      student_id: this.student_id,
      enter_hour: this.enter_hour,
      left_hour: this.left_hour,
    };
  }

  /* See if the presence is valid according to :
   *Student was previously registered
   *Presence is at least of 5 minutes
   *Enter_hour is fewer than left_hour
   */
  isValidPresence(list_students) {
    return VALIDATOR_PRESENCE_DETAILS(list_students, this.getPresence());
  }
}
