/**
 * Capitalizes each word in a name string
 * Handles single names, multiple names, and edge cases
 * 
 * @param name - The name string to capitalize (e.g., "omar mohammed" or "john")
 * @returns Capitalized name (e.g., "Omar Mohammed" or "John")
 * 
 * @example
 * capitalizeFullName("omar mohammed") // "Omar Mohammed"
 * capitalizeFullName("john") // "John"
 * capitalizeFullName("mary jane watson") // "Mary Jane Watson"
 */
export const capitalizeFullName = (name: string | null | undefined): string => {
  if (!name) return "";
  
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

