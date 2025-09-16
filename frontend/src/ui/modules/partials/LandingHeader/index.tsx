import { AppBar, Stack, Toolbar, Typography } from "@mui/material";
import { Chat as ChatIcon } from "@mui/icons-material"
import { ToggleScheme } from "./ui/component";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function LandingHeader() {
  return (
    <AppBar
      position="sticky" 
      sx={{ 
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'none',
        padding: '8px 16px',
        zIndex: 999,
        top: 0,
        left: 0,
        width: '100%',
        maxWidth: 1920,
        mx: 'auto',
        px: { xs: 2, md: 4, lg: 8, xl: 12 }
      }}
    >
      <Toolbar>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent={"space-between"} width="100%">
          <Stack direction="row" spacing={1} alignItems="center">
            <ChatIcon sx={{ mr: 2, fontSize: 28 }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: "1.5rem" }}>
              ChatDapp
            </Typography>  
          </Stack>
          <Stack direction="row" spacing={4} alignItems="center">
            <ToggleScheme />
            <ConnectButton />
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}