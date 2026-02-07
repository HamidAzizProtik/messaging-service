// Fetch messages from server
async function fetchMessages() {
    try {
        const res = await fetch('/messages');
        const messages = await res.json();
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
    const username = document.getElementById('username').value.trim();
    const message = document.getElementById('messageInput').value.trim();
    if (!username || !message) {
        alert('Please enter username and message');
        return;
    }

    try {
        const response = await fetch('/send', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, content: message})
        });
        
        if (response.ok) {
            document.getElementById('messageInput').value = '';
            fetchMessages();
        } else {
            alert('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending message');
    }
}

// Set up event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start polling
    setInterval(fetchMessages, 2000);
    fetchMessages();
    
    // Send button click
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    
    // Enter key in message input
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});
