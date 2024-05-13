import { groupByStudent, groupByRoom, groupByTravel } from "./groupers.js";
import config from "../utils/config.js";
import ERROR_DICTIONARY from "../utils/errorsDictionary.js";
// Make a reusable method for calculating final minutes and days presences, no matter the group clause
const genericStudentResult = (student_presences, student_id) => {
  let total_minutes = 0;
  let different_days = [];
  let processed_presence_string = `${student_id} : `;
  if (student_presences.length === 0) {
    // Means that the student presence total time is 0
    processed_presence_string += `0 minutes`;
    return processed_presence_string;
  } else {
    // Means that the student presence total time is more than 0
    student_presences.forEach((presence) => {
      total_minutes += presence.minutes;
      different_days.includes(presence.day)
        ? different_days
        : different_days.push(presence.day);
    });
    // Construct the final result with the descriptive String
    processed_presence_string += `${total_minutes} minutes in ${different_days.length} `;
    processed_presence_string += different_days.length == 1 ? "day" : "days";
    return processed_presence_string;
  }
};

export const getStudentGroupResult = async () => {
  const { student_presences, discarded } = await groupByStudent();
  const processed_presences = []; // It's going to contain something like : ['David: 104 minutes in 1 day',...]

  // Make the necessary final calculations
  const individual_student_presences = Object.keys(student_presences);
  individual_student_presences.forEach((student) => {
    const student_all_presences = student_presences[student];
    processed_presences.push(
      genericStudentResult(student_all_presences, student)
    );
  });
  return processed_presences;
};

export const getRoomGroupResult = async () => {
  const { room_presences, discarded } = await groupByRoom();
  const processed_room_presences = []; // It's going to contain something like : [R100: 'David: 104 minutes in 1 day',...]

  // Get each individual room
  const individual_room_presences = Object.keys(room_presences);
  individual_room_presences.forEach((room) => {
    let room_processed_string = `${room} :${config.NEXT_LINE}  `;
    // Get each Student presence in a single room
    const student_pressences_by_room = Object.keys(room_presences[room]);
    student_pressences_by_room.forEach((student_presence) => {
      const all_student_presences = room_presences[room][student_presence];
      // Calculate every student presence time according to the room provided
      room_processed_string += genericStudentResult(
        all_student_presences,
        student_presence
      );
      room_processed_string += `${config.NEXT_LINE}  `;
    });
    // After calculating each Student presence Time into the specific room, we append the result to the final processed_room_presences
    processed_room_presences.push(room_processed_string);
  });

  return processed_room_presences;
};

export const getTravelsGroupResult = async () => {
  let { travels_student, discarded } = await groupByTravel();
  const travels_student_proccesed = []; // It's going to contain something like : Marco : F101->R902->...

  // First we sort the travels in order : day -> enter_hour
  let travels_student_keys = Object.keys(travels_student);
  travels_student_keys.forEach((student) => {
    let travel_string = `${student} : `;
    let travels_student_sorted = travels_student[student].Travels;
    if (travels_student_sorted === undefined) {
      // The student don't have any rooms visited yet
      travel_string += "-";
    } else {
      travels_student_sorted = travels_student_sorted
        // First sort by day
        .sort((t1, t2) => t1.day - t2.day)
        // Then sort by enter_hour
        .sort((t1, t2) => {
          if (t1.day === t2.day) {
            return t1.enter_hour - t2.enter_hour;
          }
          return 0;
        });
      // Once the days and hours of Travels are propperly sorted, we can make the route of the student

      let current_day = travels_student_sorted[0].day; // To check wheter the travel was in the same day for put -> or into a different one to put ,
      travels_student_sorted.forEach((travel, index) => {
        travel_string += travel.room;
        const next_travel = travels_student_sorted[index + 1]; // For avoid putting a , or a -> at the final of the string if it's the last register
        if (next_travel) {
          travel_string +=
            next_travel.day === current_day
              ? ERROR_DICTIONARY.ARROW_STRING
              : ERROR_DICTIONARY.COMMA_STRING;
          current_day = next_travel.day;
        }
      });
    }
    travels_student_proccesed.push(travel_string);
  });
  return travels_student_proccesed;
};
