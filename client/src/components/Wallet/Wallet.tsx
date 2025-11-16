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
    "event_name": "Music Festival 2025",
    "amount": 350,
    "wallet_amount": 100,
    "card_amount": 250,
    "type": "payment",
    "date": "2025-03-12"
  },
  {
    "event_name": "Tech Conference",
    "amount": 500,
    "wallet_amount": 0,
    "card_amount": 500,
    "type": "payment",
    "date": "2025-04-01"
  },
  {
    "event_name": "Art Expo",
    "amount": 200,
    "wallet_amount": 50,
    "card_amount": 150,
    "type": "refund",
    "date": "2025-04-15"
  },
  {
    "event_name": "Marathon 10K",
    "amount": 150,
    "wallet_amount": 150,
    "card_amount": 0,
    "type": "payment",
    "date": "2025-05-02"
  },
  {
    "event_name": "Cooking Workshop",
    "amount": 120,
    "wallet_amount": 20,
    "card_amount": 100,
    "type": "refund",
    "date": "2025-06-18"
  },
  {
    "event_name": "Gaming Expo",
    "amount": 450,
    "wallet_amount": 200,
    "card_amount": 250,
    "type": "payment",
    "date": "2025-07-09"
  },
  {
    "event_name": "Business Seminar",
    "amount": 300,
    "wallet_amount": 0,
    "card_amount": 300,
    "type": "refund",
    "date": "2025-08-21"
  },
  {
    "event_name": "Coding Bootcamp",
    "amount": 900,
    "wallet_amount": 400,
    "card_amount": 500,
    "type": "payment",
    "date": "2025-09-30"
  },
  {
    "event_name": "Charity Gala",
    "amount": 250,
    "wallet_amount": 50,
    "card_amount": 200,
    "type": "payment",
    "date": "2025-10-11"
  },
  {
    "event_name": "Photography Workshop",
    "amount": 180,
    "wallet_amount": 30,
    "card_amount": 150,
    "type": "refund",
    "date": "2025-11-03"
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
