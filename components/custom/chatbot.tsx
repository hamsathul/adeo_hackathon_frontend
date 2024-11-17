import { useState, useRef, useEffect } from 'react'
import { X, Send, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { io, Socket } from 'socket.io-client'
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation'


interface Message {
  error?: any
  id: string
  content: string
  timestamp: string
  is_bot: boolean
  is_streaming?: boolean
}

interface ChatbotProps {
  isOpen: boolean
  onClose: () => void
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const chatbotRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [, setIsAuthenticated] = useState<boolean>(false)
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<number>(0)
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  interface JWTPayload {
    exp: number;
  }

  useEffect(() => {
    // Get token when component mounts
    const storedToken = localStorage.getItem('token')
	if (storedToken) {
		try {
			const decoded = jwtDecode(storedToken) as { user_id: number };
			const userId = decoded.user_id;
			setUserId(userId);
			setIsAuthenticated(true);
		} catch (error) {
			console.error('Error decoding token:', error);
			router.push('/login');
		}
	}
    setToken(storedToken)
  }, [])


  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Socket.IO connection
  useEffect(() => {
    const connectSocket = async () => {
      if (isOpen && token) {
		  const cleanToken = token.replace('Bearer ', '');
        try {
			const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000', {
				path: '/socket.io',
				transports: ['websocket'],
				withCredentials: true,
				auth: {
				  token: cleanToken // Send clean token without 'Bearer ' prefix
				}
			  });

          socketInstance.on('connect_error', (error) => {
            console.error('Connection Error:', error);
            setIsConnected(false);
          });

          socketInstance.on('connect', () => {
            console.log('Connected to socket server');
            setIsConnected(true);
            
            // Send authentication after connection
            socketInstance.emit('authenticate', { 
              token: token,
              user_id: userId 
            });
          });

          socketInstance.on('auth_response', (data) => {
            console.log('Authentication response:', data);
            if (data.status === 'authenticated') {
              console.log('Successfully authenticated');
            } else {
              console.error('Authentication failed:', data);
              socketInstance.disconnect();
            }
          });

		  socketInstance.on('message_received', (data) => {
			console.log('Message received:', data)
			
			if (data.type === 'user_message') {
			  // Update the temporary message with server data
			  setMessages(prev => prev.map(msg => 
				msg.id.startsWith('temp-') ? {
				  ...msg,
				  id: data.message.id,
				  timestamp: formatTimestamp(data.message.timestamp)
				} : msg
			  ));
			} 
			else if (data.type === 'ai_message_chunk') {
			  setMessages(prev => {
				const existingMessageIndex = prev.findIndex(m => m.id === data.message.id);
				if (existingMessageIndex >= 0) {
				  const updatedMessages = [...prev];
				  updatedMessages[existingMessageIndex] = {
					...updatedMessages[existingMessageIndex],
					content: updatedMessages[existingMessageIndex].content + data.message.content,
					is_streaming: true,
					timestamp: formatTimestamp(data.message.timestamp)
				  };
				  return updatedMessages;
				} else {
				  return [...prev, {
					id: data.message.id,
					content: data.message.content,
					timestamp: formatTimestamp(data.message.timestamp),
					is_bot: true,
					is_streaming: true
				  }];
				}
			  });
			}
			else if (data.type === 'ai_message_complete') {
			  setMessages(prev => {
				const updatedMessages = prev.map(message => 
				  message.id === data.message.id 
					? { 
						...message, 
						content: data.message.content, 
						is_streaming: false,
						timestamp: formatTimestamp(data.message.timestamp)
					  }
					: message
				);
				return updatedMessages;
			  });
			}
		  });
		  
		  // Add error handling for failed messages
		  socketInstance.on('error', (error) => {
			console.error('Socket error:', error);
			// Mark temporary messages as failed if needed
			setMessages(prev => prev.map(msg => 
			  msg.id.startsWith('temp-') 
				? { ...msg, error: true }
				: msg
			));
		  });



      socketInstance.on('disconnect', () => {
        console.log('Disconnected from socket server')
        setIsConnected(false)
      })

      setSocket(socketInstance);

          return () => {
            socketInstance.disconnect();
          };
        } catch (error) {
          console.error('Socket connection error:', error);
          setIsConnected(false);
        }
      }
    };

    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isOpen, token, userId]); // Added token to dependencies

  const formatTimestamp = (timestamp: string) => {
	try {
	  const date = new Date(timestamp);
	  return date.toLocaleTimeString([], { 
		hour: 'numeric', 
		minute: '2-digit',
		hour12: true 
	  });
	} catch (error) {
	  console.error('Error formatting timestamp:', error);
	  return '';
	}
  };

