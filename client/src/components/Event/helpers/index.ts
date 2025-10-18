// Helper function to get a color based on name
export const getAvatarColor = (name: string) => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
  ];
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

 // Helper function to extract initials from professor name
 export const getInitials = (name: string) => {
  let cleanName = name.trim();

  // Remove title (Dr., Eng., Prof., etc.) if present
  if (cleanName.includes(".")) {
    const dotIndex = cleanName.indexOf(".");
    cleanName = cleanName.substring(dotIndex + 1).trim();
  }

  const parts = cleanName.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return cleanName[0].toUpperCase();
};