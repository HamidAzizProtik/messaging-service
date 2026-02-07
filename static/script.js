// Fetch messages from server
let lastMessageId = 0;

async function fetchMessages() {
    try {
        const res = await fetch('/messages');
        const messages = await res.json();
        const chatDiv = document.getElementById('messagesArea');
        
        // Only show messages after the last one we saw
        const lastIndex = messages.findIndex(m => new Date(m[2]).getTime() <= lastMessageId);
        const newMessages = lastIndex === -1 ? messages : messages.slice(lastIndex);
        
        newMessages.forEach(msg => {
            const msgTime = new Date(msg[2]).getTime();
            if (msgTime > lastMessageId) {
                lastMessageId = msgTime;
                
                const msgDiv = document.createElement('div');
                const isOwn = msg[0] === document.getElementById('username').value.trim();
                msgDiv.className = `message ${isOwn ? 'own' : 'other'}`;
                
                msgDiv.innerHTML = `
                    <div class="message-bubble">
                        ${isOwn ? '' : '<span class="message-author">' + escapeHtml(msg[0]) + '</span>'}
                        <span class="message-text">${escapeHtml(msg[1])}</span>
                        <span class="message-time">${new Date(msg[2]).toLocaleTimeString()}</span>
                    </div>
                `;
                
                chatDiv.appendChild(msgDiv);
            }
        });
        
        if (newMessages.length > 0) {
            chatDiv.scrollTop = chatDiv.scrollHeight;
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
