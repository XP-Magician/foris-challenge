import formatted_commands from "./fileFormatter.js";
import { VALIDATOR_PRESENCE_DETAILS } from "../helpers/validators.js";
import ERROR_DICTIONARY from "../utils/errorsDictionary.js";

const presence_validator = async () => {
  try {
    const formatted_array = await formatted_commands();
    let students_presence = [];
    let discarded = formatted_array.Discarded;
    formatted_array.Student.forEach((student) => {
      // Delete the "Student" word because we already know that it's an student ID
      let student_id = student.split(" ")[1];
      students_presence[student_id] = [];
    });

    formatted_array.Presence.forEach((presence) => {
      let presence_details_raw = presence.split(" ");
      // Delete the "Presence" key word
      presence_details_raw.shift();
      /* Now we have something like : ['Marco','1','09:02','10:17', 'R100'] in that order because at this point we've already validated the
         data format and ignored the ones who didn't respect it*/
      let presence_details = {
        student_id: presence_details_raw[0],
        day: parseInt(presence_details_raw[1]),
        enter_hour: presence_details_raw[2],
        left_hour: presence_details_raw[3],
        room: presence_details_raw[4],
      };

      // This is going to return true if the presence_details is valid, or an informative String if it's not.
      const result_validation_presence = VALIDATOR_PRESENCE_DETAILS(
        students_presence,
        presence_details
      );
      if (result_validation_presence === true) {
        const { student_id, ...presence } = presence_details;
        students_presence[presence_details.student_id].push(presence);
      } else {
        discarded.push(
          presence +
            ERROR_DICTIONARY.INDICATOR_STRING +
            result_validation_presence
        );
      }
    });

    // These ones are going to be analized by a script in order to relationating students and presences
    const valid_entries = {
      Students: students_presence,
      Discarded: discarded,
    };
    return valid_entries;
  } catch (exception) {
    throw exception;
  }
};

export default presence_validator;
