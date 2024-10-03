console.log('AI Text Detector content script loaded');

function analyzeText() {
  console.log('Analyzing text');
  try {
    const text = document.body.innerText;
    
    // Simple heuristics for potential AI-generated text
    const wordCount = text.split(/\s+/).length;
    const averageSentenceLength = text.split(/[.!?]+/).reduce((sum, sentence) => sum + sentence.split(/\s+/).length, 0) / text.split(/[.!?]+/).length;
    const uniqueWords = new Set(text.toLowerCase().match(/\b\w+\b/g)).size;
    const lexicalDiversity = uniqueWords / wordCount;
    
    // Check for common AI-generated text patterns
    const containsGenericPhrases = /(in conclusion|to summarize|in summary)/i.test(text);
    const containsRepeatedPhrases = /(.*?)\1{2,}/i.test(text);
    
    let score = 0;
    if (averageSentenceLength > 20) score += 0.2;
    if (lexicalDiversity < 0.4) score += 0.2;
    if (containsGenericPhrases) score += 0.3;
    if (containsRepeatedPhrases) score += 0.3;
    
    const likelihood = score * 100;
    console.log(`Analysis complete. Likelihood: ${likelihood.toFixed(1)}%`);
    return `This page has a ${likelihood.toFixed(1)}% chance of containing AI-generated text. (Note: This is a very basic estimate)`;
  } catch (error) {
    console.error('Error in analyzeText:', error);
    return 'An error occurred while analyzing the text.';
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Message received in content script', request);
  if (request.action === "analyze") {
    try {
      const result = analyzeText();
      console.log('Sending response', result);
      sendResponse({result: result});
    } catch (error) {
      console.error('Error in message listener:', error);
      sendResponse({result: 'An error occurred while processing the request.'});
    }
  }
  return true;  // Indicates that we will send a response asynchronously
});

// Send a message to the extension to confirm the content script is loaded
chrome.runtime.sendMessage({action: "contentScriptLoaded"}, function(response) {
  console.log('Content script load confirmation sent');
});