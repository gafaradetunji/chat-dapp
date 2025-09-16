"use client"
import { Group as GroupIcon, Menu as MenuIcon, Send } from "@mui/icons-material";
import { Alert, AppBar, Avatar, Badge, Box, Drawer, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Stack, TextField, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";

export const ChatApp = () => {
  // Mocked users
  const users = ['Alice', 'Bob', 'Charlie'];

  // Add global "Room" chat
  const chats = ['Room', ...users];

  const [selectedChat, setSelectedChat] = useState('Room');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messagesByChat, setMessagesByChat] = useState<Record<string, any[]>>({
    Room: [
      { id: 1, text: "Welcome to the Room 🎉", sender: 'system', timestamp: new Date() },
    ],
    Alice: [
      { id: 1, text: "Hey Alice 👋", sender: 'me', timestamp: new Date() },
    ],
    Bob: [],
    Charlie: [],
  });

  const [message, setMessage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  const messages = messagesByChat[selectedChat] || [];

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'me',
        timestamp: new Date(),
      };

      setMessagesByChat({
        ...messagesByChat,
        [selectedChat]: [...messages, newMessage],
      });

      setMessage('');
    }
  };

  const ChatList = () => (
    <List sx={{ width: 250, p: 2 }}>
      
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Chats
      </Typography>
      {chats.map((chat) => (
        <ListItem key={chat} disablePadding>
          <ListItemButton
            selected={selectedChat === chat}
            onClick={() => {
              setSelectedChat(chat);
              setDrawerOpen(false);
            }}
            sx={{
              mb: 1,
              borderRadius: 2,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: chat === 'Room' ? 'primary.main' : 'secondary.main' }}>
                {chat === 'Room' ? <GroupIcon /> : chat[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={chat} />
            <Badge badgeContent={messagesByChat[chat]?.length || 0} color="primary" />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      {!isMobile && (
        <Paper elevation={3} sx={{ width: 250, overflow: 'auto' }}>
          <ChatList />
        </Paper>
      )}

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { xs: 'block', sm: 'none' } }}
      >
        <ChatList />
      </Drawer>

      {/* Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            {isMobile && (
              <IconButton edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Stack direction="row" width={"100%"} alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {selectedChat}
              </Typography>
              <ConnectButton />
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Chat Messages */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              {msg.sender === 'system' ? (
                <Alert severity="info" sx={{ width: '100%' }}>
                  {msg.text}
                </Alert>
              ) : (
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    backgroundColor: msg.sender === 'me' ? 'primary.main' : 'grey.800',
                    color: 'white',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1">{msg.text}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                    {msg.timestamp.toLocaleTimeString()}
                  </Typography>
                </Paper>
              )}
            </Box>
          ))}
        </Box>

        {/* Input Box */}
        <Paper elevation={3} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder={`Message ${selectedChat}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              variant="outlined"
              size="small"
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
