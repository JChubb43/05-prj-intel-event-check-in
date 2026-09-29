// get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const greeting = document.getElementById("greeting");
const goalMet = document.getElementById("goalMet");

const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

// Track attendance
let count = 0;
const maxCount = 50;

const savedCount = localStorage.getItem("attendanceCount");
if (savedCount !== null) {
  count = parseInt(savedCount);
}

attendeeCount.textContent = count;
progressBar.style.width = `${Math.round((count / maxCount) * 100)}%`;

const teamIds = ["water", "zero", "power"];
for (let i = 0; i < teamIds.length; i++) {
  const savedTeamCount = localStorage.getItem(teamIds[i] + "Count");
  if (savedTeamCount !== null) {
    document.getElementById(teamIds[i] + "Count").textContent = savedTeamCount;
  }

  const savedTeamNames = localStorage.getItem(teamIds[i] + "Names");
  if (savedTeamNames !== null) {
    const teamNames = JSON.parse(savedTeamNames);
    const namesList = document.getElementById(teamIds[i] + "Names");

    for (let j = 0; j < teamNames.length; j++) {
      const attendeeName = document.createElement("li");
      attendeeName.textContent = teamNames[j];
      namesList.appendChild(attendeeName);
    }
  }
}

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // keeps website from reloading instead

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  // Update progress bar
  count++;
  const percentage = Math.round((count / maxCount) * 100);
  progressBar.style.width = `${percentage}%`;
  attendeeCount.textContent = count;

  // Update team count
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  const namesList = document.getElementById(team + "Names");
  const attendeeName = document.createElement("li");
  attendeeName.textContent = name;
  namesList.appendChild(attendeeName);

  const teamNames = JSON.parse(localStorage.getItem(team + "Names") || "[]");
  teamNames.push(name);

  localStorage.setItem("attendanceCount", count);
  localStorage.setItem(team + "Count", teamCounter.textContent);
  localStorage.setItem(team + "Names", JSON.stringify(teamNames));

  // Show welcome message
  const message = `Welcome, ${name} from ${teamName}!`;
  greeting.textContent = message;
  greeting.style.display = "block";

  form.reset();
});

if (count == maxCount) {
  const waterCount = parseInt(
    document.getElementById("waterCount").textContent,
  );
  const zeroCount = parseInt(document.getElementById("zeroCount").textContent);
  const powerCount = parseInt(
    document.getElementById("powerCount").textContent,
  );

  let winningTeam = "";

  if (waterCount > zeroCount && waterCount > powerCount) {
    winningTeam = "Water Wise";
  } else if (zeroCount > waterCount && zeroCount > powerCount) {
    winningTeam = "Net Zero";
  } else {
    winningTeam = "Renewable";
  }

  goalMet.textContent =
    "Our check in goal has been reached! Congratulations to Team " +
    winningTeam +
    " for having the most attendees!";
}
