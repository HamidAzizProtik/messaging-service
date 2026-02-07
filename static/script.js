// Original polling-based messaging functions
async function fetchMessages() {
    try {
        const res = await fetch('/messages');
        const messages = await res.json();
        const chatDiv = document.getElementById('chat');
        
        // Store last message to avoid full re-render
        const lastMsg = chatDiv.lastElementChild?.textContent;
        
        chatDiv.innerHTML = '';
        messages.forEach(msg => {
            const p = document.createElement('p');
            p.textContent = `[${new Date(msg[2]).toLocaleTimeString()}] ${msg[0]}: ${msg[1]}`;
            chatDiv.appendChild(p);
        });
        
        // Only scroll if new message added
        if (chatDiv.lastElementChild?.textContent !== lastMsg) {
            chatDiv.scrollTop = chatDiv.scrollHeight;
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

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
fetchMessages();

// Messaging Service - Visual Enhancements (preserves original functionality)
class MessagingService {
    constructor() {
        this.username = '';
        this.isDark = true;
        this.init();
    }

    init() {
        this.cacheDOMElements();
        this.attachEventListeners();
        this.loadFromStorage();
        this.updateStatus();
        this.updateHeader();
    }

    cacheDOMElements() {
        this.usernameInput = document.getElementById('username');
        this.messageInput = document.getElementById('message');
        this.sendBtn = document.getElementById('sendBtn');
        this.headerSubtitle = document.getElementById('header-subtitle');
        this.statusText = document.getElementById('status-text');
    }

    attachEventListeners() {
        // Username input
        this.usernameInput.addEventListener('input', (e) => {
            this.username = e.target.value.trim();
            this.updateStatus();
            this.updateHeader();
            this.saveToStorage();
        });

        // Message input with Enter to send
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Auto-resize textarea
        this.messageInput.addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.scrollHeight, 120) + 'px';
        });

        // Send button
        this.sendBtn.addEventListener('click', () => sendMessage());

        // Particle effects on mouse move
        document.addEventListener('mousemove', (e) => {
            this.createParticleOnMouse(e);
        });
    }

    updateStatus() {
        if (this.username) {
            this.statusText.textContent = `👋 ${this.username} - Online`;
            this.sendBtn.disabled = false;
        } else {
            this.statusText.textContent = 'Ready to chat';
            this.sendBtn.disabled = true;
        }
    }

    updateHeader() {
        if (this.username) {
            this.headerSubtitle.textContent = `Chatting as ${this.username}`;
        } else {
            this.headerSubtitle.textContent = 'Enter your name to start messaging';
        }
    }

    saveToStorage() {
        localStorage.setItem('MessagingService', JSON.stringify({ username: this.username }));
    }

    loadFromStorage() {
        const data = localStorage.getItem('MessagingService');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                this.username = parsed.username || '';
                if (this.username) {
                    this.usernameInput.value = this.username;
                }
            } catch (e) {
                console.error('Failed to load settings:', e);
            }
        }
    }

    createParticleOnMouse(e) {
        if (Math.random() > 0.98) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = e.clientX + 'px';
            particle.style.top = e.clientY + 'px';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = 'rgba(0, 208, 132, 0.5)';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '-1';
            particle.style.animation = 'floatUp 1s ease-out forwards';
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    }
}

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        to {
            opacity: 0;
            transform: translateY(-30px);
        }
    }
`;
document.head.appendChild(style);

// Initialize visual enhancements
const chat = new MessagingService();
