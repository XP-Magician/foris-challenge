import Compiler from "./tools/commandsCompiler.js";

// Must recibe a node param with the name of the file , for example : node app.js "myfile.txt" , you can change the default location to
// search the file in utils/config : COMMANDS_DIRECTORY constant.
const initialize = async () => await Compiler();
initialize();
