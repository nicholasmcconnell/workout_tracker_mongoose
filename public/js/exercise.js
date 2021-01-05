////////////THIS FILE IS FOR ADDING NEW EXERCISES TO DATABASE/////////////////

const workoutTypeSelect = document.querySelector("#type");
const cardioForm = document.querySelector(".cardio-form");
const resistanceForm = document.querySelector(".resistance-form");
const cardioNameInput = document.querySelector("#cardio-name");
const nameInput = document.querySelector("#name");
const weightInput = document.querySelector("#weight");
const setsInput = document.querySelector("#sets");
const repsInput = document.querySelector("#reps");
const durationInput = document.querySelector("#duration");
const resistanceDurationInput = document.querySelector("#resistance-duration");
const distanceInput = document.querySelector("#distance");
const completeButton = document.querySelector("button.complete");
const addButton = document.querySelector("button.add-another");
const toast = document.querySelector("#toast");
const newWorkout = document.querySelector(".new-workout");

console.log('in exercise.js')
let workoutType = null;
let shouldNavigateAway = false;

async function initExercise() {
  let lastWorkout = await API.getLastWorkout();
  let weekOf = utilFunctions.formatDate()[0];

  if (lastWorkout === undefined || (lastWorkout.weekOf !== weekOf)) {

    let workout = await API.createWorkout()
    if (workout) {
      window.history.pushState('exercise.html', '', '?id=' + workout._id);
    }
  } else {
    window.history.pushState('exercise.html', '', '?id=' + lastWorkout._id);
  }
}

initExercise();

function handleWorkoutTypeChange(event) {
  workoutType = event.target.value;

  if (workoutType === "Cardio") {
    cardioForm.classList.remove("d-none");
    resistanceForm.classList.add("d-none");
  } else if (workoutType === "Resistance") {
    resistanceForm.classList.remove("d-none");
    cardioForm.classList.add("d-none");
  } else {
    cardioForm.classList.add("d-none");
    resistanceForm.classList.add("d-none");
  }
}

function validateInputs() {
  let isValid = true;

  if (workoutType === "Resistance") {
    if (nameInput.value.trim() === "") {
      isValid = false;
    }

    if (weightInput.value.trim() === "") {
      isValid = false;
    }

    if (setsInput.value.trim() === "") {
      isValid = false;
    }

    if (repsInput.value.trim() === "") {
      isValid = false;
    }

    if (resistanceDurationInput.value.trim() === "") {
      isValid = false;
    }
  } else if (workoutType === "Cardio") {
    if (cardioNameInput.value.trim() === "") {
      isValid = false;
    }

    if (durationInput.value.trim() === "") {
      isValid = false;
    }

    if (distanceInput.value.trim() === "") {
      isValid = false;
    }
  }

  if (isValid) {
    completeButton.removeAttribute("disabled");
    // addButton.removeAttribute("disabled");
    return true;
  } else {
    completeButton.setAttribute("disabled", true);
    // addButton.setAttribute("disabled", true);
    return false;
    //through error toast here
  }
}

async function handleFormSubmit(event) {
  // if (validateInputs()) {
  // } else {
  //   alert('exercise not iniciated')
  // };
  // await initExercise()
  event.preventDefault();

  let workoutData = {};

  if (workoutType === "Cardio") {
    workoutData.type = "Cardio";
    workoutData.name = cardioNameInput.value.trim();
    workoutData.distance = Number(distanceInput.value.trim());
    workoutData.duration = Number(durationInput.value.trim());
  } else if (workoutType === "Resistance") {
    workoutData.type = "Resistance";
    workoutData.name = nameInput.value.trim();
    workoutData.weight = Number(weightInput.value.trim());
    workoutData.sets = Number(setsInput.value.trim());
    workoutData.reps = Number(repsInput.value.trim());
    workoutData.duration = Number(resistanceDurationInput.value.trim());
  }
  console.log(workoutData)

  await API.addExercise(workoutData);
  // clearInputßs();
  toast.classList.add("success");
}

function handleToastAnimationEnd() {
  toast.removeAttribute("class");
  if (shouldNavigateAway) {
    location.href = "/";
  }
}

function clearInputs() {
  cardioNameInput.value = "";
  nameInput.value = "";
  setsInput.value = "";
  distanceInput.value = "";
  durationInput.value = "";
  repsInput.value = "";
  resistanceDurationInput.value = "";
  weightInput.value = "";
}

if (workoutTypeSelect) {
  workoutTypeSelect.addEventListener("change", handleWorkoutTypeChange);
}
if (completeButton) {
  completeButton.addEventListener("click", function (event) {
    // shouldNavigateAway = true;
    handleFormSubmit(event);
  });
}
// if (addButton) {

//   addButton.addEventListener("click", handleFormSubmit);
// }
toast.addEventListener("animationend", handleToastAnimationEnd);

//this isn't doing anything really, it runs when page loads and that's about it - doesn't validate form on submit and then empty forms are being submitted
document
  .querySelectorAll("input")
  .forEach(element => element.addEventListener("input", validateInputs));
