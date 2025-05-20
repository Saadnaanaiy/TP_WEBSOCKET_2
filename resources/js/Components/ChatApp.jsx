import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function ChatApp() {
    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState({});
    const [joined, setJoined] = useState(false);
    const [typing, setTyping] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3001');
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);


    useEffect(() => {
        if (!socket) return;


        socket.on('chat_message', (data) => {
            setMessages(prev => [...prev, data]);

            setTyping(null);
        });

        socket.on('user_joined', (data) => {
            setMessages(prev => [
                ...prev,
                {
                    id: 'system',
                    message: `${data.username} has joined the chat`,
                    timestamp: new Date().toISOString()
                }
            ]);
        });

        socket.on('user_left', (data) => {
            setMessages(prev => [
                ...prev,
                {
                    id: 'system',
                    message: `${data.username} has left the chat`,
                    timestamp: new Date().toISOString()
                }
            ]);
        });

        socket.on('user_list', (userList) => {
            setUsers(userList);
        });

        

        return () => {
            socket.off('chat_message');
            socket.off('user_joined');
            socket.off('user_left');
            socket.off('user_list');
            socket.off('user_typing');
        };
    }, [socket]);

  
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

   
    const joinInChat = (e) => {
        e.preventDefault();
        if (!username.trim()) return;
        
        socket.emit('user_join', username);
        setJoined(true);
    };

    const SendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        socket.emit('chat_message', { message });
        setMessage('');
    };

    const Typing = () => {
        socket.emit('typing');
    };

    // Format timestamp
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!joined) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Join the Chat</h1>
                        <p className="mt-2 text-gray-600">Enter a username to get started</p>
                    </div>
                    <form onSubmit={joinInChat} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your username"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Join Chat
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <div className="flex-1 p-4 overflow-hidden">
                <div className="flex h-full">
                    {/* User list sidebar */}
                    <div className="w-1/4 p-4 mr-4 overflow-y-auto bg-white rounded-lg shadow">
                        <h2 className="mb-4 text-xl font-bold">Online Users</h2>
                        <ul className="space-y-2">
                            {Object.values(users).map((user, index) => (
                                <div key={index} className='flex items-center justify-evenly'>
                                <li className="p-2 rounded-md hover:bg-gray-100">
                                    {user}
                                </li>
                                <div className='w-2 h-2 rounded-full bg-green-700'></div>
                                
                                </div>
                                
                            ))}
                        </ul>
                    </div>
                    
                    {/* Chat area */}
                    <div className="flex flex-col flex-1 bg-white rounded-lg shadow">
                        <div className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-4">
                                {messages.map((msg, index) => (
                                    <div 
                                        key={index} 
                                        className={`flex ${msg.id === socket.id ? 'justify-end' : 'justify-start'} ${msg.id === 'system' ? 'justify-center' : ''}`}
                                    >
                                        <div 
                                            className={`max-w-xs p-3 rounded-lg ${
                                                msg.id === 'system' 
                                                    ? 'bg-gray-200 text-gray-600 text-sm italic' 
                                                    : msg.id === socket.id 
                                                        ? 'bg-indigo-500 text-white' 
                                                        : 'bg-gray-200 text-gray-800'
                                            }`}
                                        >
                                            {msg.id !== 'system' && (
                                                <div className="mb-1 text-xs font-bold">
                                                    {msg.id === socket.id ? 'You' : msg.username}
                                                </div>
                                            )}
                                            <div>{msg.message}</div>
                                            {msg.timestamp && (
                                                <div className="mt-1 text-xs text-right">
                                                    {formatTime(msg.timestamp)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {typing && (
                                    <div className="flex justify-start">
                                        <div className="max-w-xs p-2 text-sm italic text-gray-500 bg-gray-100 rounded-lg">
                                            {typing} is typing...
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                        
                        {/* Message input */}
                        <div className="p-4 border-t border-gray-200">
                            <form onSubmit={SendMessage} className="flex">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={Typing}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Type a message..."
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-indigo-600 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
