let contentData = {};
let isTyping = false;
let currentTimeout = null;
let index = 0;

// Load content.json
fetch('content.json')
  .then(res => res.json())
  .then(data => {
    contentData = data;

    // Setup all clickable links
    document.querySelectorAll('a[data-key]').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        if (isTyping) return;
        const key = this.getAttribute('data-key');
        showTextByKey(key);
      });
    });
  });

// Typing effect for known keys
function showTextByKey(key) {
  const displayArea = document.getElementById('display-area');
  const imageContainer = document.getElementById('image-container');
  const content = contentData[key];

  let text = '';
  let imagePath = '';

  if (typeof content === 'string') {
    text = content;
    imagePath = '';
  } else if (typeof content === 'object') {
    text = content.text || '';
    imagePath = content.image || '';
  }

  if (currentTimeout) {
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }
  isTyping = true;
  index = 0;
  displayArea.innerHTML = '';
  imageContainer.innerHTML = '';

  function typeCharacter() {
    if (!isTyping) return;

    if (index < text.length) {
      const span = document.createElement('span');
      span.textContent = text.charAt(index);
      span.classList.add('char-span');
      displayArea.appendChild(span);

      index++;
      currentTimeout = setTimeout(typeCharacter, 70); // Adjust speed
    } else {
      isTyping = false;
      currentTimeout = null;

      // After typing, show image if available
      if (imagePath) {
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = key;
        imageContainer.appendChild(img);
      }
    }
  }

  typeCharacter();
}



function showCustomText(text) {
  const displayArea = document.getElementById('display-area');

  if (currentTimeout) {
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }
  isTyping = true;
  index = 0;
  displayArea.innerHTML = '';

  function typeCharacter() {
  if (!isTyping) return;

  const span = document.createElement('span');
  span.textContent = text.charAt(index);
  span.classList.add('char-span');
  displayArea.appendChild(span);

  index++;

  if (index < text.length) {
    currentTimeout = setTimeout(typeCharacter, 100);
  } else {
    isTyping = false;
    currentTimeout = null;
  }
}

  typeCharacter();
}



// Search handler
document.getElementById('search-button').addEventListener('click', function () {
  if (isTyping) return;

  const query = document.getElementById('search-input').value.toLowerCase().trim();
  if (!query) return;

  const matchedKey = Object.keys(contentData).find(
    key => key.toLowerCase() === query
  );

  if (matchedKey) {
    showTextByKey(matchedKey);
  } else {
    showCustomText(`No results found for "${query}".`);
  }
});

// Allow Enter key to trigger search
document.getElementById('search-input').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    document.getElementById('search-button').click();
  }
});

// Hide on click outside & unlock
document.addEventListener('click', function (e) {
  // Don't hide if clicked inside right panel or on links
  if (e.target.closest('.right-panel') || e.target.closest('[data-key]')) return;

  // Clear typing
  if (currentTimeout) {
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }

  isTyping = false;
  index = 0;

  const displayArea = document.getElementById('display-area');
  const imageContainer = document.getElementById('image-container');

  displayArea.innerText = '';
  imageContainer.innerHTML = '';
});


// Prevent inside clicks from triggering outside handler
document.querySelector('.search-container').addEventListener('click', e => e.stopPropagation());
document.getElementById('display-area').addEventListener('click', e => e.stopPropagation());
document.querySelectorAll('[data-key]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.stopPropagation();  // Prevent outside click handler hiding text
    const key = this.getAttribute('data-key');
    showTextByKey(key);   // Always call to start typing new text
  });
});
document.getElementById('show-countdown-link').addEventListener('click', function(e) {
  e.preventDefault();
  const wrapper = document.getElementById('countdown-wrapper');
  if (wrapper.style.display === 'none' || wrapper.style.display === '') {
    wrapper.style.display = 'block';
    startCountdown(`November 20, ${new Date().getFullYear()} 00:00:00`);
  } else {
    wrapper.style.display = 'none';
  }
});

// Countdown code (same as before)
function startCountdown(targetDateStr) {
  const daysSpan = document.getElementById('days');
  const hoursSpan = document.getElementById('hours');
  const minutesSpan = document.getElementById('minutes');
  const secondsSpan = document.getElementById('seconds');

  const targetDate = new Date(targetDateStr).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysSpan.innerText = "00";
      hoursSpan.innerText = "00";
      minutesSpan.innerText = "00";
      secondsSpan.innerText = "00";
      clearInterval(timerInterval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    daysSpan.innerText = String(days).padStart(2, '0');
    hoursSpan.innerText = String(hours).padStart(2, '0');
    minutesSpan.innerText = String(minutes).padStart(2, '0');
    secondsSpan.innerText = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  const timerInterval = setInterval(updateCountdown, 1000);
}

