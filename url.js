// JavaScript code extracted from url.html

const params = new URLSearchParams(window.location.search);
const url = params.get("url");

if (!url) {
  const error = document.getElementById("error");
  error.style.display = "flex";
  error.innerHTML = "⚠️ No URL provided.<br><img src='https://olibot1107.github.io/Hide/url.gif' alt='funny gif'>";
} else {
  const fullUrl = url.startsWith("http") ? url : "https://" + url;
  const iframe = document.getElementById("iframe");

  const errorTimeout = setTimeout(() => {
    document.getElementById("error").style.display = "flex";
  }, 4000);

  iframe.onload = () => clearTimeout(errorTimeout);
  iframe.src = fullUrl;
}