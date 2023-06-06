const form = document.getElementById("lift-form");
const backButton = document.getElementsByClassName("back-button")[0];
const simulationContainer = document.getElementById("lift-simulation-container");

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const floorInputValue = document.getElementById("floor-input").valueAsNumber;
	const liftInputValue = document.getElementById("lift-input").valueAsNumber;

	if (floorInputValue < liftInputValue) {
		console.log(floorInputValue < liftInputValue, typeof floorInputValue, "value");
		alert("Floor value cannot be less than lift value");
	} else if (floorInputValue > 10 || liftInputValue > 10) {
		alert("Floor value or Lift value cannot be more than 10");
	} else if (floorInputValue <= 0 || liftInputValue <= 0) {
		alert("Floor value or Lift value cannot be less than 1");
	} else {
		simulationContainer.innerHTML = "";
		backButton.style.display = "block";
		form.style.display = "none";

		for (let currentFloor = 0; currentFloor < floorInputValue; currentFloor++) {
			const floorContainer = document.createElement("div");
			const floorDetails = document.createElement("div");
			const floorIDText = document.createElement("p");
			const directionButtonGroup = document.createElement("div");
			const upDirectionButton = document.createElement("button");
			const downDirectionButton = document.createElement("button");
			const liftGroup = document.createElement("div");

			floorIDText.textContent = `Floor ${currentFloor}`;
			upDirectionButton.textContent = "up";
			downDirectionButton.textContent = "down";

			upDirectionButton.id = `floor-${currentFloor}`;
			downDirectionButton.id = `floor-${currentFloor}`;
			floorContainer.id = `floor-${currentFloor}`;

			floorContainer.classList.add("floor-container");
			floorDetails.classList.add("floor-details");
			floorIDText.classList.add("floor-no-text");
			liftGroup.classList.add("lift-group");

			for (let currentLift = 0; currentLift < liftInputValue; currentLift++) {
				const liftContainer = document.createElement("div");
				const liftLeftPart = document.createElement("div");
				const liftRightPart = document.createElement("div");
				liftContainer.classList.add("lift-container");
				liftContainer.id = `lift-${currentLift}`;
				liftLeftPart.classList.add("lift-part");
				liftRightPart.classList.add("lift-part");
				liftContainer.appendChild(liftLeftPart);
				liftContainer.appendChild(liftRightPart);
				liftGroup.appendChild(liftContainer);
			}

			directionButtonGroup.classList.add("direction-button-group");
			directionButtonGroup.appendChild(upDirectionButton);
			directionButtonGroup.appendChild(downDirectionButton);

			floorDetails.appendChild(floorIDText);
			floorDetails.appendChild(directionButtonGroup);
			floorContainer.appendChild(floorDetails);
			if (currentFloor === 0) {
				floorContainer.appendChild(liftGroup);
				simulationContainer.appendChild(floorContainer);
			} else {
				simulationContainer.insertBefore(floorContainer, simulationContainer.children[0]);
			}
		}
	}
});

backButton.addEventListener("click", (e) => {
	simulationContainer.innerHTML = "";
	form.style.display = "flex";
	backButton.style.display = "none";
});
