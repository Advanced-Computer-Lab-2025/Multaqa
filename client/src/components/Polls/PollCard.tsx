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
    <NeumorphicBox 
      className="mb-6 w-full h-full flex flex-col" 
      borderRadius="24px"
      padding="24px"
    >
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Typography variant="h6" fontWeight="700" color="text.primary" sx={{ lineHeight: 1.3 }}>
            {localPoll.title}
          </Typography>
          {isExpired && (
            <Chip label="Ended" color="default" size="small" />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: "40px" }}>
          {localPoll.description}
        </Typography>
        
        <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary", fontSize: "0.875rem" }}>
          <Clock size={16} style={{ marginRight: 6 }} />
          <Typography variant="caption">
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
              sx={{ mb: 3 }}
            >
              {localPoll.options.map((option) => (
                <Box 
                  key={option.vendorId}
                  sx={{ 
                    mb: 1.5, 
                    p: 1.5, 
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: selectedVendorId === option.vendorId ? "primary.main" : "transparent",
                    bgcolor: selectedVendorId === option.vendorId ? "primary.lighter" : "transparent",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "grey.50"
                    }
                  }}
                >
                  <FormControlLabel
                    value={option.vendorId}
                    control={<CustomRadio />}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar 
                          src={option.vendorLogo} 
                          alt={option.vendorName} 
                          sx={{ width: 32, height: 32, mr: 1.5 }}
                        />
                        <Typography fontWeight={selectedVendorId === option.vendorId ? "600" : "400"}>
                          {option.vendorName}
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0, width: "100%" }}
                  />
                </Box>
              ))}
            </RadioGroup>
            
            <CustomButton
              onClick={handleVote}
              disabled={!selectedVendorId || voting}
              variant="contained"
              fullWidth
              label={voting ? "Submitting..." : "Vote Now"}
            />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {localPoll.options
              .sort((a, b) => b.voteCount - a.voteCount)
              .map((option, index) => {
                const percentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
                const isSelected = option.vendorId === selectedVendorId;
                const isWinner = index === 0 && totalVotes > 0;
                
                return (
                  <Box key={option.vendorId}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar 
                          src={option.vendorLogo} 
                          alt={option.vendorName} 
                          sx={{ width: 24, height: 24, mr: 1 }}
                        />
                        <Typography variant="body2" fontWeight={isSelected ? "bold" : "normal"}>
                          {option.vendorName}
                        </Typography>
                        {isSelected && (
                          <CheckCircle size={14} color="#4caf50" style={{ marginLeft: 6 }} />
                        )}
                      </Box>
                      <Typography variant="caption" fontWeight="600">
                        {percentage.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={percentage} 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "grey.100",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: isWinner ? "success.main" : "primary.main",
                          borderRadius: 4,
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", textAlign: "right" }}>
                      {option.voteCount} votes
                    </Typography>
                  </Box>
                );
              })}
            
            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider", textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">
                Total Votes: {totalVotes}
              </Typography>
              {hasVoted && (
                <Typography variant="body2" color="success.main" fontWeight="500" sx={{ mt: 0.5 }}>
                  Thanks for voting!
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </NeumorphicBox>
  );
};

export default PollCard;
