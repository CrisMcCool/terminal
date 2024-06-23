const inputField = document.getElementById('input');

inputField.addEventListener('input', function(event) {
  const text = inputField.innerText;
  processInput(text);
});

inputField.addEventListener('keydown', function(event) {
  if (event.key === 'Tab') {
    event.preventDefault();
    insertTab();
  }
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
