import readFile from "./fileReader.js";
import ERROR_DICTIONARY from "../utils/errorsDictionary.js";
import { VALIDATORS } from "../helpers/validators.js";

export const getFile = async (filename) => {
  try {
    if (filename === undefined)
      throw new Error(ERROR_DICTIONARY.FILENAME_NOT_PROVIDED);
    const raw_array_commands = await readFile(filename);
    const raw_commands_filter = raw_array_commands.filter(
      (raw_command) => raw_command.trim() !== ""
    );
    const formatted_commands = await formatFile(raw_commands_filter);
    return formatted_commands;
  } catch (exception) {
    throw exception;
  }
};

const getFileBinder = async () => {
  return await getFile(process.argv[2]);
};

export const formatFile = async (raw_commands) => {
  try {
    let formatted_commands = {
      Student: [],
      Presence: [],
      Discarded: [],
    };
    raw_commands.forEach((raw_command) => {
      let raw_command_trim = raw_command.trimEnd().trimStart();
      switch (true) {
        // It's a student type command
        case VALIDATORS.STUDENT_COMMAND.test(raw_command_trim):
          if (!formatted_commands.Student.includes(raw_command_trim))
            formatted_commands.Student.push(raw_command_trim);
          break;

        // It's a presence type command
        case VALIDATORS.PRESENCE_COMMAND.test(raw_command_trim):
          if (!formatted_commands.Presence.includes(raw_command_trim))
            formatted_commands.Presence.push(raw_command_trim);
          break;

        // It's an invalid input, goes to Discarded ones
        default:
          formatted_commands.Discarded.push(
            raw_command +
              ERROR_DICTIONARY.INDICATOR_STRING +
              ERROR_DICTIONARY.INVALID_COMMAND_FORMAT
          );
          break;
      }
    });
    return formatted_commands;
  } catch (exception) {
    throw exception;
  }
};

export default getFileBinder;
