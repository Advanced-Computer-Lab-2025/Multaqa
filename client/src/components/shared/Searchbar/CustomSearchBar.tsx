"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  InputAdornment,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import SearchTextField from "./SearchTextField";
import SearchIcon from "@mui/icons-material/Search";
import NeumorphicBox from "../containers/NeumorphicBox";
import { CustomSearchProps } from "./types";
import CustomIcon from "../Icons/CustomIcon";
import theme from "@/themes/lightTheme";

interface CustomSearchBarProps extends CustomSearchProps {
  storageKey?: string;
  autoSaveDelay?: number;
}

const CustomSearchBar: React.FC<CustomSearchBarProps> = ({
  icon = false,
  width = "100%",
  type = "inwards",
  label = "Search Events...",
  value,
  onChange,
  storageKey = "searchHistory",
  autoSaveDelay = 2000,
}) => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load search history from localStorage on mount (only once)
  useEffect(() => {
    const savedHistory = localStorage.getItem(storageKey);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setSearchHistory(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error("Failed to parse search history:", error);
        setSearchHistory([]);
      }
    } else {
      const demoHistory = [
        "hall b",
        "conference",
        "workshop",
        "gym session",
        "bazaar",
      ];
      setSearchHistory(demoHistory);
    }
  }, [storageKey]);

  // Save search history to localStorage
  const saveSearchHistory = useCallback((query: string) => {
    if (!query.trim()) return;

    setSearchHistory((prevHistory) => {
      const normalizedQuery = query.trim().toLowerCase();
      const updatedHistory = [
        normalizedQuery,
        ...prevHistory.filter((item) => item !== normalizedQuery),
      ].slice(0, 10);

      localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  }, [storageKey]);

  // Auto-save search query after delay
  useEffect(() => {
    if (!value || !value.trim()) {
      return;
    }

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveSearchHistory(value);
    }, autoSaveDelay);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [value, autoSaveDelay, saveSearchHistory]);

  // Filter suggestions based on current input
  useEffect(() => {
    if (value && value.trim()) {
      const query = value.toLowerCase();
      const filtered = searchHistory
        .filter((item) => item.includes(query) && item !== query)
        .slice(0, 5);

      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
    }
  }, [value, searchHistory]);

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
    },
    [onChange]
  );

  // Handle suggestion click
  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      const syntheticEvent = {
        target: { value: suggestion },
      } as React.ChangeEvent<HTMLInputElement>;

      if (onChange) {
        onChange(syntheticEvent);
      }
      setShowSuggestions(false);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [onChange]
  );

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle focus to show suggestions
  const handleFocus = useCallback(() => {
    if (!value || !value.trim()) {
      // Show full history when input is empty
      setFilteredSuggestions(searchHistory.slice(0, 5));
      setShowSuggestions(searchHistory.length > 0);
    } else if (filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [value, searchHistory, filteredSuggestions.length]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        position: "relative",
      }}
    >
      <NeumorphicBox
        containerType={type}
        width="w-fit"
        borderRadius="50px"
        padding="2px"
      >
        <SearchTextField
          ref={inputRef}
          id="outlined-basic"
          label={label}
          variant="outlined"
          size="small"
          color="primary"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          sx={{ width: width }}
          InputProps={{
            endAdornment: icon ? (
              <InputAdornment position="end">
                <SearchIcon color="primary" />
              </InputAdornment>
            ) : null,
          }}
        />
      </NeumorphicBox>

      {/* Suggestions indicator */}
      {value && filteredSuggestions.length > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: "-35px",
            right: icon ? "32px" : "0px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#fff",
            backgroundColor: theme.palette.primary.main,
            padding: "4px 12px",
            borderRadius: "20px",
            border: `2px solid ${theme.palette.primary.dark}`,
            boxShadow: "0 4px 12px rgba(98, 153, 208, 0.4)",
            animation: "bounce 0.6s ease-in-out",
            "@keyframes bounce": {
              "0%, 20%, 50%, 80%, 100%": {
                transform: "translateY(0)",
              },
              "40%": {
                transform: "translateY(-4px)",
              },
              "60%": {
                transform: "translateY(-2px)",
              },
            },
            "&:hover": {
              transform: "scale(1.05)",
              transition: "all 0.2s ease",
            },
          }}
        >
          ✨ {filteredSuggestions.length} suggestion
          {filteredSuggestions.length !== 1 ? "s" : ""}
        </Box>
      )}

      {/* Autocomplete Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <Paper
          ref={suggestionsRef}
          elevation={3}
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 1,
            maxHeight: "200px",
            overflow: "hidden",
            borderRadius: "12px",
            border: `2px solid ${theme.palette.primary.main}`,
            boxShadow: "0 8px 24px rgba(98, 153, 208, 0.3)",
            backgroundColor: "#fff",
            width: "calc(100% - 24px)",
            animation: "slideDown 0.3s ease-out",
            "@keyframes slideDown": {
              "0%": {
                opacity: 0,
                transform: "translateY(-10px) scale(0.95)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0) scale(1)",
              },
            },
          }}
        >
          <List
            dense
            sx={{
              padding: 0,
              overflow: "hidden",
              width: "100%",
            }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{
                  cursor: "pointer",
                  borderRadius: "8px",
                  mx: 1,
                  my: 0.5,
                  width: "calc(100% - 24px) !important",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light + "30",
                    transform: "translateX(4px)",
                    transition: "all 0.2s ease",
                  },
                }}
              >
                <ListItemText
                  primary={suggestion}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontSize: "14px",
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {!icon && (
        <CustomIcon
          icon="search"
          size="medium"
          containerType={type}
          sx={{
            color: theme.palette.primary.main,
            borderColor: " rgba(0, 0, 0, 0.3);",
            "&:hover": {
              borderColor: theme.palette.primary.main,
            },
          }}
        />
      )}
    </div>
  );
};

export default CustomSearchBar;