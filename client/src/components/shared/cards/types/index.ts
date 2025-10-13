import type { ChipProps, SxProps, Theme } from "@mui/material";

export interface ActionCardProps {
  title: string;
  type?:string;
  leftIcon?: React.ReactNode;
  tags?: Array<{ label: React.ReactNode; size?: ChipProps["size"] } & Partial<ChipProps>>;
  subtitleNode?: React.ReactNode;
  metaNodes?: React.ReactNode[];
  rightSlot?: React.ReactNode;
  children?: React.ReactNode;
  expanded?: boolean;
  details?: React.ReactNode;
  sx?: SxProps<Theme>;
  headerSx?: SxProps<Theme>;
  detailsSx?: SxProps<Theme>;
  background?: string;
  borderColor?: string;
  elevation?: "none" | "soft" | "strong";
  onExpandChange?: (expanded: boolean) => void;
}