import {TruncatedTextProps} from "../types"
import {Tooltip, Typography} from '@mui/material';

export const TruncatedText: React.FC<TruncatedTextProps> = ({ children, maxChars = 40 , fontSize, fontWeight="600"}) => {
  const size:number = children.length;
  const textComponent = (
    <Typography
      variant="body2"
      sx={{
        color: '#1A1A1A',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '100%',
        fontSize: fontSize,
        fontWeight: fontWeight,
        fontFamily: "var(--font-poppins), system-ui, sans-serif"
      }}
    >
      {children}
    </Typography>
  );
  if (size > maxChars) {
    return (
      <Tooltip title={children} arrow placement="top">
        {textComponent}
      </Tooltip>
    );
  }

  // If the text is short, return the Typography component alone
  return textComponent;
}