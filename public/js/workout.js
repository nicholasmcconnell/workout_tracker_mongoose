///////////// THIS FILE IS FOR DISPLAYING LAST WORKOUT SUMMARY ON INDEX.JS////////////


const control = async () => {
  const lastWorkoutWeek = await API.getLastWorkout();
  const workoutSummary = await initLastWorkout(lastWorkoutWeek);
  renderWorkoutSummary(workoutSummary, lastWorkoutWeek);
}

control();

async function initLastWorkout(lastWorkoutWeek) {
  console.log(lastWorkoutWeek)
  if (!lastWorkoutWeek || !lastWorkoutWeek.exercises.length) {
    renderNoWorkoutText()
  } else if (lastWorkoutWeek.exercises.length) {
    document
      .querySelector("a[href='/exercise?']")
      .setAttribute("href", `/exercise?id=${lastWorkoutWeek._id}`);

    const lastWorkoutSpecs = lastWorkoutWeek.exercises[lastWorkoutWeek.exercises.length - 1];

    switch (lastWorkoutSpecs.type) {
      case 'Cardio':
        workoutSummary = {
          dayOfStatsCardio: {
            date: lastWorkoutSpecs.dayOf,
            type: lastWorkoutSpecs.type,
            name: lastWorkoutSpecs.name,
            duration: lastWorkoutSpecs.duration,
          },
          weekOfStats: {
            ...utilWorkout.tallyExercises(lastWorkoutWeek.exercises)
          }
        }
        break;
      case 'Resistance':
        workoutSummary = {
          dayOfStatsResistance: {
            date: lastWorkoutSpecs.dayOf,
            type: lastWorkoutSpecs.type,
            name: lastWorkoutSpecs.name,
            reps: lastWorkoutSpecs.reps,
            sets: lastWorkoutSpecs.sets,
            weight: lastWorkoutSpecs.weight,
            duration: lastWorkoutSpecs.duration,
          },
          weekOfStats: {
            ...utilWorkout.tallyExercises(lastWorkoutWeek.exercises)
          }
        }
        break;
      default:
        break;
    }

    return workoutSummary;
  }
}

function renderWorkoutSummary(summary, lastWorkoutWeek) {
  // let workoutKeyMap = {};
  const { dayOfStatsCardio, dayOfStatsResistance, weekOfStats } = {
    dayOfStatsCardio: {
      date: "Date",
      type: "Type",
      name: "Name",
      duration: "Duration",
    },

    dayOfStatsResistance: {
      date: "Date",
      type: "Type",
      name: "Name",
      reps: 'Reps',
      sets: 'Sets',
      weight: 'Weight',
      duration: "Duration",
    },

    weekOfStats: {
      distance: "Distance Covered",
      duration: "Total Duration",
      reps: "Reps Performed",
      sets: "Sets Performed",
      weight: "Weight Lifted",
    }
  }

  switch (summary[Object.keys(summary)[0]].type) {
    case 'Cardio':
      workoutKeyMap = {
        dayOfStatsCardio: dayOfStatsCardio,
        weekOfStats: weekOfStats
      }
      break;
    case 'Resistance':
      workoutKeyMap = {
        dayOfStatsResistance: dayOfStatsResistance,
        weekOfStats: weekOfStats
      }
      break;
    default:
      break;
  }

  const container = document.querySelector(".dayOfStats");
  const container2 = document.querySelector(".weekOfStats");


console.log(summary)
  for (const [k, v] of Object.entries(summary)) {
    if(k === 'weekOfStats' && (lastWorkoutWeek.weekOf !== utilFunctions.formatDate()[0])){
      const p = document.createElement("p");
      p.textContent = 'No workouts logged for this week.';
      container2.appendChild(p);
      return;      
    }

    for (const [key, value] of Object.entries(v)) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");

      strong.textContent = workoutKeyMap[k][key];
      const textNode = document.createTextNode(`: ${summary[k][key]}`);
      p.appendChild(strong);
      p.appendChild(textNode);

      k === 'dayOfStatsCardio' || k === 'dayOfStatsResistance' ? container.appendChild(p) : container2.appendChild(p);
    }
  };
}

