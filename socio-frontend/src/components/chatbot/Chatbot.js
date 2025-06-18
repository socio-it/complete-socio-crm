import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';

function generateReply() {
  const replies = [
    'Hola! Soy un chatbot de demostración.',
    'Gracias por tu mensaje.',
    'Puedes personalizar este chatbot conectándolo con un servicio de IA real.',
    '¡Espero que tengas un excelente día!'
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hola! ¿En qué puedo ayudarte?' }]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    const reply = generateReply();
    setInput('');

    let index = 0;
    const typingMessage = { sender: 'bot', text: '' };
    setMessages((prev) => [...prev, typingMessage]);
    const interval = setInterval(() => {
      index += 1;
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          sender: 'bot',
          text: reply.slice(0, index)
        };
        return newMessages;
      });
      if (index === reply.length) {
        clearInterval(interval);
      }
    }, 40);
  };

  return (
    <Box>
      {!open && (
        <Fab
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1300 }}
        >
          <ChatIcon />
        </Fab>
      )}
      {open && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            width: 320,
            height: 400,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1300
          }}
        >
          <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">Chatbot</Typography>
            <IconButton size="small" onClick={() => setOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, px: 2, overflowY: 'auto' }}>
            {messages.map((msg, idx) => (
              <Box key={idx} sx={{ my: 1, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                <Typography variant="body2" sx={{ display: 'inline-block', bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.300', color: msg.sender === 'user' ? 'primary.contrastText' : 'grey.900', p: 0.5, borderRadius: 1 }}>
                  {msg.text}
                </Typography>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>
          <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <IconButton color="primary" onClick={handleSend}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Chatbot;
