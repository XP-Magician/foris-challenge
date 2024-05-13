import { groupByStudent, groupByRoom } from "./groupers.js";
import config from "../utils/config.js";
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
