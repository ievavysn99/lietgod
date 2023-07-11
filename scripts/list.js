const containerElement = document.getElementById('list-container');

fetch('../scripts/god_list.json')
  .then((response) => response.json())
  .then((data) => {
    data.forEach((god) => {
      const button = document.createElement('button');
      button.innerText = god.name;

      button.addEventListener('click', () => (window.location.href = god.link));

      button.classList.add('god-list-button');

      containerElement.appendChild(button);
    });
  });
