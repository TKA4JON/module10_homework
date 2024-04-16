const wsUri = "wss://echo-ws-service.herokuapp.com";

const messageInput = document.querySelector('.message')
const btnSend = document.getElementById('send');
const btnGeo = document.getElementById('geo-loc');
const chatWindow = document.querySelector('.chat-window');


let websocket = new WebSocket(wsUri); 

websocket.onopen = function(evt) {
  console.log("Connected");
};

websocket.onerror = function(evt) {
  console.log("Error");
};

websocket.onclose = function(evt) {
    writeToScreen("Disconnected");
};


btnSend.addEventListener('click', () => {
  const message = messageInput.value;
  addMessage(message);
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageElement.classList.add('window-text', 'sent');
  chatWindow.appendChild(messageElement);
  messageInput.value = '';
});

websocket.addEventListener('message', (event) => {
  console.log('Message received:', event.data);
  if (!event.data.startsWith('https://www.openstreetmap.org/')) {
    const messageElement = document.createElement('p');
    messageElement.textContent = event.data;
    messageElement.classList.add('window-text', 'received');
    chatWindow.appendChild(messageElement);
  }
});

function addMessage(message) {
  websocket.send(message);
}

const error = () => {
  alert('Невозможно получить ваше местоположение');
}

const success = (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const mapLink = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
  addMessage(mapLink);
  const messageElement = document.createElement('p');
  const linkElement = document.createElement('a');
  linkElement.href = mapLink;
  linkElement.target = '_blank';
  linkElement.textContent = 'Геолокация';
  messageElement.appendChild(linkElement);
  messageElement.classList.add('window-text', 'sent');
  chatWindow.appendChild(messageElement);
};

btnGeo.addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Geolocation не поддерживается вашим браузером');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
});