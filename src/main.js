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
		alert("Floor value cannot be less than lift value");
	} else if (liftInputValue > 15) {
		alert("Lift value cannot be more than 15");
	} else if (floorInputValue <= 0 || liftInputValue <= 0) {
		alert("Floor value or Lift value cannot be less than 1");
	} else if (window.screen.width < 350 && liftInputValue > 4) {
		alert("According to your screen size, lift value cannot be more than 4");
	} else if (window.screen.width < 450 && liftInputValue > 5) {
		alert("According to your screen size, lift value cannot be more than 5");
	} else if (window.screen.width < 700 && liftInputValue > 7) {
		alert("According to your screen size, lift value cannot be more than 7");
	} else if (window.screen.width < 750 && liftInputValue > 8) {
		alert("According to your screen size, lift value cannot be more than 8");
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

			floorIDText.textContent = `${currentFloor}`;
			upDirectionButton.textContent = "⇧";
			downDirectionButton.textContent = "⇧";

			upDirectionButton.id = `floor-${currentFloor}`;
			downDirectionButton.id = `floor-${currentFloor}`;
			floorContainer.id = `floor-${currentFloor}`;

			floorContainer.classList.add("floor-container");
			floorDetails.classList.add("floor-details");
			floorIDText.classList.add("floor-no-text");
			liftGroup.classList.add("lift-group");
			downDirectionButton.classList.add("down-button")

			upDirectionButton.addEventListener("click", (e) => liftBtnHandler(e, true));
			downDirectionButton.addEventListener("click", (e) => liftBtnHandler(e, false));

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
	const liftElement = document.getElementById(`lift-${idleLift}`);
	const floorHeight = document.getElementById("floor-0").clientHeight + 2;
	const distanceToTravel = Math.abs(targetFloor) * floorHeight;

	const duration = Math.abs(dataStore.liftState[idleLift].currentFloor - targetFloor) * 1000;

	// update lift state
	dataStore.liftState[idleLift].idle = false;
	dataStore.liftState[idleLift].currentFloor = parseInt(targetFloor);

	liftElement.style.transition = `transform ${duration / 1000}s linear`;
	liftElement.style.transform = `translateY(-${distanceToTravel}px)`;
	// const nextRequest = dataStore.simulationQueue.shift();

	setTimeout(() => {
		liftElement.classList.add("open");
		setTimeout(() => {
			liftElement.classList.remove("open");

			setTimeout(() => {
				dataStore.liftState[idleLift].idle = true;

				if (dataStore.simulationQueue.length > 0) {
					const nextRequest = dataStore.simulationQueue.shift();
					const { targetFloor, direction } = nextRequest;
					const lift = getIdleLift(targetFloor);
					if (lift === null) {
						let intervalId = setInterval(() => {
							let re = getIdleLift(targetFloor);
							if (re !== null) {
								moveLift(targetFloor, re, direction);
								clearInterval(intervalId);
							}
						});
					} else {
						moveLift(targetFloor, lift, direction);
					}
				}
			}, 2500);
		}, 2500);
	}, duration);
}

function getIdleLift(targetFloor) {
	let nearestLift = null;
	let minDistance = Infinity;
	Array.from(dataStore.liftState).forEach((lift, idx) => {
		if (lift.idle) {
			const currentFloor = parseInt(lift.currentFloor);
			const distance = Math.abs(currentFloor - targetFloor);
			if (distance < minDistance) {
				minDistance = distance;
				nearestLift = idx;
			}
		}
	});

	return nearestLift;
}

function liftBtnHandler(e, isUP) {
	const targetedFloor = e.target.id.split("-")[1];
	const idleLift = getIdleLift(targetedFloor);
	if (idleLift === null) {
		dataStore.simulationQueue.push({ targetFloor: targetedFloor, direction: isUP ? "UP" : "DOWN" })
		let intervalId = setInterval(() => {

			let avialbleLift = getIdleLift(targetedFloor);
			if (avialbleLift !== null) {
				let nextRequest = dataStore.simulationQueue.shift();
				if (nextRequest) {
					const { targetFloor, direction } = nextRequest;
					moveLift(targetFloor, avialbleLift, direction);
					clearInterval(intervalId);
				}
			}
		});
	} else {
		moveLift(targetedFloor, idleLift, isUP ? "UP" : "DOWN");
	}
}

function init() {
	form.addEventListener("submit", handleFormSubmit);
}

backButton.addEventListener("click", (e) => {
	location.reload();
});

init();
