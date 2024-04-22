import { DateTime } from "luxon";
import ERROR_DICTIONARY from "../utils/errorsDictionary.js";

export const VALIDATORS = {
  STUDENT_COMMAND: /^Student [\w]+$/, // Format should be like : Student Diego
  PRESENCE_COMMAND:
    /^Presence [\w]+ [1-7] ((0[8-9])?(1[0-9])?(2[0-3])?:([0-5][0-9]\s)){2}[A-Z]\d{3}$/, // Format should be like : Presence David 3 10:58 12:05 R205
  MIN_DIFF_TIME: 300000, // 5 Minutes min to register the attendance (in milis)
};

export const VALIDATOR_PRESENCE_DETAILS = (
  students_list,
  presence_to_verify
) => {
  if (!students_list.includes(presence_to_verify.student_id))
    return ERROR_DICTIONARY.STUDENT_NOT_REGISTERED;
  let { enter_hour, left_hour } = presence_to_verify;
  enter_hour = DateTime.fromISO(enter_hour);
  left_hour = DateTime.fromISO(left_hour);
  if (left_hour < enter_hour) return ERROR_DICTIONARY.ENTER_GREATHER_THAN_LEFT;
  if (left_hour.toMillis() - enter_hour.toMillis() < VALIDATORS.MIN_DIFF_TIME)
    return ERROR_DICTIONARY.DIFF_NOT_ENOUGH;
  return true;
};
