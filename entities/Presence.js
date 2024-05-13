import { DateTime } from "luxon";
import ERROR_DICTIONARY from "../utils/errorsDictionary.js";
import { VALIDATORS } from "../helpers/validators.js";
// New entity class added for making the whole process more flexible
export class Presence {
  constructor(room, student_id, enter_hour, left_hour, day) {
    this.room = room;
    this.student_id = student_id;
    this.enter_hour = enter_hour;
    this.left_hour = left_hour;
    this.day = day;
    this.minutes = this.calculateMinutes(enter_hour, left_hour);
  }

  // Used for calculating the presence minutes according to the enter and left hour
  calculateMinutes(enter_hour_raw, left_hour_raw) {
    const enter_hour = DateTime.fromISO(enter_hour_raw);
    const left_hour = DateTime.fromISO(left_hour_raw);
    const minutes_presence =
      (left_hour.toMillis() - enter_hour.toMillis()) /
      VALIDATORS.MILIS_TO_MINUTES;
    return minutes_presence;
  }

  getPresence() {
    return {
      room: this.room,
      minutes: this.minutes,
      student_id: this.student_id,
      enter_hour: this.enter_hour,
      left_hour: this.left_hour,
      day: this.day,
    };
  }

  isValidPresence(list_students, list_classrooms) {
    const presence_to_verify = this.getPresence();
    let student_was_registered = false;
    let classroom_was_registered = false;
    list_students.forEach((student_object) => {
      // Student was previously registered?
      if (student_object.student_id === presence_to_verify.student_id) {
        student_was_registered = true;
        return;
      }
    });
    list_classrooms.forEach((classroom_object) => {
      if (classroom_object.room_code === presence_to_verify.room) {
        classroom_was_registered = true;
        return;
      }
    });
    let { enter_hour, left_hour } = presence_to_verify;
    enter_hour = DateTime.fromISO(enter_hour);
    left_hour = DateTime.fromISO(left_hour);
    //Enter_hour is fewer than left_hour ?
    if (left_hour < enter_hour)
      return ERROR_DICTIONARY.ENTER_GREATHER_THAN_LEFT;

    // Presence is at least of 5 minutes ?
    if (left_hour.toMillis() - enter_hour.toMillis() < VALIDATORS.MIN_DIFF_TIME)
      return ERROR_DICTIONARY.DIFF_NOT_ENOUGH;

    // Last validation to check whether the student and classroom details were registered or not
    return student_was_registered
      ? classroom_was_registered
        ? true
        : ERROR_DICTIONARY.CLASSROM_DETAILS_NOT_PROVIDED
      : ERROR_DICTIONARY.STUDENT_NOT_REGISTERED;
  }
}
