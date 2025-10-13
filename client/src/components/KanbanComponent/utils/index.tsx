import { KanbanItem, KanbanStatus } from "../types";

/**
 * Filter items by their status
 */
export const filterItemsByStatus = (
  items: KanbanItem[],
  status: KanbanStatus
): KanbanItem[] => {
  return items.filter((item) => item.status === status);
};

/**
 * Move an item from one status to another
 */
export const moveItem = (
  items: KanbanItem[],
  itemId: string,
  newStatus: KanbanStatus
): KanbanItem[] => {
  return items.map((item) =>
    item.id === itemId ? { ...item, status: newStatus } : item
  );
};

/**
 * Reorder items within the same status
 */
export const reorderItems = (
  items: KanbanItem[],
  status: KanbanStatus,
  startIndex: number,
  endIndex: number
): KanbanItem[] => {
  // Get items for this status
  const statusItems = filterItemsByStatus(items, status);
  
  // Get items from other statuses
  const otherItems = items.filter((item) => item.status !== status);
  
  // Reorder the status items
  const [removed] = statusItems.splice(startIndex, 1);
  statusItems.splice(endIndex, 0, removed);
  
  // Combine and return
  return [...otherItems, ...statusItems];
};

/**
 * Get column configuration based on status
 */
export const getColumnConfig = (status: KanbanStatus) => {
  const configs = {
    pending: {
      title: "Applicants",
      color: {
        background: "#FEF5F3",
        border: "#FF9B85",
        text: "#FF9B85",
        badge: "#FF9B85",
      },
    },
    accepted: {
      title: "Shortlist",
      color: {
        background: "#FFFBF0",
        border: "#FFD966",
        text: "#E6C200",
        badge: "#FFD966",
      },
    },
    rejected: {
      title: "Rejected",
      color: {
        background: "#F5F5F5",
        border: "#B0B0B0",
        text: "#666666",
        badge: "#B0B0B0",
      },
    },
  };

  return configs[status];
};

/**
 * Count items by status
 */
export const countItemsByStatus = (
  items: KanbanItem[],
  status: KanbanStatus
): number => {
  return filterItemsByStatus(items, status).length;
};

/**
 * Generate mock data for testing
 */
export const generateMockKanbanData = (): KanbanItem[] => {
  return [
    {
      id: "1",
      name: "Salma Tarek Soliman",
      email: "salma.soliman@example.com",
      registrationDate: "15/12/2024",
      role: "N/A",
      status: "pending",
    },
    {
      id: "2",
      name: "Hatem Yasser Soliman",
      email: "hatem.soliman@example.com",
      registrationDate: "14/12/2024",
      role: "N/A",
      status: "pending",
    },
    {
      id: "3",
      name: "Mahmoud ElKabbany",
      email: "mahmoud.elkabbany@example.com",
      registrationDate: "13/12/2024",
      role: "N/A",
      status: "pending",
    },
    {
      id: "4",
      name: "Mohammed Sultan",
      email: "mohammed.sultan@example.com",
      registrationDate: "12/12/2024",
      role: "Staff",
      status: "accepted",
    },
    {
      id: "5",
      name: "Layla Khaled",
      email: "layla.khaled@example.com",
      registrationDate: "11/12/2024",
      role: "TA",
      status: "accepted",
    },
    {
      id: "6",
      name: "Yasmeen Tarek",
      email: "yasmeen.tarek@example.com",
      registrationDate: "10/12/2024",
      role: "Professor",
      status: "rejected",
    },
  ];
};
