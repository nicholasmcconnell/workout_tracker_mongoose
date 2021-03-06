////////////THIS FILE IS FOR ADDING NEW EXERCISES TO DATABASE/////////////////

const workoutTypeSelect = document.querySelector("#type");
const exerciseName = document.querySelector('#resistance-name')
const cardioForm = document.querySelector(".cardio-form");
const resistanceForm = document.querySelector(".resistance-form");
const cardioNameInput = document.querySelector("#cardio-name");
const resistanceNameInput = document.querySelector("#resistance-name");
const weightInput = document.querySelector("#weight");
const setsInput = document.querySelector("#sets");
const repsInput = document.querySelector("#reps");
const cardioDurationInput = document.querySelector("#cardio-duration");
const resistanceDurationInput = document.querySelector("#resistance-duration");
const distanceInput = document.querySelector("#distance");
const completeButton = document.querySelector("button.complete");
const addButton = document.querySelector("button.add-another");
const toast = document.querySelector("#toast");
const newWorkout = document.querySelector(".new-workout");


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
    console.log(1)
    if (resistanceNameInput.value.trim() === "" || resistanceNameInput.value.trim() === "Select Type") {
      console.log(2)
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
    if (cardioNameInput.value.trim() === "" || cardioNameInput.value.trim() === "Select Type") {
      isValid = false;
    }

    if (cardioDurationInput.value.trim() === "") {
      isValid = false;
    }

    if (distanceInput.value.trim() === "") {
      isValid = false;
    }
  }

  if (isValid) {
    completeButton.removeAttribute("disabled");
    return true;
  } else {
    completeButton.setAttribute("disabled", true);
    return false;
  }
}

async function handleFormSubmit(event) {

  event.preventDefault();

  let workoutData = {};

  if (workoutType === "Cardio") {
    workoutData.type = "Cardio";
    workoutData.name = cardioNameInput.value.trim();
    workoutData.distance = Number(distanceInput.value.trim());
    workoutData.duration = Number(cardioDurationInput.value.trim());
  } else if (workoutType === "Resistance") {
    workoutData.type = "Resistance";
    workoutData.name = resistanceNameInput.value.trim();
    workoutData.weight = Number(weightInput.value.trim());
    workoutData.sets = Number(setsInput.value.trim());
    workoutData.reps = Number(repsInput.value.trim());
    workoutData.duration = Number(resistanceDurationInput.value.trim());
  }

  await API.addExercise(workoutData);
  toast.classList.add("success");
}

function handleToastAnimationEnd() {
  toast.removeAttribute("class");
  if (shouldNavigateAway) {
    location.href = "/stats";
  }
}

function clearInputs() {
  cardioNameInput.value = "";
  resistanceNameInput.value = "";
  setsInput.value = "";
  distanceInput.value = "";
  cardioDurationInput.value = "";
  repsInput.value = "";
  resistanceDurationInput.value = "";
  weightInput.value = "";
}

if (workoutTypeSelect) {
  workoutTypeSelect.addEventListener("change", handleWorkoutTypeChange);
}
if (completeButton) {
  completeButton.addEventListener("click", function (event) {
    shouldNavigateAway = true;
    handleFormSubmit(event);
  });
}

toast.addEventListener("animationend", handleToastAnimationEnd);

document.querySelectorAll("input")
  .forEach(element => element.addEventListener("input", validateInputs));

[document.querySelector('#resistance-name'), document.querySelector('#cardio-name')].forEach(name => name.addEventListener("change", validateInputs))
