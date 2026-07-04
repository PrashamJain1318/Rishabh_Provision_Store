import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const useSocket = (orderId) => {
  const socketRef = useRef();
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      socketRef.current.emit('join_order', orderId);
    });

    socketRef.current.on('location_update', (data) => {
      setDeliveryLocation(data);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [orderId]);

  return { deliveryLocation, isConnected };
};
