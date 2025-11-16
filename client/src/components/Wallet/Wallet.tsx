import { Box, Typography, Paper } from '@mui/material';
import theme from "@/themes/lightTheme";
import { User, ArrowUp, ArrowDown } from 'lucide-react';
import WalletBalance from './WalletBalance';
import React,{useState, useEffect} from 'react'
import PreviousTransactions from './PreviousTransactions';
import { api } from "@/api";
import { set } from 'mongoose';


interface WalletProps {
  userID: string;
  userInfo: any;
}

const Wallet = ({userID, userInfo}: WalletProps) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // async function handleCallAPI() {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       const res = await api.get("/users/transactions");
  //       setTransactions(res.data.transactions);
  //     } catch (err) {
  //       console.error(err);
  //       setError("Failed to load Transactions. Please try again later.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  // useEffect(() => {
  //   handleCallAPI();
  // }, []);


  return (
    <>
      <WalletBalance userInfo={userInfo} currentBalance={userInfo.walletBalance} transactions={userInfo.transactions}/>
      <PreviousTransactions transactions={userInfo.transactions}/>
    </>
  );
}

export default Wallet
