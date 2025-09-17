"use client"
import { useGetPrivateMessages, useGetUsers, useSendPrivateMessages, useUploadMessages } from "@/common";
import { Menu as MenuIcon, Send } from "@mui/icons-material";
import { Alert, AppBar, Avatar, Box, CircularProgress, Drawer, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Stack, TextField, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IPFSMessage } from "./ui/component";



export const ChatApp = () => {
  const allUser = useGetUsers();
  const [selectedChat, setSelectedChat] = useState('Room');
  const [message, setMessage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const { uploadMessages } = useUploadMessages()
  const { sendPrivateMessage } = useSendPrivateMessages()
  const { getPrivateMessages } = useGetPrivateMessages()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [toMessages, setToMessages] = useState<any[]>([]);
  // console.log("Content hash", {
  //   content: `https://ipfs.io/ipfs/${toMessages[0]?.contentHash}`,
  //   context: toMessages[0]?.contentHash
  // })

  useEffect(() => {
    (async () => {
      if(selectedChat) {
        const data = await getPrivateMessages(selectedChat && allUser?.find(u => u.address === selectedChat)?.address as string)
        if(data) {
          // @ts-expect-error hrm
          setToMessages(data)
        }else {
          console.log("No messages found")
        }
      }
    })()
  }, [selectedChat, allUser])

  if(!allUser) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={30} />
    </Box>
  );

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        contentHash: message,
        to: selectedChat && allUser.find(u => u.address === selectedChat)?.address
      };
      if(newMessage.contentHash) {
        const data = await uploadMessages(newMessage.contentHash)
        if(data) {
          const payload = {
            to: newMessage.to,
            contentHash: data
          }
          const messageResponse = await sendPrivateMessage(payload.to as string, payload.contentHash as string)
          if(messageResponse) {
            console.log("Message sent successfully:", messageResponse);
            toast.success(`${messageResponse.status}`)
          } else {
            console.error("Failed to send message");
          }
        }
      }

      // setMessagesByChat({
      //   ...messagesByChat,
      //   [selectedChat]: [...messages, newMessage],
      // });

      // setMessage('');
    }
  };

  const ChatList = () => (
    <List sx={{ width: 250, p: 2 }}>
      
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Chats
      </Typography>
      {allUser.map((chat, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton
            selected={selectedChat === chat.address}
            onClick={() => {
              setSelectedChat(chat.address);
              setDrawerOpen(false);
            }}
            sx={{
              mb: 1,
              borderRadius: 2,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <ListItemAvatar>
              <Avatar 
               src={`https://ipfs.io/ipfs/${chat.avatarHash}`}
              />
            </ListItemAvatar>
            <ListItemText primary={chat.username} />
            {/* <Badge badgeContent={messagesByChat[chat.]?.length || 0} color="primary" /> */}
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
                {selectedChat ? allUser.find(u => u.address === selectedChat)?.username || 'Room' : 'Select a chat'}
              </Typography>
              <ConnectButton />
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Chat Messages */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {toMessages.map((msg) => {
            return (
            <Box
              key={msg.to}
              sx={{
                display: 'flex',
                justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              {msg.sender === 'system' ? (
                <Alert severity="info" sx={{ width: '100%' }}>
                  {`https://ipfs.io/ipfs/${msg.contentHash}`}
                </Alert>
              ) : (
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    backgroundColor: msg.from === 'me' ? 'primary.main' : 'grey.800',
                    color: 'white',
                    borderRadius: 2,
                  }}
                >
                  <IPFSMessage 
                   contentHash={msg.contentHash}
                  />
                </Paper>
              )}
            </Box>
          )})}
        </Box>

        <Paper elevation={3} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder={allUser.length > 0 ? `Message ${allUser.find(u => u.address === selectedChat)?.username}...` : "There is no one to message now"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              variant="outlined"
              size="small"
              disabled={allUser.find(u => u.address === selectedChat)?.username === undefined}
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
