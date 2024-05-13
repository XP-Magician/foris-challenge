import entitites_constructed from "./entitiesConstructor.js";

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
    if (room_presences[presence_entity.room] === undefined)
      room_presences[presence_entity.room] = {};
    // Now we add each Student ID to group their presences in that specific Room
    students.forEach((student) => {
      room_presences[presence_entity.room][student.student_id] = [];
    });

    /* Finally we associate each Presence with their respective Student and Room ID, 
    taking advantage of the same loop for better performance */
    room_presences[presence_entity.room][presence_entity.student_id].push(
      presence_entity
    );
  });

  return { room_presences, discarded };
};
