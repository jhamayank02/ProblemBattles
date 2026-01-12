import { useEffect, useState } from "react";
import { wsService } from "./websocket";

export function useWebSocket(url: string) {
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState<any>();

  useEffect(() => {
    wsService.connect(url, (data: any) => {
      setMessage(data);
    });

    setConnected(true);

    return () => {
      wsService.disconnect();
      setConnected(false);
    };
  }, [url]);

  return {
    connected,
    message
  };
}
