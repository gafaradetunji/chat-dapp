import { useCallback, useState } from "react";
import axios from "axios";

export const useUploadFile = () => {
  const [hash, setHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to upload file");
      }

      const data = response.data;
      setHash(data.IpfsHash);
      return data.IpfsHash;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { uploadFile, hash, loading, error };
};

export const useUploadMessages = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadMessages = useCallback(async (messageContent: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          pinataContent: {
            message: messageContent,
            timestamp: new Date().toISOString()
          },
          pinataMetadata: {
            name: `chat-message-${Date.now()}.json`
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data;
      setMessage(data.IpfsHash);
      return data.IpfsHash;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Upload error:", err);
      const errorMessage = err.response?.data?.error || err.message || "Upload failed";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { uploadMessages, message, loading, error };
};
