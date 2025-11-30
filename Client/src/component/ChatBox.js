import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

function ChatBox({ socketRef, roomId, username }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const messageEndRef = useRef(null);

    // Function to send a message
    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const msgData = { roomId, username, message: message.trim() };
            
            // Ensure socketRef.current exists before emitting
            if (socketRef?.current) {
                socketRef.current.emit('send-message', msgData);
                setMessages((prevMessages) => [...prevMessages, msgData]); // Immediately add the message to the UI
                setMessage('');
            } else {
                toast.error('Connection not established.');
            }
        } else {
            toast.error('Message cannot be empty');
        }
    };

    useEffect(() => {
        const handleIncomingMessage = (msgData) => {
            setMessages((prevMessages) => [...prevMessages, msgData]);
        };

        // Check if socketRef is defined before subscribing
        if (socketRef?.current) {
            socketRef.current.on('receive-message', handleIncomingMessage);
        }

        // Scroll to the bottom of the chat only when messages change
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }

        return () => {
            // Clean up event listeners
            if (socketRef?.current) {
                socketRef.current.off('receive-message', handleIncomingMessage);
            }
        };
    }, [socketRef, messages]);

    const chatboxStyle = {
        width: '620%', // Fix width to match the UI
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#282A36',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
    };

    const chatboxHeaderStyle = {
        borderBottom: '1px solid #444',
        paddingBottom: '5px',
        marginBottom: '10px',
    };

    const chatboxMessagesStyle = {
        flex: 1,
        overflowY: 'auto', // Enable vertical scrolling
        margin: '10px 0',
        padding: '5px',
        borderRadius: '5px',
        backgroundColor: '#1E1E2F',
    };

    const messageStyle = {
        margin: '5px 0',
        padding: '8px',
        borderRadius: '5px',
        color: '#fff',
    };

    const sentMessageStyle = {
        ...messageStyle,
        textAlign: 'right',
        backgroundColor: '#007bff',
    };

    const receivedMessageStyle = {
        ...messageStyle,
        backgroundColor: '#444',
    };

   const chatboxInputStyle = {
    display: 'flex',
    flexDirection: 'column', // stack vertically
    marginTop: '10px',
};

const inputStyle = {
    padding: '8px',
    marginBottom: '5px', // add space before button
    border: '1px solid #444',
    borderRadius: '5px',
    backgroundColor: '#282A36',
    color: '#fff',
};

const buttonStyle = {
    padding: '8px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
};

    return (
        <div style={chatboxStyle}>
            <div style={chatboxHeaderStyle}>
                <h4>Chat</h4>
            </div>
            <div style={chatboxMessagesStyle}>
                {messages.map((msg, index) => (
                    <div key={index} style={msg.username === username ? sentMessageStyle : receivedMessageStyle}>
                        <strong>{msg.username}:</strong> {msg.message}
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>
            <form onSubmit={sendMessage} style={chatboxInputStyle}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={inputStyle}
                />
                
                <button type="submit" style={buttonStyle}>Send</button>
            </form>
        </div>
    );
}

export default ChatBox;
