const displayTime = document.getElementById('timeLeft');
const displayMessage = document.getElementById('message');
const display = document.getElementById('display');
const inputSessionTime = document.getElementById('workTime');
const inputBreakTime = document.getElementById('breakTime');

const icons = document.querySelectorAll('.icons');
const inputs = document.querySelectorAll('.setting > input');

icons.forEach(function(icon) { icon.addEventListener('click', handleButtonClick); });
inputs.forEach(function(input) { input.addEventListener('input', handleInput); });
display.addEventListener('click', handleDisplayClick);

function handleButtonClick(e) {
  var clickElement = e.currentTarget;
  var parent = clickElement.parentElement;
  var input = parent.querySelector('input');
  if (clickElement.classList.contains('plus')) {
    input.value++;
  } else if (input.value > 0) {
    input.value--;
  }
  clock.updateSetting(input.id);
}

function handleInput(e) {
  clock.updateSetting(e.currentTarget.id);
}

function handleDisplayClick() {
  if (clock.timer === 0) {
    clock.start();
  } else {
    clock.reset();
  }
}

var clock = {
  secLeft: 0,
  timer: 0,
  turnSession: true,
  setSessionSec: 0,
  setBreakSec: 0,

  updateSetting: function(mode) {
    if (mode === 'workTime') {
      this.setSessionSec = inputSessionTime.value * 60;
      if (this.turnSession) {
        this.secLeft = this.setSessionSec;
      }
    } else if (mode === 'breakTime') {
      this.setBreakSec = inputBreakTime.value * 60;
      if (!this.turnSession) {
        this.secLeft = this.setBreakSec;
      }
    } else {
      this.setSessionSec = inputSessionTime.value * 60;
      this.setBreakSec = inputBreakTime.value * 60;
      this.secLeft = this.setSessionSec;
    }
    displayTime.innerHTML = this.getDisplayTime();
  },

  getDisplayTime: function() {
    var min = Math.floor(this.secLeft / 60).toString();
    var sec = (this.secLeft - min * 60).toString();
    
    if (sec.length === 1) {
      sec = '0' + sec;
    }
    return min + ':' + sec;
  },

  clear: function() {
    clearInterval(this.timer);
    this.timer = 0;
    display.className = 'display';
  },

  reset: function() {
    clearInterval(this.timer);
    this.timer = 0;
    this.secLeft = this.setSessionSec;
    displayTime.innerHTML = this.getDisplayTime();
    displayMessage.innerHTML = 'Start the timer';
    display.className = 'display';
  },

  start: function() {
    displayMessage.innerHTML = '';
    if (this.turnSession) {
      this.sessionTime();
    } else {
      this.breakTime();
    }
    this.timer = setInterval(this.updateTimerState.bind(this), 1000);
  },

  updateTimerState: function() {
    this.secLeft--;
    displayTime.innerHTML = this.getDisplayTime();
    if (this.secLeft <= 0) {
      this.turnSession = !this.turnSession;
      this.clear();
      this.start();
    }
  },

  breakTime: function() {
    this.secLeft = this.setBreakSec;
    displayMessage.innerHTML = 'Time for a break.';
    display.classList.add('breakTime');
  },

  sessionTime: function() {
    this.secLeft = this.setSessionSec;
    displayMessage.innerHTML = 'Time to focus!';
    display.classList.add('sessionTime');
  }
};

clock.updateSetting();
