// JavaScript code extracted from index.html

let showURLsUnlocked = false;

function showAllInputs() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => input.classList.remove('hidden-input'));
  setTimeout(() => {
    inputs.forEach(input => input.classList.add('hidden-input'));
  }, 2000);
}

function addWebsite() {
  const name = document.getElementById('siteName').value;
  const url = document.getElementById('siteUrl').value;
  if (!name || !url) return alert("Fill in both fields");

  let savedSites = getCookie('websites');
  try {
    savedSites = JSON.parse(savedSites || '[]');
  } catch {
    savedSites = [];
  }

  savedSites.push({ name, url });
  setCookie('websites', JSON.stringify(savedSites), 365);
  renderSites();
  document.getElementById('siteName').value = '';
  document.getElementById('siteUrl').value = '';
}

function renderSites() {
  const list = document.getElementById('urlList');
  list.innerHTML = '';

  let savedSites = getCookie('websites');
  try {
    savedSites = JSON.parse(savedSites || '[]');
  } catch {
    savedSites = [];
  }

  savedSites.forEach((site, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'site-entry';

    const label = document.createElement('span');
    label.style.color = 'white';
    label.innerHTML = showURLsUnlocked
      ? `<strong>${site.name}</strong><br><small style="color:lightgray">${site.url}</small>`
      : site.name;

    const launchBtn = document.createElement('button');
    launchBtn.textContent = 'Open';
    launchBtn.className = 'launch-btn';
    launchBtn.onclick = () => {
      const url = `https://olibot1107.github.io/Hide/url?url=${site.url}`;
      window.location.href = url;
    };

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => {
      let savedCode = getCookie('removalCode');

      if (!savedCode) {
        const newCode = prompt("Set a removal code (you’ll need it to delete):");
        if (!newCode || newCode.trim().length === 0) {
          alert("Removal code is required.");
          return;
        }
        setCookie('removalCode', newCode.trim(), 365);
        alert("Code saved! You can now delete entries.");
        savedCode = newCode.trim();
      }

      const answer = prompt("Enter your removal code:");
      if (answer === savedCode) {
        savedSites.splice(index, 1);
        setCookie('websites', JSON.stringify(savedSites), 365);
        renderSites();
      } else {
        alert("Incorrect code. Access denied.");
      }
    };

    wrapper.appendChild(label);
    wrapper.appendChild(launchBtn);
    wrapper.appendChild(removeBtn);
    list.appendChild(wrapper);
  });
}

function showUrls() {
  let savedCode = getCookie('removalCode');

  if (!savedCode) {
    const newCode = prompt("No removal code set. Create one now:");
    if (!newCode || newCode.trim().length === 0) {
      alert("Removal code is required.");
      return;
    }
    setCookie('removalCode', newCode.trim(), 365);
    savedCode = newCode.trim();
    alert("Code saved! You can now view full URLs.");
  }

  const input = prompt("Enter your removal code to show full URLs:");
  if (input === savedCode) {
    showURLsUnlocked = true;
    alert("Access granted. Showing URLs.");
    renderSites();
  } else {
    alert("Incorrect code.");
  }
}

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
  }
  return "";
}

function Help() {
  alert(`📖 How to Add a Website:

1. Paste the website URL into the URL box.
2. Enter a name for the website.
3. Press "Add Website" to save it.
4. Use "Open" to launch the site.
5. Use "Show URLs" to view full site links (requires code).

✅ Tip: You must set a code when first deleting an entry.`);
}

// Refresh all cookies on every visit to keep them alive
document.addEventListener('DOMContentLoaded', () => {
  const websites = getCookie('websites');
  const removalCode = getCookie('removalCode');
  if (websites) setCookie('websites', websites, 365);
  if (removalCode) setCookie('removalCode', removalCode, 365);
  renderSites();

  // Notification bar functionality
  const notificationBar = document.getElementById('notification-bar');
  const notificationClose = document.getElementById('notification-close');

  if (notificationBar && notificationClose) {
    console.log('Notification bar and close button found');
    // Show the notification bar
    notificationBar.style.display = 'block';
    console.log('Notification bar display style set to block');

    // Hide the notification bar when close button is clicked
    notificationClose.addEventListener('click', () => {
      notificationBar.style.display = 'none';
      console.log('Notification bar hidden');
    });
  } else {
    console.error('Notification bar or close button not found');
  }
});

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

const phrases = [
  'copycats beware.',
  'your links are safe with me.',
  'copying? nah, not here.',
  'hard to copy around me.',
  'find, don’t copy.',
];

const el = document.querySelector('.text');
const fx = new TextScramble(el);

let counter = 0;
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    setTimeout(next, 800);
  });
  counter = (counter + 1) % phrases.length;
};

next();