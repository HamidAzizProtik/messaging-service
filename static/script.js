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
    if (!username || !message) return alert('Please enter username and message');

    try {
        await fetch('/send', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, content: message})
        });
        document.getElementById('messageInput').value = '';
        fetchMessages();
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Poll for new messages every 2 seconds
setInterval(fetchMessages, 2000);
fetchMessages();

// Event listeners
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

document.getElementById('sendBtn').addEventListener('click', sendMessage);
