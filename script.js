const inputField = document.getElementById('input');
const uploadIcon = document.getElementById('upload-icon');
const downloadIcon = document.getElementById('download-icon');
const fileUpload = document.getElementById('file-upload');
const uploadTooltip = document.getElementById('upload-tooltip');
const downloadTooltip = document.getElementById('download-tooltip');

// Handle input changes for paired characters
inputField.addEventListener('input', function(event) {
  const text = inputField.innerText;
  processInput(text);
});

// Handle tab key for indentation
inputField.addEventListener('keydown', function(event) {
  if (event.key === 'Tab') {
    event.preventDefault();
    insertTab();
  }
});

// Upload file functionality
uploadIcon.addEventListener('click', function() {
  fileUpload.click();
});

fileUpload.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      inputField.innerText = e.target.result;
    };
    reader.readAsText(file);
  }
});

// Download file functionality
downloadIcon.addEventListener('click', function() {
  const text = inputField.innerText;
  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'output.txt'; // Default download file name
  link.click();
});

function processInput(input) {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;
    if (textNode.nodeType === Node.TEXT_NODE) {
      const text = textNode.nodeValue;
      const cursorPosition = range.startOffset;

      // Handle paired characters
      let newText = handlePairedCharacters(text, cursorPosition);

      // Update the text node with modified content
      textNode.nodeValue = newText;

      // Restore cursor position
      range.setStart(textNode, cursorPosition);
      range.setEnd(textNode, cursorPosition);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}

function handlePairedCharacters(text, cursorPosition) {
  // Define pairs of characters to auto-insert
  const pairs = {
    '(': ')',
    '{': '}',
    '[': ']',
    '"': '"',
    '\'': '\''
  };

  // Iterate over each pair
  for (let [openChar, closeChar] of Object.entries(pairs)) {
    if (text[cursorPosition - 1] === openChar && text[cursorPosition] === closeChar) {
      // If the cursor is between an opening and closing pair, skip insertion
      cursorPosition++;
    } else if (text[cursorPosition - 1] === openChar && text[cursorPosition] !== closeChar) {
      // If the cursor is after an opening pair without a closing pair, insert the closing pair
      text = text.substring(0, cursorPosition) + closeChar + text.substring(cursorPosition);
      cursorPosition++;
    }
  }

  return text;
}

function insertTab() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const tabNode = document.createTextNode('    '); // 4 spaces
    range.insertNode(tabNode);
    range.setStartAfter(tabNode);
    range.setEndAfter(tabNode);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
