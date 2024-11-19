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
import { Sparkles } from 'lucide-react'

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
            console.log('Message received:', data);

            const formatDubaiTimestamp = (timestamp: string) => {
              try {
                const date = new Date(timestamp);
                const options: Intl.DateTimeFormatOptions = {
                  timeZone: 'Asia/Dubai',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                };
                return date.toLocaleTimeString([], options);
              } catch (error) {
                console.error('Error formatting timestamp:', error);
                return '';
              }
            };

            if (data.type === 'user_message') {
              // Update the temporary message with server data
              setMessages(prev => prev.map(msg =>
                msg.id.startsWith('temp-') ? {
                  ...msg,
                  id: data.message.id,
                  timestamp: formatDubaiTimestamp(data.message.timestamp)
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
                    timestamp: formatDubaiTimestamp(data.message.timestamp)
                  };
                  return updatedMessages;
                } else {
                  return [...prev, {
                    id: data.message.id,
                    content: data.message.content,
                    timestamp: formatDubaiTimestamp(data.message.timestamp),
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
                      timestamp: formatDubaiTimestamp(data.message.timestamp)
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
        <div
          ref={chatbotRef}
          className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-3xl w-full max-w-md h-[80vh] flex flex-col shadow-xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-0.5">
            <Button className="rounded-full p-2 bg-blur hover:bg-blur-20 transition duration-300" variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5 text-white" />
            </Button>
          </div>
          {/* Chat messages */}
          <div className="flex-grow px-6 pb-6 overflow-auto">
            <div className="flex flex-col items-center mb-8 mt-10">
             <div className="w-16 h-16 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full relative flex items-center justify-center">
              {/* Halo Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/20 via-white/10 to-transparent blur-lg animate-pulse"></div>              {/* Animated Pulsating Circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white-400 via-pink-200 to-blue-200 blur-lg opacity-70 animate-pulse"></div>
              {/* Sparkles Icon */}
              <Sparkles
                className="relative w-10 h-10 text-white z-10"
                strokeWidth={1.1}
              />
            </div>
          </div>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.is_bot ? "" : "justify-end"
                  }`}
                >
                  {message.is_bot && <Avatar className="w-8 h-8 bg-gray-300" />}
                  <div
                    className={`${
                      message.is_bot
                        ? "bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200"
                        : "bg-gradient-to-r from-teal-100 via-green-100 to-yellow-100"
                    } ${
                      message.error ? "border-red-500 border" : ""
                    } rounded-2xl p-3 max-w-[80%]`}
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
  
          {/* Input Section */}
          <div className=" rounded-full bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask me about anything"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="w-full p-4 pr-24 bg-white rounded-full text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <Send className="w-5 h-5 text-blue-500" />
                  </Button>
                )}
                <Button size="icon" variant="ghost">
                  <Mic className="w-5 h-5 text-blue-500" />
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
  );  
}

export default Chatbot