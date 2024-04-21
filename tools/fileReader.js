// Imports and dependencies
import fs from "node:fs/promises";
import path from "node:path";
import CONFIG from "../utils/config.js";
import ERROR_DICTIONARY from "../utils/errorsDictionary.js";

// Methods
const readFile = async (file_name) => {
  try {
    const file_extension = path.extname(file_name);
    if (CONFIG.ALLOWED_EXTENSIONS.includes(file_extension)) {
      const commands_file = await fs.readFile(
        path.join(CONFIG.COMMANDS_DIRECTORY, file_name),
        CONFIG.CHARSET
      );
      const raw_array_commands = commands_file.split(CONFIG.NEXT_LINE);
      return raw_array_commands;
    } else {
      throw new Error(ERROR_DICTIONARY.EXT_NOT_ALLOWED);
    }
  } catch (exception) {
    if (exception.message !== ERROR_DICTIONARY.EXT_NOT_ALLOWED)
      throw new Error(ERROR_DICTIONARY.FILE_NOT_FOUND);
    throw exception;
  }
};

export default readFile;
