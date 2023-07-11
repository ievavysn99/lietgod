const godNames = [];
const godOccupations = [];
const godLines = [];
const connectedGods = [];
const connectedOccupations = [];
let gods = [];

// Fetch the gods data from the JSON file

document.addEventListener('DOMContentLoaded', () => {
  reloadTheGame();
});

const displayItems = (randomGodNames, randomGodOccupations) => {
  const godsNamesElement = document.getElementById('gods-names');
  const godsOccupationsElement = document.getElementById('gods-occupation');

  while (godsNamesElement.firstChild) {
    godsNamesElement.firstChild.remove();
  }

  while (godsOccupationsElement.firstChild) {
    godsOccupationsElement.firstChild.remove();
  }

  randomGodNames.forEach((god) => {
    const button = document.createElement('button');
    button.textContent = god;
    button.classList.add('god-name');
    godsNamesElement.appendChild(button);
  });

  randomGodOccupations.forEach((god) => {
    const button = document.createElement('button');
    button.textContent = god;
    button.classList.add('god-occupation');
    godsOccupationsElement.appendChild(button);
  });
};

const displayScore = (score) => {
  const output = document.getElementById('game');

  const scoreContainerElement = document.createElement('div');
  scoreContainerElement.classList.add('score-container');

  const scoreTitleElement = document.createElement('h3');
  scoreTitleElement.classList.add('score-title');
  scoreTitleElement.innerText = 'Your Result:';

  const scoreElement = document.createElement('h2');
  scoreElement.classList.add('score');
  scoreElement.innerText = `${score}/5`;

  const xButtonElement = document.createElement('button');
  xButtonElement.classList.add('remove-button');
  xButtonElement.textContent = 'X';

  xButtonElement.addEventListener('click', () => {
    scoreContainerElement.remove();
  });

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('result-button-container');
  const reloadButtonElement = document.createElement('button');
  reloadButtonElement.textContent = 'Reload the game';
  reloadButtonElement.classList.add('rbtn');
  const checkResultButton = document.createElement('button');
  checkResultButton.textContent = 'Check the answers';
  checkResultButton.classList.add('rbtn');

  reloadButtonElement.addEventListener('click', () => {
    scoreContainerElement.remove();
    reloadTheGame();
  });

  checkResultButton.addEventListener('click', () => {
    scoreContainerElement.remove();
  });

  buttonContainer.append(reloadButtonElement, checkResultButton);

  scoreContainerElement.append(
    xButtonElement,
    scoreTitleElement,
    scoreElement,
    buttonContainer
  );

  output.appendChild(scoreContainerElement);
};

const reloadTheGame = () => {
  fetch('../scripts/god_list.json')
    .then((response) => response.json())
    .then((data) => {
      gods = data;
      const randomGodNames = [];
      const randomGodOccupations = [];

      const svgContainer = document.getElementById('gods-lines');

      while (svgContainer.firstChild) {
        svgContainer.firstChild.remove();
      }

      // Generate random indices within the range of gods array length
      const randomIndices = [];
      while (randomIndices.length < 5) {
        const randomIndex = Math.floor(Math.random() * gods.length);
        if (!randomIndices.includes(randomIndex)) {
          randomIndices.push(randomIndex);
        }
      }

      randomIndices.forEach((index) => {
        const god = gods[index];
        randomGodNames.push(god.name);
        randomGodOccupations.push(god.occupation);
      });

      //randomize the order
      for (let i = randomGodOccupations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [randomGodOccupations[i], randomGodOccupations[j]] = [
          randomGodOccupations[j],
          randomGodOccupations[i],
        ];
      }

      displayItems(randomGodNames, randomGodOccupations);

      let selectedGodNames = [];
      let selectedOccupations = [];

      // Define variables to store the selected god and occupation buttons
      let selectedGod = null;
      let selectedOccupation = null;

      const connectedGods = {};
      const connectedOccupations = {};

      function connectElements(godNameButton, occupationButton) {
        const svgRect = svgContainer.getBoundingClientRect();

        const godNameRect = godNameButton.getBoundingClientRect();
        const occupationRect = occupationButton.getBoundingClientRect();

        const godNameX = godNameRect.left - svgRect.left + godNameRect.width;
        const godNameY = godNameRect.top - svgRect.top + godNameRect.height / 2;
        const occupationX = occupationRect.left - svgRect.left;
        const occupationY =
          occupationRect.top - svgRect.top + occupationRect.height / 2;

        const line = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'line'
        );
        line.setAttribute('x1', godNameX);
        line.setAttribute('y1', godNameY);
        line.setAttribute('x2', occupationX);
        line.setAttribute('y2', occupationY);
        line.setAttribute('stroke', '#006816');
        line.setAttribute('stroke-width', '3');

        svgContainer.appendChild(line);
      }

      const handleGodNameButtonClick = (godNameButton) => {
        if (selectedGod !== godNameButton) {
          if (selectedGod) {
            selectedGod.classList.remove('selected-god');
          }
          selectedGod = godNameButton;
          selectedGod.classList.add('selected-god');

          selectedGodNames.push(godNameButton.textContent);
        }
      };

      const handleOccupationButtonClick = (occupationButton) => {
        if (selectedGod && selectedOccupation !== occupationButton) {
          selectedOccupation = occupationButton;

          if (
            !connectedGods[selectedOccupation.textContent] &&
            !connectedOccupations[selectedGod.textContent]
          ) {
            connectElements(selectedGod, selectedOccupation);
            connectedGods[selectedOccupation.textContent] = selectedGod;
            connectedOccupations[selectedGod.textContent] = selectedOccupation;
          }

          selectedOccupations.push(occupationButton.textContent);

          if (selectedOccupations.length === 5) {
            const godsNamesElement = document.getElementById('gods-names');
            const godsOccupationsElement =
              document.getElementById('gods-occupation');

            let score = 0;

            for (let i = 0; i < 5; i++) {
              const selectedGodName = selectedGodNames[i];
              const selectedOccupation = selectedOccupations[i];

              const icon = document.createElement('i');

              const matchingGod = gods.find(
                (god) =>
                  god.name === selectedGodName &&
                  god.occupation === selectedOccupation
              );

              if (matchingGod) {
                score++;
                godsNamesElement.children[i].classList.add('correct');
                icon.classList.add('fa-solid', 'fa-square-check');
                godsNamesElement.children[i].appendChild(icon);
              } else {
                godsNamesElement.children[i].classList.add('incorrect');
                icon.classList.add('fa-solid', 'fa-circle-xmark');

                const notMatchingGod = gods.find(
                  (god) => god.name === selectedGodName
                );

                const link = document.createElement('a');

                link.addEventListener('click', () =>
                  window.open(notMatchingGod.link)
                );

                const iconExpln = document.createElement('i');
                iconExpln.classList.add('fa-solid', 'fa-circle-question');
                link.appendChild(iconExpln);
                const iconsContainer = document.createElement('span');

                iconExpln.addEventListener('click', () => {});

                iconsContainer.append(icon, link);
                godsNamesElement.children[i].appendChild(iconsContainer);
              }
            }

            displayScore(score);
          }
        }
      };

      // Get the god name buttons and add event listeners
      const godNameButtons = document.querySelectorAll('.god-name');
      godNameButtons.forEach((button) => {
        button.addEventListener('click', () => {
          handleGodNameButtonClick(button);
        });
      });

      // Get the occupation buttons and add event listeners
      const occupationButtons = document.querySelectorAll('.god-occupation');
      occupationButtons.forEach((button) => {
        button.addEventListener('click', () => {
          handleOccupationButtonClick(button);
        });
      });
    });
};
