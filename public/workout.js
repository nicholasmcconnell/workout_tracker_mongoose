async function initWorkout() {
  const lastWorkout = await API.getLastWorkout();
  // console.log(lastWorkout.exercises[duration]);
  if (lastWorkout) {
    document
      .querySelector("a[href='/exercise?']")
      .setAttribute("href", `/exercise?id=${lastWorkout._id}`);

      const lastWorkoutSpecs = lastWorkout.exercises[lastWorkout.exercises.length - 1];
      console.log(lastWorkoutSpecs)
    // date, name, type, reps, sets, weight  type, duration
    const workoutSummary = {
      sharedStats: {
        date: formatDate(lastWorkout.day),
        name: lastWorkoutSpecs.name,
        type: lastWorkoutSpecs.type,
        durationToday: lastWorkoutSpecs.duration,
        numExercises: lastWorkout.exercises.length,
      },
      specificStats: {
        ...tallyExercises(lastWorkoutSpecs)
      }
    }

    renderWorkoutSummary(workoutSummary);
  } else {
    renderNoWorkoutText()
  }
}

function tallyExercises(exercises) {
  console.log(exercises)
  const tallied = Object.values(exercises).reduce((acc, curr) => {
    console.log(curr.type)
    if (curr.type === "resistance") {
      acc.totalDuration = (acc.totalDuration || 0) + curr.duration;
      acc.totalWeight = (acc.totalWeight || 0) + curr.weight;
      acc.totalSets = (acc.totalSets || 0) + curr.sets;
      acc.totalReps = (acc.totalReps || 0) + curr.reps;
    } else if (curr.type === "cardio") {
      acc.totalDistance = (acc.totalDistance || 0) + curr.distance;
      acc.totalDuration = (acc.totalDuration || 0) + curr.duration;
    }
    return acc;
  }, {});
  console.log(tallied)
  return tallied;
}

function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  return new Date(date).toLocaleDateString(options);
}

function renderWorkoutSummary(summary) {

  console.log(summary);

  const container = document.querySelector(".workout-stats");

  const workoutKeyMap = summary.sharedStats.type === "cardio" ? {
    sharedStats: {
      date: "Date",
      name: "Name",
      type: "Type",
      durationToday: "Last Workout Duration",
      numExercises: "Exercise's Performed",

    },

    specificStats: {
      totalDuration: "Today's Total Duration",
      totalDistance: "Total Distance Covered"
    }
  } :
    {
      sharedStats: {
        date: "Date",
        name: "Name",
        type: "Type",
        durationToday: "Last Workout Duration",
        numExercises: "Exercise's Performed",

      },

      specificStats: {
        totalDuration: "Today's Total Duration",
        totalWeight: "Total Weight",
        totalSets: "Total Sets Performed",
        totalReps: "Total Reps Performed",
      }
    }

    ;
  console.log(workoutKeyMap)



  for (const [k, v] of Object.entries(summary)) {
    console.log(v)
    for (const [key, value] of Object.entries(v)) {
      console.log(key, value, v)
      const p = document.createElement("p");
      const strong = document.createElement("strong");

      strong.textContent = workoutKeyMap[key];
      const textNode = document.createTextNode(`: ${summary[key]}`);

      p.appendChild(strong);
      p.appendChild(textNode);

      container.appendChild(p);
    }
  };
}

function renderNoWorkoutText() {
  const container = document.querySelector(".workout-stats");
  const p = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = "You have not created a workout yet!"

  p.appendChild(strong);
  container.appendChild(p);
}

initWorkout();
