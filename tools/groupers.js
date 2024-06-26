import entitites_constructed from "./entitiesConstructor.js";
import { Travel } from "../entities/Travel.js";

export const groupByStudent = async () => {
  const { students, presences, discarded } = await entitites_constructed();
  // In order to group by student we need the Student ID into a new JSON object
  const student_presences = {};
  students.forEach((student_entity) => {
    if (student_presences[student_entity.student_id] === undefined)
      student_presences[student_entity.student_id] = [];
  });

  // Now we need to associate each Presence to a single student and return the final association result
  presences.forEach((presence_entity) => {
    student_presences[presence_entity.student_id].push(presence_entity);
  });
  return { student_presences, discarded };
};

export const groupByRoom = async () => {
  const { students, presences, discarded } = await entitites_constructed();
  // In order to group by room we need the Room ID into a new JSON object
  const room_presences = {};
  presences.forEach((presence_entity) => {
    if (room_presences[presence_entity.room] === undefined) {
      room_presences[presence_entity.room] = {};
      // Now we add each Student ID to group their presences in that specific Room
      students.forEach((student) => {
        room_presences[presence_entity.room][student.student_id] = [];
      });
    }
    /* Finally we associate each Presence with their respective Student and Room ID, 
    taking advantage of the same loop for better performance */
    room_presences[presence_entity.room][presence_entity.student_id].push(
      presence_entity
    );
  });
  return { room_presences, discarded };
};

export const groupByTravel = async () => {
  const { students, presences, discarded } = await entitites_constructed();
  // In order to group by travels and days we need the Student ID , days and Rooms within a JSON Object
  const travels_student = {};
  students.forEach((student) => (travels_student[student.student_id] = {}));
  presences.forEach((presence_entity) => {
    // We add each Student presence days in the Student ID position
    if (travels_student[presence_entity.student_id]["Travels"] == undefined) {
      travels_student[presence_entity.student_id]["Travels"] = [];
    }

    // Here we construct the Travel entity for working on it later in the compiler
    travels_student[presence_entity.student_id]["Travels"].push(
      new Travel(
        presence_entity.room,
        presence_entity.enter_hour,
        presence_entity.day
      ).getTravel()
    );
  });

  return { travels_student, discarded };
};

export const filterByRoomName = async (roomname = "") => {
  //prettier-ignore
  let { students, presences, discarded, classrooms_details } = await entitites_constructed();
  const student_presences = {}; // For later processment
  // First we find the classroom that has the same name the user is looking for
  let room_finded = classrooms_details.filter(
    (cdt) => cdt.room_name.toLowerCase() == roomname.toLowerCase()
  );
  if (room_finded.length === 0) return { student_presences, discarded };

  // If the roomname exists
  students.forEach((student_entity) => {
    if (student_presences[student_entity.student_id] === undefined)
      student_presences[student_entity.student_id] = [];
  });

  // Now we need to associate each Presence to a single student and return the final association result
  room_finded = room_finded.map((room) => room.room_code);
  presences = presences.filter((presence) =>
    room_finded.includes(presence.room)
  );
  presences.forEach((presence_entity) => {
    student_presences[presence_entity.student_id].push(presence_entity);
  });
  return { student_presences, discarded };
};
