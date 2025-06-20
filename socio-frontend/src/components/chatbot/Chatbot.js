import { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  TextField,
  Paper,
  Typography,
  Fab,
  Divider,
  CircularProgress
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';

import Image from 'next/image';      // ⬅️  NEW
import { keyframes } from '@mui/system';

/* -------------------- ANIMACIÓN SUAVE -------------------- */
const float = keyframes`
  0%   { transform: translateY(0);      }
  50%  { transform: translateY(-85px);   }
  100% { transform: translateY(0);      }
`;

/* -------------------- BLOQUE DE “ESPERANDO…” -------------------- */
const WaitingForForm = () => (
  <Box
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      textAlign: 'center'
    }}
  >
    {/* Avatar flotando */}
    <Box
      sx={{
        width: 150,
        height: 150,
        mb: 2,
        animation: `${float} 5s ease-in-out infinite`
      }}
    >
      <Image
        src="/ai-agent.png"   // ⬅️ Ruta a tu imagen
        alt="Agente IA"
        width={150}
        height={150}
        priority
        style={{ objectFit: 'contain' }}
      />
    </Box>

    {/* Mensaje */}
    <Typography variant="caption" sx={{ opacity: 0.8 }}>
      Esperando información del formulario...
    </Typography>
  </Box>
);



function generateReply() {
  const replies = [
    'Hola! Soy un chatbot de demostración.',
    'Gracias por tu mensaje.',
    'Puedes personalizar este chatbot conectándolo con un servicio de IA real.',
    '¡Espero que tengas un excelente día!'
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

const Chatbot = ({ embedded = false, firstMessage, proposal }) => {
  const [open, setOpen] = useState(embedded);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [initialLoaded, setInitialLoaded] = useState(false);
  const messagesEndRef = useRef(null);
  const isUserMessageRef = useRef(false);

  // Scroll automático
  useEffect(() => {
    if (isUserMessageRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    isUserMessageRef.current = false;
  }, [messages]);

  // Cargar mensaje inicial cuando llega
  useEffect(() => {
    if (!initialLoaded && firstMessage) {
      setMessages([{ sender: 'user', text: firstMessage }]);
      setInitialLoaded(true);
    }
  }, [firstMessage, initialLoaded]);

  // Cargar mensaje inicial cuando llega
  useEffect(() => {
    if (proposal) {
      setMessages((prev) => [...prev,{ sender: 'bot', text: proposal }]);
      setInitialLoaded(true);
    }
  }, [proposal]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input.trim() };
    isUserMessageRef.current = true;
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const reply = generateReply();
    const typingMessage = { sender: 'bot', text: '' };
    setMessages((prev) => [...prev, typingMessage]);

    let index = 0;
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
      if (index === reply.length) clearInterval(interval);
    }, 40);
  };

  const chatBox = (
    <Paper
      elevation={embedded ? 1 : 4}
      sx={{
        position: embedded ? 'relative' : 'fixed',
        bottom: embedded ? 'auto' : 24,
        right: embedded ? 'auto' : 24,
        width: embedded ? '100%' : 360,
        height: 480,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        zIndex: 50,
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'transparent',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="subtitle1">Consultor Virtual</Typography>
        {!embedded && (
          <IconButton onClick={() => setOpen(false)} sx={{ color: 'inherit' }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Mensajes */}
      <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
        {!initialLoaded ? (
          <WaitingForForm /> 
        ) : (
          <>
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  my: 1
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    bgcolor:
                      msg.sender === 'user' ? 'white' : 'rgba(255, 255, 255, 0.15)',
                    color: msg.sender === 'user' ? '#000' : '#fff',
                    borderRadius: 2,
                    maxWidth: '75%',
                    boxShadow: 1
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Input */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          disabled={!initialLoaded}
          sx={{
            bgcolor: 'white',
            borderRadius: 2
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!initialLoaded || !input.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );

  return (
    <Box>
      {embedded ? (
        chatBox
      ) : (
        <>
          {!open && (
            <Fab
              color="primary"
              onClick={() => setOpen(true)}
              sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100 }}
            >
              <ChatIcon />
            </Fab>
          )}
          {open && chatBox}
        </>
      )}
    </Box>
  );
};

export default Chatbot;
