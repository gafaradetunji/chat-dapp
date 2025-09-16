import { Box, Divider, Grid, Stack, Typography } from "@mui/material";

export function LandingFooter() {
  return (
    <Box
      component="footer"
      sx={{
        background: '#1a1a2e',
        color: 'white',
        py: 6,
        width: '100%',
        maxWidth: 1920,
        mx: 'auto',
        px: { xs: 2, md: 4, lg: 8, xl: 12 },
        marginTop: '100px'
      }}
    >
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            ChatDapp
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            The future of decentralized messaging. Connect, chat, and own your digital identity.
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Quick Links
          </Typography>
          <Stack spacing={1}>
            {['About', 'Features', 'Pricing', 'Documentation'].map((link) => (
              <Typography 
                key={link} 
                variant="body2" 
                sx={{ 
                  cursor: 'pointer',
                  opacity: 0.8,
                  '&:hover': { opacity: 1 }
                }}
              >
                {link}
              </Typography>
            ))}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Community
          </Typography>
          <Stack spacing={1}>
            {['Discord', 'Twitter', 'GitHub', 'Telegram'].map((social) => (
              <Typography 
                key={social} 
                variant="body2" 
                sx={{ 
                  cursor: 'pointer',
                  opacity: 0.8,
                  '&:hover': { opacity: 1 }
                }}
              >
                {social}
              </Typography>
            ))}
          </Stack>
        </Grid>
      </Grid>
      <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />
      <Typography variant="body2" align="center" sx={{ opacity: 0.6 }}>
        &copy; {new Date().getFullYear()} Web3Chat. All rights reserved. Built with ❤️ on the EVM.
      </Typography>
    </Box>
  )
}
