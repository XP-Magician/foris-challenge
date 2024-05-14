import extracted_commands from "./commandsExtractor.js";
import { Discarded } from "../entities/Discarded.js";
import { Presence } from "../entities/Presence.js";
import { Students } from "../entities/Students.js";
import { Classroom } from "../entities/Classroom.js";

/* Now we are separating and saving each raw_command into a JSON descriptive object with the entities (Student, Presences, Discarded)
  with classes and descriptive objects
*/
export const presence_constructor = async (extracted_commands) => {
  try {
    const students = [];
    const presences = [];
    const classrooms_details = [];
    const discarded = extracted_commands.Discarded;

    extracted_commands.Student.forEach((student) => {
      // Delete the "Student" word because we already know that it's an student ID and construct the Object array with Students
      let student_id = student.split(" ")[1];
      students.push(new Students(student_id));
    });

    // Extract every Classroom command and format them}
    extracted_commands.Classroom.forEach((classroom) => {
      let classroom_command_raw = classroom.split(" ");
      /* Now we have something like : ['R100','LAB1','17.1','10.2'] in that order because at this point we've already validated the
         data format and ignored the ones who didn't respect it, so now we extract each property to an Classroom type object*/
      classroom_command_raw.shift();
      let room_code = classroom_command_raw[0];
      let room_name = classroom_command_raw[1];
      let lat = classroom_command_raw[2];
      let long = classroom_command_raw[3];
      const classroom_formatted = new Classroom(
        room_code,
        room_name,
        lat,
        long
      );
      classrooms_details.push(classroom_formatted);
    });

    extracted_commands.Presence.forEach((presence) => {
      let presence_details_raw = presence.split(" ");
      presence_details_raw.shift();
      /* Now we have something like : ['Marco','1','09:02','10:17', 'R100'] in that order because at this point we've already validated the
         data format and ignored the ones who didn't respect it, so now we extract each property to an Presence type object*/
      let student_id = presence_details_raw[0];
      let day = parseInt(presence_details_raw[1]);
      let enter_hour = presence_details_raw[2];
      let left_hour = presence_details_raw[3];
      let room = presence_details_raw[4];
      const presence_formatted = new Presence(
        room,
        student_id,
        enter_hour,
        left_hour,
        day
      );
      // This is going to return true if the presence_details is valid, or an informative String if it's not.
      const validation_presence_result = presence_formatted.isValidPresence(
        students,
        classrooms_details
      );
      if (validation_presence_result === true) {
        presences.push(presence_formatted);
      } else {
        discarded.push(new Discarded(presence, validation_presence_result));
      }
    });

    // These ones are going to be analized by a script in order to relationating students and presences
    return { students, presences, classrooms_details, discarded };
  } catch (exception) {
    throw exception;
  }
};

const presence_constructor_binder = async () => {
  const extracted_commands_result = await extracted_commands();
  const entities_constructed = await presence_constructor(
    extracted_commands_result
  );
  return entities_constructed;
};

export default presence_constructor_binder;
