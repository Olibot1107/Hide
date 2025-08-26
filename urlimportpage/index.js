// JavaScript code extracted from urlimportpage/index.html

const listURL = "https://olibot1107.github.io/Hide/urlimportpage/list.json";

function setCookie(name, value, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 864e5));
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/`;
}

function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
  }
  return "";
}

function loadSaved() {
  try {
    return JSON.parse(getCookie("websites") || "[]");
  } catch {
    return [];
  }
}

function saveSites(sites) {
  setCookie("websites", JSON.stringify(sites));
}

function siteExists(saved, game) {
  return saved.some(site => site.url === game.url);
}

function renderSites(gameList) {
  const container = document.getElementById("urlList");
  container.innerHTML = "";

  let saved = loadSaved();

  gameList.forEach(game => {
    const exists = siteExists(saved, game);

    const wrapper = document.createElement("div");
    wrapper.className = "site-entry";

    const label = document.createElement("span");
    label.textContent = game.name;
    label.className = exists ? "added" : "not-added";

    const toggle = document.createElement("button");
    toggle.textContent = "Toggle";
    toggle.className = "toggle-btn";
    toggle.onclick = () => {
      let updated = loadSaved();
      const index = updated.findIndex(site => site.url === game.url);
      if (index !== -1) {
        updated.splice(index, 1);
        label.className = "not-added";
      } else {
        updated.push(game);
        label.className = "added";
      }
      saveSites(updated);
    };

    wrapper.appendChild(label);
    wrapper.appendChild(toggle);
    container.appendChild(wrapper);
  });
}

async function loadList() {
  try {
    const res = await fetch(listURL);
    const data = await res.json();
    renderSites(data);
  } catch (err) {
    document.getElementById("urlList").textContent = "Failed to load list.";
    console.error("Error loading list:", err);
  }
}

loadList();