// Fetch last 50 messages every 2 seconds
async function fetchMessages() {
    try {
        const res = await fetch('/messages');
        const messages = await res.json();
        const chatDiv = document.getElementById('chat');
        chatDiv.innerHTML = '';
        messages.forEach(msg => {
            const p = document.createElement('p');
            p.textContent = `[${msg[2]}] ${msg[0]}: ${msg[1]}`;
            chatDiv.appendChild(p);
        });
        chatDiv.scrollTop = chatDiv.scrollHeight; // scroll to bottom
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

// Send message
async function sendMessage() {
    const username = document.getElementById('username').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!username || !message) return alert('Please enter username and message');

    try {
        await fetch('/send', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, content: message})
        });
        document.getElementById('message').value = '';
        fetchMessages();
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Poll every 2 seconds
setInterval(fetchMessages, 2000);
fetchMessages(); // initial fetch
