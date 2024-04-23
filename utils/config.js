import path from "node:path";
import os from "node:os";

const config = {
  COMMANDS_DIRECTORY: path.join("commands"),
  ALLOWED_EXTENSIONS: [".txt"],
  NEXT_LINE: os.EOL,
  CHARSET: "utf8",
};

export default config;
