import presenceValidator from "./presenceValidator.js";
import { VALIDATORS } from "../helpers/validators.js";
import { DateTime } from "luxon";
import ERROR_DICTIONARY from "../utils/errorsDictionary.js";

const compileCommands = async () => {
  try {
    // At this point we could pick these data an put them into a database because it's sanitize and validate.
    let { students_presence, discarded } = await presenceValidator();
    let processed_presences = [];
    Object.keys(students_presence).forEach((student_id) => {
      switch (true) {
        case students_presence[student_id].length === 0:
          processed_presences.push(`${student_id}: 0 minutes`);
          break;
        default:
          let different_days = [];
          let minutes_presence = 0;
          let student_presences = students_presence[student_id];
          student_presences.forEach((presence) => {
            minutes_presence += calculateDays(
              presence,
              different_days,
              minutes_presence
            );
          });
          let day_text = different_days.length > 1 ? "days" : "day";
          processed_presences.push(
            `${student_id}: ${minutes_presence} minutes in ${different_days.length} ${day_text}`
          );
          break;
      }
    });
    console.log(ERROR_DICTIONARY.MINUTES_DISPLAY);
    processed_presences.forEach((presence) => console.log(presence));
    console.log(ERROR_DICTIONARY.DISCARDED_COMMAND_SEPARATOR);
    console.log(
      discarded.length === 0
        ? ERROR_DICTIONARY.NO_DISCARDED_COMMANDS
        : discarded
    );
  } catch (exception) {
    console.log(exception.message);
  }
};

// We use calculateDays as a helper to get the difference in minutes and whether the days are more than one or not
const calculateDays = (student_presence, different_days) => {
  let { day, enter_hour, left_hour } = student_presence;
  if (!different_days.includes(day)) different_days.push(day);
  enter_hour = DateTime.fromISO(enter_hour);
  left_hour = DateTime.fromISO(left_hour);
  const minutes_presence =
    (left_hour.toMillis() - enter_hour.toMillis()) /
    VALIDATORS.MILIS_TO_MINUTES;
  return minutes_presence;
};

compileCommands();