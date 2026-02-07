console.log('Script loaded');

// Fetch messages from server
async function fetchMessages() {
    try {
        console.log('Fetching messages...');
        const res = await fetch('/messages');
        console.log('Response status:', res.status);
        const messages = await res.json();
        console.log('Messages received:', messages.length);
        const chatDiv = document.getElementById('messagesArea');
        
        chatDiv.innerHTML = '';
        messages.forEach(msg => {
            const p = document.createElement('p');
            p.textContent = `[${new Date(msg[2]).toLocaleTimeString()}] ${msg[0]}: ${msg[1]}`;
            chatDiv.appendChild(p);
        });
        
        chatDiv.scrollTop = chatDiv.scrollHeight;
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

// Send message to server
async function sendMessage() {
    const usernameInput = document.getElementById('username');
    const messageInput = document.getElementById('messageInput');
    const username = usernameInput.value.trim();
    const message = messageInput.value.trim();
    
    console.log('Send attempt - username:', username, 'message:', message);
    
    if (!username || !message) {
        alert('Please enter username and message');
        return;
    }

    try {
        console.log('Sending to /send...');
        const response = await fetch('/send', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, content: message})
        });
        
        console.log('Send response status:', response.status);
        
        if (response.ok) {
            messageInput.value = '';
            fetchMessages();
        } else {
            alert('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending message: ' + error.message);
    }
}

// Set up event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up listeners...');
    
    // Start polling
    setInterval(fetchMessages, 2000);
    fetchMessages();
    
    // Send button click
    const sendBtn = document.getElementById('sendBtn');
    console.log('Send button found:', !!sendBtn);
    sendBtn.addEventListener('click', sendMessage);
    
    // Enter key in message input
    const messageInput = document.getElementById('messageInput');
    console.log('Message input found:', !!messageInput);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    console.log('Setup complete');
});
