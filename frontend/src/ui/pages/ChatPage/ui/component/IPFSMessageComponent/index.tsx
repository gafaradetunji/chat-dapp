import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import axios from 'axios';

interface IPFSMessageProps {
  contentHash: string;
  variant?: 'body1' | 'body2' | 'h6';
}

interface IPFSContent {
  message: string;
  timestamp: string;
  type?: string;
}

export const IPFSMessage: React.FC<IPFSMessageProps> = ({ contentHash, variant = 'body1' }) => {
  const [message, setMessage] = useState<string>('Loading...');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIPFSContent = async () => {
      if (!contentHash) {
        setMessage('No content');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const gateways = [
          `https://ipfs.io/ipfs/${contentHash}`,
          `https://gateway.pinata.cloud/ipfs/${contentHash}`,
          `https://cloudflare-ipfs.com/ipfs/${contentHash}`,
        ];

        let content: IPFSContent | null = null;

        for (const gateway of gateways) {
          try {
            const response = await axios.get(gateway, {
              timeout: 5000,
            });

            if (response.data) {
              content = response.data;
              break; 
            }
          } catch (gatewayError) {
            console.log(`Failed to fetch from ${gateway}:`, gatewayError);
          }
        }

        if (content) {
          if (typeof content === 'object' && content.message) {
            setMessage(content.message);
          } else if (typeof content === 'string') {
            setMessage(content);
          } else {
            setMessage(JSON.stringify(content));
          }
        } else {
          throw new Error('Failed to fetch from all gateways');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Error fetching IPFS content:', err);
        setError('Failed to load message');
        setMessage('Failed to load message');
      } finally {
        setLoading(false);
      }
    };

    fetchIPFSContent();
  }, [contentHash]);

  if (error) {
    return (
      <Typography variant={variant} color="error">
        {error}
      </Typography>
    );
  }

  return (
    <Typography variant={variant} style={{ opacity: loading ? 0.6 : 1 }}>
      {message}
    </Typography>
  );
};
