from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)
DB = 'messages.db'

def init_db():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    return render_template('chat.html')

@app.route('/messages', methods=['GET'])
def get_messages():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('SELECT username, content, timestamp FROM messages ORDER BY id DESC LIMIT 50')
    rows = c.fetchall()
    conn.close()
    rows.reverse()
    return jsonify(rows)

@app.route('/send', methods=['POST'])
def send_message():
    data = request.get_json()
    username = data.get('username')
    content = data.get('content')
    if not username or not content:
        return jsonify({'status': 'error', 'message': 'Missing username or content'}), 400

    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('INSERT INTO messages (username, content) VALUES (?, ?)', (username, content))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
