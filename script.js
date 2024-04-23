const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
      {
          id: 1,
          name: "Declare a Variable",
          due_at: "2023-01-25",
          points_possible: 50
      },
      {
          id: 2,
          name: "Write a Function",
          due_at: "2023-02-27",
          points_possible: 150
      },
      {
          id: 3,
          name: "Code the World",
          due_at: "3156-11-15",
          points_possible: 500
      }
  ]
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
      learner_id: 125,
      assignment_id: 1,
      submission: {
          submitted_at: "2023-01-25",
          score: 47
      }
  },
  {
      learner_id: 125,
      assignment_id: 2,
      submission: {
          submitted_at: "2023-02-12",
          score: 150
      }
  },
  {
      learner_id: 125,
      assignment_id: 3,
      submission: {
          submitted_at: "2023-01-25",
          score: 400
      }
  },
  {
      learner_id: 132,
      assignment_id: 1,
      submission: {
          submitted_at: "2023-01-24",
          score: 39
      }
  },
  {
      learner_id: 132,
      assignment_id: 2,
      submission: {
          submitted_at: "2023-03-07",
          score: 140
      }
  }
];

function getLearnerData(courseInfo, assignmentGroup, learnerSubmission) {
  let results = [];
  let learnerIdSet = new Set();
  const assignmentsArray = assignmentGroup.assignments;

  learnerSubmission.forEach(element => {
      let learner = {};
      let learnerId = element.learner_id;
      let assignmentObject = findAssignmentObjectById(assignmentsArray, element.assignment_id);
      let assignmentId = assignmentObject.id;
      let dueDate = assignmentObject.due_at;
      let submittedDate = element.submission.submitted_at;
      let pointsPossible = assignmentObject.points_possible;
      let score = element.submission.score;
      let tenPecentOfPointsPossible = pointsPossible * 0.1;

      //logic to add properties to learner object
      if (!learnerIdSet.has(learnerId)) {
          learnerIdSet.add(learnerId);
          learner['id'] = learnerId; //Adding id property to learner object
          learner['numerator'] = 0; //Adding numerator property to learner object which will be removed later
          learner['denominator'] = 0; //Adding denominator property to learner object which will be removed later

          if (submittedDate <= dueDate && assignmentId !== 3) {//Logic to handle assignment submitted on time
              let ontimeAssignmentScore = score / pointsPossible;
              learner[assignmentId] = parseFloat(ontimeAssignmentScore.toFixed(3));
              learner.numerator += score;
              learner.denominator += pointsPossible;
          } else if (submittedDate > dueDate && assignmentId !== 3) {// logic to handle assignment submitted late
              let lateAssignmentScore = (score - tenPecentOfPointsPossible) / pointsPossible;
              learner[assignmentId] = parseFloat(lateAssignmentScore.toFixed(3));
              learner.numerator += score;
              learner.denominator += pointsPossible;
          }
          results.push(learner);
      } else {
          for (let result of results) {//loops through existing result objects
              if (result.id === learnerId) { //finds correct id
                  if (submittedDate <= dueDate && assignmentId !== 3) {//Logic to handle assignment submitted on time
                      let ontimeAssignmentScore = score / pointsPossible;
                      result[assignmentId] = parseFloat(ontimeAssignmentScore.toFixed(3));
                      result.numerator += score;
                      result.denominator += pointsPossible;
                  } else if (submittedDate > dueDate && assignmentId !== 3) {// logic to handle assignment submitted late
                      let lateAssignmentScore = (score - tenPecentOfPointsPossible) / pointsPossible;
                      result[assignmentId] = parseFloat(lateAssignmentScore.toFixed(3));
                      result.numerator += score;
                      result.denominator += pointsPossible;
                  }
                  break; //if correct id is found, break from loop
              }
          }
      }
  })

  results.forEach(result => {
      let average = result.numerator / result.denominator
      //error handling average
      if (average < 0 || average === Infinity) {
          result['avg'] = undefined;
      } else {
          result['avg'] = parseFloat(average.toFixed(3));
      }

      //removing numerator and denominator properties
      delete result.numerator;
      delete result.denominator;
  })

  return results;
}

//helper function to find assignment object by id
function findAssignmentObjectById(assignmentArray, assignment_id) {
  for (let assignment of assignmentArray) {
      if (assignment.id === assignment_id) {
          return assignment;
      }
  }
}

console.log(getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions))


