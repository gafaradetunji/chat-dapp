"use client"
import { useGetGroupMessages, useGetPrivateMessages, useGetUsers, useSendGroupMessages, useSendPrivateMessages, useUploadMessages, useWatchPrivateMessages } from "@/common";
import { Group, Menu as MenuIcon, Person, Send } from "@mui/icons-material";
import { Alert, AppBar, Avatar, Box, CircularProgress, Drawer, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Stack, Tab, Tabs, TextField, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { IPFSMessage } from "./ui/component";
import { useAccount } from "wagmi";
import { redirect } from "next/navigation";

const dummyGroups = [
  {
    id: 'general',
    name: 'General',
    lastMessage: 'Welcome to the general discussion!',
  }
];

export const ChatApp = () => {
  const allUser = useGetUsers();
  const { address, isConnected } = useAccount();
  const [selectedChat, setSelectedChat] = useState('Room');
  const [message, setMessage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const isMobile = useMediaQuery('(max-width:600px)');
  const { uploadMessages } = useUploadMessages()
  const { sendPrivateMessage } = useSendPrivateMessages()
  const { getPrivateMessages } = useGetPrivateMessages()
  const { sendGroupMessage } = useSendGroupMessages()
  const { getGroupMessages } = useGetGroupMessages()
  // @ts-ignore
  const [toMessages, setToMessages] = useState<any[]>([]);
  // @ts-ignore
  const [groupMessages, setGroupMessages] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if(selectedChat && activeTab === 0) {
        const data = await getPrivateMessages(selectedChat && allUser?.find(u => u.address === selectedChat)?.address as string)
        if(data) {
          // @ts-expect-error hrm
          setToMessages(data)
        } else {
          console.log("No messages found")
        }
      } else if (activeTab === 1 && selectedChat) {
        const data = await getGroupMessages();
        if(data) {
          // @ts-expect-error hrm
          setGroupMessages(data);
        }
      }
    })()
  }, [selectedChat, allUser, activeTab])

  const refreshMessages = useCallback(async () => {
    if(selectedChat && allUser && activeTab === 0) {
      const targetUser = allUser.find(u => u.address === selectedChat);
      if (targetUser) {
        const data = await getPrivateMessages(targetUser.address);
        if(data) {
          // @ts-expect-error hrm
          setToMessages(data);
        }
      }
    }
  }, [selectedChat, allUser, getPrivateMessages, activeTab]);

  useWatchPrivateMessages(() => {
    if (activeTab === 0) {
      refreshMessages();
      toast.info("New message received!");
    }
  });

  useEffect(() => {
    if (activeTab === 0) {
      refreshMessages();
    }
  }, [refreshMessages, activeTab]);

  if(!isConnected) return redirect('/')

  if(!allUser) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={30} />
    </Box>
  );

  const handleSendMessage = async () => {
    if (message.trim()) {
      if (activeTab === 0) {
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
              toast.success("Message sent successfully");
              setMessage('');
            } else {
              console.error("Failed to send message");
            }
          }
        }
      } else {
        const data = await uploadMessages(message);
          if(data) {
            const messageResponse = await sendGroupMessage(data);
            if(messageResponse) {
              toast.success("Group message sent successfully");
              setMessage('');
            } else {
              console.error("Failed to send group message");
            }
        }
      }
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSelectedChat(newValue === 0 ? (allUser[0]?.address || 'Room') : 'general');
  };

  const PrivateChatList = () => (
    <List sx={{ width: '100%', p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Person fontSize="small" />
        Private Chats
      </Typography>
      {allUser.map((chat, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton
            selected={selectedChat === chat.address && activeTab === 0}
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
            <ListItemText 
              primary={chat.username} 
              secondary="Online"
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  const GroupChatList = () => (
    <List sx={{ width: '100%', p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Group fontSize="small" />
        Groups
      </Typography>
      {dummyGroups.map((group) => (
        <ListItem key={group.id} disablePadding>
          <ListItemButton
            selected={selectedChat === group.id && activeTab === 1}
            onClick={() => {
              setSelectedChat(group.id);
              setDrawerOpen(false);
            }}
            sx={{
              mb: 1,
              borderRadius: 2,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <Group />
              </Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary={group.name} 
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  const ChatSidebar = () => (
    <Box sx={{ width: 280 }}>
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Private" icon={<Person fontSize="small" />} />
        <Tab label="Groups" icon={<Group fontSize="small" />} />
      </Tabs>
      
      {activeTab === 0 ? <PrivateChatList /> : <GroupChatList />}
    </Box>
  );

  const getCurrentChatName = () => {
    if (activeTab === 0) {
      return selectedChat ? allUser.find(u => u.address === selectedChat)?.username : 'Select a chat';
    } else {
      return dummyGroups.find(g => g.id === selectedChat)?.name || 'Select a group';
    }
  };

  const getCurrentMessages = () => {
    return activeTab === 0 ? toMessages : groupMessages;
  };

  const getPlaceholderText = () => {
    if (activeTab === 0) {
      return allUser.length > 0 ? `Message ${allUser.find(u => u.address === selectedChat)?.username}...` : "There is no one to message now";
    } else {
      const group = dummyGroups.find(g => g.id === selectedChat);
      return group ? `Message ${group.name}...` : "Select a group to message";
    }
  };

  const isInputDisabled = () => {
    if (activeTab === 0) {
      return allUser.find(u => u.address === selectedChat)?.username === undefined;
    }
    return false;
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      {!isMobile && (
        <Paper elevation={3} sx={{ width: 280, overflow: 'auto' }}>
          <ChatSidebar />
        </Paper>
      )}

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { xs: 'block', sm: 'none' } }}
      >
        <ChatSidebar />
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {activeTab === 1 && <Group fontSize="small" />}
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {getCurrentChatName()}
                </Typography>
                {/* {activeTab === 1 && selectedChat && (
                  <Typography variant="caption" color="text.secondary">
                    {dummyGroups.find(g => g.id === selectedChat)?.memberCount} members
                  </Typography>
                )} */}
              </Box>
              <ConnectButton />
            </Stack>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {getCurrentMessages().map((msg) => {
            return (
            <Box
              key={msg.timestamp || msg.id}
              sx={{
                display: 'flex',
                justifyContent: (activeTab === 0 ? msg.from === address : msg.from === address) ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              {msg.from === 'system' ? (
                <Alert severity="info" sx={{ width: '100%' }}>
                  {activeTab === 0 ? `https://ipfs.io/ipfs/${msg.contentHash}` : msg.contentHash}
                </Alert>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, maxWidth: '70%' }}>
                  {activeTab === 1 && msg.from !== address && (
                    <Avatar 
                      src={`https://ipfs.io/ipfs/${msg.avatar}`}
                      sx={{ width: 32, height: 32 }}
                    />
                  )}
                  <Box>
                    {activeTab === 1 && msg.from !== address && (
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        {msg.username}
                      </Typography>
                    )}
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        backgroundColor: (activeTab === 0 ? msg.from === address : msg.from === address) ? 'primary.main' : 'grey.800',
                        color: 'white',
                        borderRadius: 2,
                      }}
                    >
                      <IPFSMessage 
                       contentHash={msg.contentHash}
                      />
                    </Paper>
                  </Box>
                </Box>
              )}
            </Box>
          )})}
        </Box>

        <Paper elevation={3} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder={getPlaceholderText()}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              variant="outlined"
              size="small"
              disabled={isInputDisabled()}
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
