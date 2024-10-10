console.log('AI Text Detector content script loaded');

async function analyzeTextWithHuggingFace(text) {
  const apiKey = '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'; // Replace with your actual Hugging Face API key
  const apiUrl = 'https://api-inference.huggingface.co/models/roberta-base-openai-detector';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: text })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Extract the "Fake" score from the response, which represents the AI-generated probability
    const aiProbability = data[0].find(item => item.label === 'Fake').score; 
    
    // Format the probability as a percentage with two decimal places
    const formattedProbability = (aiProbability * 100).toFixed(2);

    // Return a single sentence with the probability
    return `The probability of this text being AI-generated is ${formattedProbability}%.`;
  } catch (error) {
    console.error('Error in API call:', error);
    return 'An error occurred while analyzing the text with Hugging Face API.';
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "analyze") {
    const text = document.body.innerText;
    analyzeTextWithHuggingFace(text).then(result => {
      sendResponse({result: result});
    });
  }
  return true;  // Indicates that we will send a response asynchronously
});