import readFile from "./fileReader.js";
import ERROR_DICTIONARY from "../utils/errorsDictionary.js";
import { VALIDATORS } from "../helpers/validators.js";
import { Discarded } from "../entities/Discarded.js";

// We get the raw commands_file and separate each one into a String type array for differentiating them and discarding the invalid ones
export const getFile = async (filename) => {
  try {
    if (filename === undefined)
      throw new Error(ERROR_DICTIONARY.FILENAME_NOT_PROVIDED);
    const raw_array_commands = await readFile(filename);
    const raw_commands_filter = raw_array_commands.filter(
      (raw_command) => raw_command.trim() !== ""
    );
    const extracted_commands = await commandsExtractor(raw_commands_filter);
    return extracted_commands;
  } catch (exception) {
    throw exception;
  }
};

// Here we are separating each commands into their respective type
export const commandsExtractor = async (raw_commands) => {
  try {
    let extracted_commands = {
      Student: [],
      Presence: [],
      Clasroom: [],
      Discarded: [],
    };
    raw_commands.forEach((raw_command) => {
      let raw_command_trim = raw_command.trimEnd().trimStart();
      switch (true) {
        // It's a student type command
        case VALIDATORS.STUDENT_COMMAND.test(raw_command_trim):
          if (!extracted_commands.Student.includes(raw_command_trim))
            extracted_commands.Student.push(raw_command_trim);
          break;

        // It's a presence type command
        case VALIDATORS.PRESENCE_COMMAND.test(raw_command_trim):
          if (!extracted_commands.Presence.includes(raw_command_trim))
            extracted_commands.Presence.push(raw_command_trim);
          break;

        // It's a classroom type comamnd
        case VALIDATORS.CLASSROOM_COMMAND.test(raw_command_trim):
          if (!extracted_commands.Clasroom.includes(raw_command_trim))
            extracted_commands.Clasroom.push(raw_command_trim);
          break;

        // It's an invalid input, goes to Discarded ones with the representative entity
        default:
          extracted_commands.Discarded.push(
            new Discarded(raw_command, ERROR_DICTIONARY.INVALID_COMMAND_FORMAT)
          );
          break;
      }
    });
    return extracted_commands;
  } catch (exception) {
    throw exception;
  }
};

// Provide  the filename to read for working on it
const getFileBinder = async () => {
  return await getFile(process.argv[2]);
};

export default getFileBinder;
