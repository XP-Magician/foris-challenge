import {
  getStudentGroupResult,
  getRoomGroupResult,
  getTravelsGroupResult,
  getRoomNameResult,
} from "./tools/compiler.js";
import print from "./utils/logger.js";
import ERROR_DICTIONARY from "./utils/errorsDictionary.js";

// Must recibe a node param with the name of the file , for example : node app.js "myfile.txt" , you can change the default location to
// search the file in utils/config : COMMANDS_DIRECTORY constant.
const initialize = async () => {
  await print_presences_by_room();
  await print_travels_student();
  await print_filtered_roomname("LAB4");
  await print_presences_by_student();
  await print_discarded();
};

/************* PROCESSED PRINTERS ******************/
const print_presences_by_student = async () => {
  const { processed_presences } = await getStudentGroupResult();
  print_processed(processed_presences, ERROR_DICTIONARY.STUDENTS_GROUP_RESULT);
};

const print_presences_by_room = async () => {
  const { processed_room_presences } = await getRoomGroupResult();
  //prettier-ignore
  print_processed(processed_room_presences, ERROR_DICTIONARY.ROOMS_GROUP_RESULT);
};

const print_travels_student = async () => {
  const { travels_student_proccesed } = await getTravelsGroupResult();
  //prettier-ignore
  print_processed(travels_student_proccesed,ERROR_DICTIONARY.TRAVELS_GROUP_RESULT);
};

const print_filtered_roomname = async (roomname) => {
  const { processed_presences } = await getRoomNameResult(roomname);
  print_processed(processed_presences, ERROR_DICTIONARY.PRESENCES_BY_ROOMNAME);
};

/************ UTILS *************/
const print_processed = (processed, title) => {
  print(title, "INFO_TITLE");
  processed.length === 0
    ? print("NO RESULTS", "INDICATOR")
    : processed.forEach((stp) => print(`${stp}`, "TEXT"));
};

const print_discarded = async () => {
  const { discarded } = await getTravelsGroupResult(); // Every group returns the same discarded result

  //prettier-ignore
  print(ERROR_DICTIONARY.DISCARDED_COMMAND_SEPARATOR, "WARN_TITLE");
  //prettier-ignore
  discarded.forEach(dsc => print(`${dsc.command_discarded} ${ERROR_DICTIONARY.ARROW_STRING} ${dsc.reason_discarded}`,"INDICATOR"));
};

// Uti
initialize();
