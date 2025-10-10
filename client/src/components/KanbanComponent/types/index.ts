export type KanbanStatus = "pending" | "accepted" | "rejected";

export interface KanbanItem {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  role: string;
  status: KanbanStatus;
}

export interface KanbanColumnProps {
  title: string;
  status: KanbanStatus;
  items: KanbanItem[];
  count: number;
  color: {
    background: string;
    border: string;
    text: string;
    badge: string;
  };
  onRoleChange?: (id: string, newRole: string) => void;
}

export interface KanbanContainerProps {
  items: KanbanItem[];
  onItemsChange?: (items: KanbanItem[]) => void;
  onRoleChange?: (id: string, newRole: string) => void;
}

export interface SortableRegistreeProps {
  item: KanbanItem;
  onRoleChange?: (role: string) => void;
}
