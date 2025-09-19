import { chatContract, publicClient } from "@/common/lib";
import { useCallback, useEffect, useState, useRef } from "react";

interface PastEvent {
  btcEth: bigint;
  btcUsd: bigint;
  ethUsd: bigint;
  timestamp: bigint;
}

interface UseGetPastEventsProps {
  uploadMessages?: (message: string) => Promise<string>;
  sendGroupMessage?: (contentHash: string) => Promise<any>;
  onEventProcessed?: (event: PastEvent) => void;
}

export const useGetPastEvents = ({
  uploadMessages,
  sendGroupMessage,
  onEventProcessed
}: UseGetPastEventsProps = {}) => {
  const [events, setEvents] = useState<PastEvent | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastProcessedTimestamp, setLastProcessedTimestamp] = useState<bigint | null>(null);
  
  const processingRef = useRef(false);
  const lastFetchRef = useRef<number>(0);
  const FETCH_COOLDOWN = 30000; 

  const formatPrice = useCallback((price: bigint): string => {
    return (Number(price) / 1e8).toFixed(8);
  }, []);

  const processLatestEvent = useCallback(async (latestEvent: PastEvent) => {
    if (!uploadMessages || !sendGroupMessage || processingRef.current) {
      return;
    }

    if (lastProcessedTimestamp && latestEvent.timestamp <= lastProcessedTimestamp) {
      console.log("Event already processed, skipping");
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);

    try {
      const eventMessage = `🚨 New Price Update!
       BTC/ETH: ${formatPrice(latestEvent.btcEth)}
       BTC/USD: ${formatPrice(latestEvent.btcUsd)}
       ETH/USD: ${formatPrice(latestEvent.ethUsd)}
       Time: ${new Date(Number(latestEvent.timestamp) * 1000).toLocaleString()}`;

      // console.log("Processing new event:", latestEvent);
      
      const contentHash = await uploadMessages(eventMessage);
      
      if (contentHash) {
        await sendGroupMessage(contentHash);
        setLastProcessedTimestamp(latestEvent.timestamp);
        onEventProcessed?.(latestEvent);
        console.log("Event successfully processed and sent to group");
      }
    } catch (error) {
      console.error("Error processing event:", error);
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, [uploadMessages, sendGroupMessage, onEventProcessed, lastProcessedTimestamp, formatPrice]);

  const fetchEvents = useCallback(async () => {
    const now = Date.now();
    
    if (now - lastFetchRef.current < FETCH_COOLDOWN) {
      console.log("Fetch cooldown active, skipping");
      return;
    }

    try {
      lastFetchRef.current = now;
      
      const logs = await publicClient.getContractEvents({
        address: chatContract.address as `0x${string}`,
        abi: chatContract.abi,
        eventName: "PricePosted",
        fromBlock: BigInt(9230215),
        toBlock: "latest",
      });

      if (logs.length > 0) {
        const latestEvent = logs[logs.length - 1];
        // @ts-expect-error hrm
        const eventArgs = latestEvent.args as PastEvent;
        
        console.log("Latest event fetched:", eventArgs);
        setEvents(eventArgs);

        if (
          lastProcessedTimestamp === null || 
          eventArgs.timestamp > lastProcessedTimestamp
        ) {
          console.log("New event detected, processing...");
          await processLatestEvent(eventArgs);
        } else {
          console.log("No new events to process");
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      lastFetchRef.current = now - FETCH_COOLDOWN + 10000; 
    }
  }, [processLatestEvent, lastProcessedTimestamp]);

  useEffect(() => {
    if (!uploadMessages || !sendGroupMessage) {
      console.log("Required functions not provided, skipping event processing");
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [uploadMessages, sendGroupMessage]); 

  const refetchEvents = useCallback(async () => {
    await fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isProcessing,
    refetchEvents,
    lastProcessedTimestamp
  };
};
