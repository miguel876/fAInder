document.getElementById('checkButton').addEventListener('click', function() {
  const resultElement = document.getElementById('result');
  resultElement.textContent = 'Analyzing...';

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "analyze"}, function(response) {
      console.log(chrome.runtime)
      console.log(response)
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        resultElement.textContent = 'Error: Could not connect to the page. Make sure you\'re on a web page and try reloading.';
      } else if (response && response.result) {
        resultElement.textContent = response.result;
      } else {
        resultElement.textContent = 'Error: Received an unexpected response.';
      }
    });
  });
});