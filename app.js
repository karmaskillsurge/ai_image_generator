// Helper function to generate a random string
function generateRandomString(length = 5) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Helper function to query the Hugging Face API
async function query(data, apiUrl) {
    const response = await fetch(apiUrl, {
        headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch image from " + apiUrl);
    }

    const result = await response.blob();
    return result;
}

// Function to handle image generation with multiple APIs
async function generateImage(prompt) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "Generating image...";

    // Add randomness to the prompt to ensure new image every time
    const randomPrompt = `${prompt} ${generateRandomString()}`;

    const apis = [
        "https://api-inference.huggingface.co/models/XLabs-AI/flux-RealismLora",
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev"
    ];

    for (const apiUrl of apis) {
        try {
            const blob = await query({ "inputs": randomPrompt }, apiUrl);
            const url = URL.createObjectURL(blob);
            resultDiv.innerHTML = `<img src="${url}" alt="Generated Image">`;
            return; // Exit once an image is successfully generated
        } catch (error) {
            console.error("Error with API:", apiUrl, error);
        }
    }

    resultDiv.innerHTML = "Failed to generate image from both APIs.";
}

// Event listener for the button
document.getElementById('generateBtn').addEventListener('click', () => {
    const prompt = document.getElementById('prompt').value;
    if (prompt) {
        generateImage(prompt);
    } else {
        alert("Please enter a prompt.");
    }
});
