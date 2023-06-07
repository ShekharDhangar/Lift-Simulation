const backButton = document.getElementsByClassName("back-button")[0];
const form = document.getElementById("lift-form");

const dataStore = {
	floorCount: 0,
	liftCount: 0,
	liftState: [],
	simulationQueue: [],
};

function handleFormSubmit(e) {
	e.preventDefault();
	const simulationContainer = document.getElementById("lift-simulation-container");

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
		dataStore.floorCount = floorInputValue;
		dataStore.liftCount = liftInputValue;

		simulationContainer.innerHTML = "";
		backButton.style.display = "block";
		form.style.display = "none";

		// CREATE FLOOR
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

			upDirectionButton.addEventListener("click", (e) => upBtnHandler(e));
			downDirectionButton.addEventListener("click", (e) => downBtnHandler(e));

			directionButtonGroup.classList.add("direction-button-group");

			if (currentFloor === 0) {
				directionButtonGroup.appendChild(upDirectionButton);
			} else if (currentFloor == floorInputValue - 1) {
				directionButtonGroup.appendChild(downDirectionButton);
			} else {
				directionButtonGroup.appendChild(upDirectionButton);
				directionButtonGroup.appendChild(downDirectionButton);
			}

			floorDetails.appendChild(floorIDText);
			floorDetails.appendChild(directionButtonGroup);
			floorContainer.appendChild(floorDetails);
			if (currentFloor === 0) {
				// CREATE LIFT
				for (let currentLift = 0; currentLift < liftInputValue; currentLift++) {
					const liftContainer = document.createElement("div");
					const liftRightPart = document.createElement("div");
					const liftLeftPart = document.createElement("div");
					liftContainer.classList.add("lift-container");
					liftContainer.id = `lift-${currentLift}`;
					liftLeftPart.classList.add("lift-part");
					liftRightPart.classList.add("lift-part");
					liftContainer.appendChild(liftLeftPart);
					liftContainer.appendChild(liftRightPart);
					dataStore.liftState.push({ id: currentLift, idle: true, currentFloor: 0 });
					liftGroup.appendChild(liftContainer);
				}
				floorContainer.appendChild(liftGroup);
				simulationContainer.appendChild(floorContainer);
			} else {
				simulationContainer.insertBefore(floorContainer, simulationContainer.children[0]);
			}
		}
	}
}

function moveLift(targetFloor, idleLift, direction) {
	const liftElement = document.getElementById(`lift-${idleLift.id}`);
	const floorHeight = document.getElementById("floor-0").clientHeight + 2;
	const distanceToTravel = Math.abs(targetFloor) * floorHeight;

	const duration = Math.abs(idleLift.currentFloor - targetFloor) * 1000;

	// update lift state
	dataStore.liftState.reduce((acc, curr, idx) => {
		if (curr.id === idleLift.id) {
			acc[idx].idle = false;
			acc[idx].currentFloor = parseInt(targetFloor);
		}
		return acc;
	}, dataStore.liftState);

	liftElement.style.transition = `transform ${duration / 1000}s linear`;
	liftElement.style.transform = `translateY(-${distanceToTravel}px)`;

	setTimeout(() => {
		liftElement.classList.add("open");
		setTimeout(() => {
			liftElement.classList.remove("open");
			dataStore.liftState.reduce((acc, curr, idx) => {
				if (curr.id === idleLift.id) {
					acc[idx].idle = true;
				}
				return acc;
			}, dataStore.liftState);
		}, 2500);
	}, duration);
}

function getIdleLift(index) {
	return dataStore.liftState.reduce(function (prev, curr) {
		return Math.abs(curr.currentFloor - index) < Math.abs(prev.currentFloor - index) ? curr : prev;
	});
}

function upBtnHandler(e) {
	const targetedFloor = e.target.id.split("-")[1];
	const idleLift = getIdleLift(targetedFloor);

	moveLift(targetedFloor, idleLift, "UP");
}

function downBtnHandler(e) {
	const targetedFloor = e.target.id.split("-")[1];
	const idleLift = getIdleLift(targetedFloor);

	moveLift(targetedFloor, idleLift, "DOWN");
}

function init() {
	form.addEventListener("submit", handleFormSubmit);
}

backButton.addEventListener("click", (e) => {
	location.reload();
});

init();
