"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Divider,
  Stack,
  Typography,
  Skeleton,
} from "@mui/material";
import { api } from "@/api";
import VendorCard, { VendorData } from "./VendorCard";
import ContentWrapper from "@/components/shared/containers/ContentWrapper";
import EmptyState from "@/components/shared/states/EmptyState";
import ErrorState from "@/components/shared/states/ErrorState";

type RawUser = {
  _id: string;
  role: string;
  companyName?: string;
  email: string;
  logo?: string | { url: string };
  taxCard?: string | { url: string };
  status: string;
  [key: string]: any;
};

function mapVendor(user: RawUser): VendorData | null {
  if (user.role !== "vendor") return null;

  let logoUrl: string | undefined = undefined;
  if (user.logo && typeof user.logo === "object" && "url" in user.logo) {
    logoUrl = (user.logo as any).url;
  } else if (typeof user.logo === "string") {
    logoUrl = user.logo;
  }

  let taxCardUrl: string | undefined = undefined;
  if (
    user.taxCard &&
    typeof user.taxCard === "object" &&
    "url" in user.taxCard
  ) {
    taxCardUrl = (user.taxCard as any).url;
  } else if (typeof user.taxCard === "string") {
    taxCardUrl = user.taxCard;
  }

  return {
    id: user._id,
    companyName: user.companyName || "Unknown Vendor",
    email: user.email,
    logoUrl,
    taxCardUrl,
    status: user.status,
  };
}

export default function AllVendorsList() {
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/users");

      const payload = response.data?.data ?? response.data ?? [];

      const mapped = (Array.isArray(payload) ? payload : [])
        .map((entry) => mapVendor(entry as RawUser))
        .filter((entry): entry is VendorData => Boolean(entry));

      setVendors(mapped);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Unable to load vendors.";
      setError(message);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const content = () => {
    if (loading) {
      return (
        <Stack spacing={3}>
          <Box>
            <Skeleton width={200} height={24} sx={{ mb: 1.5 }} />
            <Stack spacing={2.5}>
              {[1, 2, 3].map((i) => (
                <Box
                  key={i}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    background: "#ffffff",
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2.5}
                    alignItems="center"
                    width="100%"
                  >
                    <Skeleton
                      variant="circular"
                      width={56}
                      height={56}
                      sx={{ flexShrink: 0 }}
                    />
                    <Stack spacing={1} width="60%">
                      <Skeleton variant="text" width="40%" height={32} />
                      <Skeleton variant="text" width="30%" height={24} />
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      );
    }

    if (error) {
      return (
        <ErrorState
          title="Failed to load vendors"
          description={error}
          onCtaClick={fetchVendors}
        />
      );
    }

    if (vendors.length === 0) {
      return (
        <EmptyState
          title="No vendors found"
          description="There are no registered vendors in the system."
        />
      );
    }

    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {vendors.map((vendor) => (
          <Box
            key={vendor.id}
            sx={{
              width: { xs: "100%", md: "calc((100% - 32px) / 3)" },
            }}
          >
            <VendorCard vendor={vendor} />
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <ContentWrapper
        title="All Vendors"
        description="View all registered vendors and their documents."
        headerMarginBottom={3}
      >
        <Box sx={{ flex: 1, overflow: "auto", pr: 1 }}>{content()}</Box>
      </ContentWrapper>
    </Box>
  );
}