// Modified handleSendMessage
const handleSendMessage = () => {
	const cleanToken = token ? token.replace('Bearer ', '') : null;
	if (inputMessage.trim() && socket && isConnected && token) {
	  // Generate a temporary ID for the message
	  const tempId = `temp-${Date.now()}`;
	  
	  // Add user message immediately to state
	  setMessages(prev => [...prev, {
		id: tempId,
		content: inputMessage.trim(),
		timestamp: formatTimestamp(new Date().toISOString()),
		is_bot: false
	  }]);
  
	  // Emit to server
	  socket.emit('chat_message', {
		content: inputMessage.trim(),
		token: cleanToken,
		timestamp: new Date().toISOString(),
		tempId: tempId  // Send the temp ID to match with server response
	  });
	  setInputMessage('');
	}
  };

  // Add reconnection logic
  useEffect(() => {
    if (!isConnected && socket) {
      const reconnectTimer = setInterval(() => {
        console.log('Attempting to reconnect...');
        socket.connect();
      }, 5000); // Try to reconnect every 5 seconds

      return () => {
        clearInterval(reconnectTimer);
      };
    }
  }, [isConnected, socket]);

  // Add token refresh logic
  useEffect(() => {
    const tokenRefreshTimer = setInterval(() => {
      const storedToken = localStorage.getItem('token');
      if (storedToken !== token) {
        setToken(storedToken);
      }
    }, 1000); // Check token every second

    return () => {
      clearInterval(tokenRefreshTimer);
    };
  }, [token]);

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div ref={chatbotRef} className="bg-gradient-to-b from-gray-100 to-white rounded-3xl w-full max-w-md h-[80vh] flex flex-col shadow-xl">
		<div className="flex justify-between items-center p-6">
            {/* <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6 text-gray-600" />
            </Button> */}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
          <div className="flex-grow px-6 pb-6 overflow-auto">
		  <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
			  </div>
			  <div className="space-y-4">
  {messages.map((message) => (
    <div 
      key={message.id} 
      className={`flex items-start space-x-3 ${message.is_bot ? '' : 'justify-end'}`}
    >
      {message.is_bot && <Avatar className="w-8 h-8 bg-gray-300" />}
      <div 
        className={`
          ${message.is_bot ? 'bg-gray-200' : 'bg-teal-100'}
          ${message.error ? 'border-red-500 border' : ''}
          rounded-2xl p-3 max-w-[80%]
        `}
      >
        <p className="text-sm text-gray-800">{message.content}</p>
        <p className="text-xs text-gray-500 mt-1">
          {message.timestamp}
        </p>
      </div>
    </div>
  ))}
  <div ref={messagesEndRef} />
</div>
          </div>
          <div className="p-6">
            {/* Input section */}
            <div className="relative">
              <input
                type="text"
                placeholder="Ask me about anything"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="w-full p-4 pr-24 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
                {inputMessage && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleSendMessage}
                    disabled={!isConnected}
                    className="mr-1"
                  >
                    <Send className="w-5 h-5 text-teal-500" />
                  </Button>
                )}
                <Button size="icon" variant="ghost">
                  <Mic className="w-5 h-5 text-gray-500" />
                </Button>
              </div>
            </div>
            {!isConnected && (
              <p className="text-xs text-center text-red-500 mt-2">
                Connecting to chat server...
              </p>
            )}
          </div>
        </div>
      </div>
    )
  )
}

export default Chatbot



