export const executeCommand = (command: string, value?: string): void => {
  try {
    document.execCommand(command, false, value);
  } catch (error) {
    console.error(`Failed to execute command ${command}:`, error);
  }
};
export const processContentChange = (htmlContent: string) => {
    // This is where you would integrate non-React, non-state logic
    console.log("Utility Logging: Content received, length:", htmlContent.length); 
    //this function would handle:
    // 1. API calls to save content to a backend
};
