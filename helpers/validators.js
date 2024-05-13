export const VALIDATORS = {
  STUDENT_COMMAND: /^Student [\w]+$/, // Format should be like : Student Diego
  PRESENCE_COMMAND:
    /^Presence [\w]+ [1-7] ((0[8-9])?(1[0-9])?(2[0-3])?:([0-5][0-9]\s)){2}[A-Z]\d{3}$/, // Format should be like : Presence David 3 10:58 12:05 R205
  CLASSROOM_COMMAND: /^Classroom [A-Z]\d{3} [a-zA-Z0-9]+ (\d{2}\.\d\s?){2}$/, // Format should be like: Classroom R500 LAB1 15.2 10.5
  MIN_DIFF_TIME: 300000, // 5 Minutes min to register the attendance (in milis)
  MILIS_TO_MINUTES: 60000,
};
