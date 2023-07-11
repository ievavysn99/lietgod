let godList = document.getElementById('menu-list');
let godListGods = document.getElementById('menu-list-gods');
let linkToJson;

if (godList) {
  linkToJson = './scripts/god_list.json';
} else {
  linkToJson = '../scripts/god_list.json';
  godList = godListGods;
}

// Get the JSON data
fetch(linkToJson)
  .then((response) => response.json())
  .then((data) => {
    // Loop through the array of gods and create a list item for each one
    data.forEach((god) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = god.name;
      a.href = godList.id === 'menu-list' ? god.link2 : god.link;
      li.appendChild(a);
      godList.appendChild(li);
    });
  });

const burger = document.getElementById('bars');
const menuDiv = document.getElementById('menu');
const arrow = document.getElementById('arrow');
const listButton = document.getElementById('list-button');

burger.addEventListener('click', () => {
  menuDiv.classList.toggle('show');

  if (menuDiv.classList.contains('show')) {
    menuDiv.style.border = '1px solid black';
    menuDiv.style.padding = '10px';
  } else {
    setTimeout(() => {
      menuDiv.style.border = 'none';
      menuDiv.style.padding = '0';
    }, 300);
  }
});

let time;

if (window.innerWidth <= 720) {
  time = 450;
} else if (window.innerWidth <= 1024) {
  time = 350;
} else {
  time = 220;
}

listButton.addEventListener('click', () => {
  godList.classList.toggle('show');

  if (godList.classList.contains('show')) {
    godList.style.borderTop = '1px solid var(--text-color)';
    arrow.style.transform = `rotate(180deg)`;
  } else {
    arrow.style.transform = `rotate(0deg)`;
    setTimeout(() => {
      godList.style.borderTop = 'none';
    }, time);
  }
});
