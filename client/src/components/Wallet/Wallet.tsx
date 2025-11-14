import { Box, Typography, Paper } from '@mui/material';
import theme from "@/themes/lightTheme";
import { User, ArrowUp, ArrowDown } from 'lucide-react';
import WalletBalance from './WalletBalance';
import React from 'react'
import PreviousTransactions from './PreviousTransactions';


interface WalletProps {
  userID: string;
  userInfo: any;
}

const Wallet = ({userID, userInfo}: WalletProps) => {
  const dummyTransactions = [
    {
      "type": "payment",
      "date": "2025-10-02",
      "amount": 150.75,
      "event_name": "Tech Conference 2025"
    },
    {
      "type": "refund",
      "date": "2025-10-10",
      "amount": 50.00,
      "event_name": "Music Fest Cairo"
    },
    {
      "type": "payment",
      "date": "2025-09-28",
      "amount": 299.99,
      "event_name": "Startup Summit"
    },
    {
      "type": "payment",
      "date": "2025-11-05",
      "amount": 75.00,
      "event_name": "AI Workshop"
    },
    {
      "type": "refund",
      "date": "2025-08-14",
      "amount": 20.50,
      "event_name": "Cooking Masterclass"
    },
    {
      "type": "payment",
      "date": "2025-10-25",
      "amount": 120.00,
      "event_name": "Design Thinking Bootcamp"
    },
    {
      "type": "payment",
      "date": "2025-11-10",
      "amount": 89.99,
      "event_name": "Photography 101"
    },
    {
      "type": "refund",
      "date": "2025-11-11",
      "amount": 89.99,
      "event_name": "Photography 101"
    },
    {
      "type": "payment",
      "date": "2025-07-30",
      "amount": 45.00,
      "event_name": "Coding for Beginners"
    },
    {
      "type": "payment",
      "date": "2025-09-12",
      "amount": 200.00,
      "event_name": "Startup Networking Night"
    }
  ];

  return (
    <>
      <WalletBalance userInfo={userInfo} currentBalance={userInfo.walletBalance} transactions={dummyTransactions}/>
      <PreviousTransactions transactions={dummyTransactions}/>
    </>
  );
}

export default Wallet
