const ERROR_DICTIONARY = {
  EXT_NOT_ALLOWED:
    "The extension of the file is not allowed, you must send an admitted file.",
  FILENAME_NOT_PROVIDED: "You didn't provide the filename to work on.",
  FILE_NOT_FOUND: "The file doesn't exist in the current commands directory.",
  STUDENT_NOT_REGISTERED:
    "The presence must have a registered student with 'Student' command before. ",
  DIFF_NOT_ENOUGH:
    "The presence isn't valid because it's fewer than five minutes.",
  ENTER_GREATHER_THAN_LEFT:
    "The presence isn't valid because the enter time is greather than the left time.",
  INVALID_COMMAND_FORMAT:
    "The command don't have a valid format, check your entries carefully.",
  INDICATOR_STRING: "     -----------> Reason: ",
  DISCARDED_COMMAND_SEPARATOR:
    "\n\n ==================== DISCARDED COMMANDS =======================",
  NO_DISCARDED_COMMANDS: "No discarded commands\n\n ",
};

export default ERROR_DICTIONARY;
