export const VALIDATORS = {
  STUDENT_COMMAND: /^Student [\w]+$/, // Format should be like : Student Diego
  PRESENCE_COMMAND:
    /^Presence [\w]+ [1-7] ((0[8-9])?(1[0-9])?(2[0-3])?:([0-5][0-9]\s)){2}[A-Z]\d{3}$/, // Format should be like : Presence David 3 10:58 12:05 R205
  MIN_DIFF_TIME: 300000, // 5 Minutes min to register the attendance (in milis)
  MILIS_TO_MINUTES: 60000,
  EXTRACT_MINUTES_FROM_STR: /\d+\sminutes/, // Match the final processed minutes, not just digits for not matching the ammount of days
};
