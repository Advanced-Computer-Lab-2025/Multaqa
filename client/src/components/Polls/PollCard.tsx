"use client";

import React, { useState } from "react";
import { Box, Typography, RadioGroup, FormControlLabel, LinearProgress, Avatar, Chip } from "@mui/material";
import { Poll } from "@/types/poll";
import CustomRadio from "@/components/shared/input-fields/CustomRadio";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import { votePoll } from "@/services/pollService";
import { toast } from "react-toastify";
import NeumorphicBox from "@/components/shared/containers/NeumorphicBox";
import { Clock, CheckCircle } from "lucide-react";

interface PollCardProps {
  poll: Poll;
  readOnly?: boolean;
}

const PollCard: React.FC<PollCardProps> = ({ poll, readOnly = false }) => {
  const [selectedVendorId, setSelectedVendorId] = useState<string>("");
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [localPoll, setLocalPoll] = useState<Poll>(poll);

  const handleVote = async () => {
    if (!selectedVendorId) return;

    setVoting(true);

    // Handle test/mock polls without backend
    if (poll.id.startsWith("test-poll-")) {
      setTimeout(() => {
        toast.success("Vote submitted successfully! (Demo)");
        setHasVoted(true);
        
        setLocalPoll(prev => ({
          ...prev,
          options: prev.options.map(opt => 
            opt.vendorId === selectedVendorId 
              ? { ...opt, voteCount: opt.voteCount + 1 } 
              : opt
          )
        }));
        setVoting(false);
      }, 1000);
      return;
    }

    try {
      await votePoll(poll.id, selectedVendorId);
      toast.success("Vote submitted successfully!");
      setHasVoted(true);
      
      // Optimistically update the UI
      setLocalPoll(prev => ({
        ...prev,
        options: prev.options.map(opt => 
          opt.vendorId === selectedVendorId 
            ? { ...opt, voteCount: opt.voteCount + 1 } 
            : opt
        )
      }));
    } catch (error) {
      console.error("Failed to vote", error);
      toast.error("Failed to submit vote");
    } finally {
      setVoting(false);
    }
  };

  const totalVotes = localPoll.options.reduce((acc, curr) => acc + curr.voteCount, 0);
  const showResults = readOnly || hasVoted;
  const endDate = new Date(localPoll.endDate);
  const isExpired = new Date() > endDate;

  return (
    <Box 
      className="mb-4 w-full h-full flex flex-col" 
      sx={{
        borderRadius: "12px",
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        transition: "all 0.2s",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
          <Typography variant="subtitle1" fontWeight="700" color="text.primary" sx={{ lineHeight: 1.2, fontSize: "0.95rem" }}>
            {localPoll.title}
          </Typography>
          {isExpired && (
            <Chip label="Ended" color="default" size="small" sx={{ height: 20, fontSize: "0.65rem" }} />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: "0.75rem", minHeight: "32px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {localPoll.description}
        </Typography>
        
        <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary", fontSize: "0.75rem" }}>
          <Clock size={14} style={{ marginRight: 4 }} />
          <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
            Ends: {endDate.toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1 }}>
        {!showResults && !isExpired ? (
          <Box>
            <RadioGroup
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
              sx={{ mb: 2 }}
            >
              {localPoll.options.map((option) => (
                <Box 
                  key={option.vendorId}
                  sx={{ 
                    mb: 1, 
                    p: 0.75, 
                    borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: selectedVendorId === option.vendorId ? "primary.main" : "divider",
                    bgcolor: selectedVendorId === option.vendorId ? "primary.lighter" : "transparent",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "grey.50",
                      borderColor: selectedVendorId === option.vendorId ? "primary.main" : "grey.400"
                    },
                    cursor: "pointer"
                  }}
                  onClick={() => setSelectedVendorId(option.vendorId)}
                >
                  <FormControlLabel
                    value={option.vendorId}
                    control={<CustomRadio size="small" sx={{ p: 0.5 }} />}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar 
                          src={option.vendorLogo} 
                          alt={option.vendorName} 
                          sx={{ width: 20, height: 20, mr: 1 }}
                        />
                        <Typography variant="body2" fontWeight={selectedVendorId === option.vendorId ? "600" : "400"} sx={{ fontSize: "0.8rem" }}>
                          {option.vendorName}
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0, width: "100%", pointerEvents: "none" }} 
                  />
                </Box>
              ))}
            </RadioGroup>
            
            <CustomButton
              onClick={handleVote}
              disabled={!selectedVendorId || voting}
              variant="contained"
              fullWidth
              size="small"
              label={voting ? "..." : "Vote"}
              sx={{ py: 0.5, fontSize: "0.8rem" }}
            />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {localPoll.options
              .sort((a, b) => b.voteCount - a.voteCount)
              .map((option, index) => {
                const percentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
                const isSelected = option.vendorId === selectedVendorId;
                const isWinner = index === 0 && totalVotes > 0;
                
                return (
                  <Box key={option.vendorId}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar 
                          src={option.vendorLogo} 
                          alt={option.vendorName} 
                          sx={{ width: 18, height: 18, mr: 0.75 }}
                        />
                        <Typography variant="caption" fontWeight={isSelected ? "bold" : "normal"} sx={{ fontSize: "0.75rem" }}>
                          {option.vendorName}
                        </Typography>
                        {isSelected && (
                          <CheckCircle size={12} color="#4caf50" style={{ marginLeft: 4 }} />
                        )}
                      </Box>
                      <Typography variant="caption" fontWeight="600" sx={{ fontSize: "0.75rem" }}>
                        {percentage.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={percentage} 
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: "grey.100",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: isWinner ? "success.main" : "primary.main",
                          borderRadius: 2,
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: "block", textAlign: "right", fontSize: "0.65rem" }}>
                      {option.voteCount} votes
                    </Typography>
                  </Box>
                );
              })}
            
            <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px solid", borderColor: "divider", textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                Total Votes: {totalVotes}
              </Typography>
              {hasVoted && (
                <Typography variant="caption" color="success.main" fontWeight="500" sx={{ display: "block", mt: 0.5, fontSize: "0.7rem" }}>
                  Thanks for voting!
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PollCard;
