"use client"
import { AppModal } from "@/ui/modules/component";
import { LandingLayout } from "@/ui/modules/partials";
import { ArrowForward, Public, Security, Speed, Star, TrendingUp } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { ProfileForm } from "./ui/component";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function HomePage() {
  const [open, setOpen] = useState<boolean>(false)
  const { isConnected } = useAccount();
  const router = useRouter();

  const handleRegisterUser = async () => {
    if(!isConnected) return toast.error("Please connect your wallet");
    setOpen(true)
  } 

  return (
    <LandingLayout>
      <Grid container spacing={6} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}
         sx={{
          height: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
         }}
        >          
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
            Decentralized Chat,
            <br />
            <span style={{ 
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Reimagined
            </span>
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Connect, chat, and own your identity with ENS domains. 
            Experience the future of messaging with Web3 integration.
          </Typography>
          <Stack direction="row" spacing={2}>
            {isConnected ? (
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  py: 2,
                  px: 4,
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 5px 10px 2px rgba(255, 105, 135, .3)',
                  }
                }}
                onClick={() => router.push('/chat')}
              >
                Go to Chat
              </Button>
            ): (
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  py: 2,
                  px: 4,
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 5px 10px 2px rgba(255, 105, 135, .3)',
                  }
                }}
                onClick={handleRegisterUser}
              >
                Get Started
              </Button>
            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              p: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            <Stack spacing={3}>
              {[
                { icon: <Star />, text: "100% Decentralized" },
                { icon: <Security />, text: "End-to-End Encrypted" },
                { icon: <TrendingUp />, text: "ENS Domain Integration" },
              ].map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>{item.icon}</Avatar>
                  <Typography variant="h6">{item.text}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
      <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 'bold' }}>
        What We Offer
      </Typography>
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {[
          {
            icon: <Public />,
            title: "ENS Domain Username",
            description: "Get your unique ENS domain directly from our platform. Own your digital identity forever."
          },
          {
            icon: <Security />,
            title: "Secure Messaging",
            description: "Military-grade encryption ensures your conversations remain private and secure."
          },
          {
            icon: <Speed />,
            title: "Lightning Fast",
            description: "Built on cutting-edge Web3 infrastructure for instant, reliable messaging."
          },
        ].map((feature, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)',
                }
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto',
                    mb: 3,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  }}
                >
                  {feature.icon}
                </Avatar>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <AppModal open={open} handleClose={() => setOpen(false)} label="profile-modal">
        <ProfileForm handleClose={() => setOpen(false)} />
      </AppModal>
    </LandingLayout>
  )
}
