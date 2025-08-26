// JavaScript code extracted from coderunner.html

const htmlCode = document.getElementById('html-code');
const cssCode = document.getElementById('css-code');
const jsCode = document.getElementById('js-code');
const preview = document.getElementById('preview');

// Load from localStorage or default values
htmlCode.value = localStorage.getItem('code_html') || '<h1>Hello, world!</h1>';
cssCode.value = localStorage.getItem('code_css') || 'body { font-family: Arial; padding: 20px; }';
jsCode.value = localStorage.getItem('code_js') || 'console.log("Welcome!");';

function updatePreview() {
  const html = htmlCode.value;
  const css = `<style>${cssCode.value}</style>`;
  const js = `<script>${jsCode.value}<\/script>`;

  const srcDoc = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      ${css}
    </head>
    <body>
      ${html}
      ${js}
    </body>
    </html>
  `;

  preview.srcdoc = srcDoc;

  // Save in localStorage
  localStorage.setItem('code_html', html);
  localStorage.setItem('code_css', cssCode.value);
  localStorage.setItem('code_js', jsCode.value);
}

htmlCode.addEventListener('input', updatePreview);
cssCode.addEventListener('input', updatePreview);
jsCode.addEventListener('input', updatePreview);

updatePreview();