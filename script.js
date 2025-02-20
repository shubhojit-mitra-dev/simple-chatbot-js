const API_KEY = 'AIzaSyDZUjujZ9i8t2Ng-agLEwY3m-zdiHzcygc';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

async function generateResponse(prompt) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        })
    });

    if (!response.ok) {
        throw new Error('Failed to generate response');
    }
    const data = await response.json();
    console.log(data);
    return data.candidates[0].content.parts[0].text;
}

function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('flex', 'mb-4', isUser ? 'justify-end' : 'justify-start');

    const messageContent = document.createElement('div');
    messageContent.classList.add('p-2', 'rounded-lg', 'max-w-xs', 'break-words', isUser ? 'bg-blue-500' : 'bg-gray-700', 'text-white');

    messageContent.textContent = message;
    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleUserInput() {
    const userMessage = userInput.value.trim();

    if (userMessage) {
        addMessage(userMessage, true);
        userInput.value = '';
        sendButton.disabled = true;
        userInput.disabled = true;
        try {
            const botMessage = await generateResponse(userMessage);
            addMessage(botMessage, false);
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, I encountered an error. Please try again.', false);
        } finally {
            sendButton.disabled = false;
            userInput.disabled = false;
            userInput.focus();
        }
    }
}

sendButton.addEventListener('click', handleUserInput);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleUserInput();
    }
});
