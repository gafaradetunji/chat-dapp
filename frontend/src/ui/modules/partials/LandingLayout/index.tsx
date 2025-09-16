import { Box, Stack } from "@mui/material";
import { LandingHeader } from "../LandingHeader";
import { LandingFooter } from "../LandingFooter";

type LandingLayoutProps = {
  children?: React.ReactNode
}

export function LandingLayout({
  children
}: LandingLayoutProps) {
 return (
  <Stack minHeight="100vh">
    <LandingHeader />
    <Box
      sx={{
        width: '100%',
        maxWidth: 1920,
        mx: 'auto',
        px: { xs: 2, md: 4, lg: 8, xl: 12 },
      }}
    >
      <Stack flex={1}>
        {children}
      </Stack>
    </Box>
    <LandingFooter />
  </Stack>
 ) 
}
