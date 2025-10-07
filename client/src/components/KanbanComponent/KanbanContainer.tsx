"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import { Box } from "@mui/material";
import KanbanColumn from "./KanbanColumn";
import RegisterBox from "../RegistredComponent/Registree";
import { KanbanContainerProps, KanbanItem, KanbanStatus } from "./types";
import {
  filterItemsByStatus,
  moveItem,
  getColumnConfig,
  countItemsByStatus,
} from "./utils";

/**
 * KanbanContainer - Main container component that manages the Kanban board
 * Handles drag and drop logic between columns
 */
const KanbanContainer: React.FC<KanbanContainerProps> = ({
  items,
  onItemsChange,
  onRoleChange,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [localItems, setLocalItems] = useState<KanbanItem[]>(items);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're dragging over a column (status)
    const validStatuses: KanbanStatus[] = ["pending", "accepted", "rejected"];
    if (validStatuses.includes(overId as KanbanStatus)) {
      const activeItem = localItems.find((item) => item.id === activeId);
      if (activeItem && activeItem.status !== overId) {
        const updatedItems = moveItem(localItems, activeId, overId as KanbanStatus);
        setLocalItems(updatedItems);
        if (onItemsChange) {
          onItemsChange(updatedItems);
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're dropping on a column
    const validStatuses: KanbanStatus[] = ["pending", "accepted", "rejected"];
    if (validStatuses.includes(overId as KanbanStatus)) {
      const activeItem = localItems.find((item) => item.id === activeId);
      if (activeItem && activeItem.status !== overId) {
        const updatedItems = moveItem(localItems, activeId, overId as KanbanStatus);
        setLocalItems(updatedItems);
        if (onItemsChange) {
          onItemsChange(updatedItems);
        }
      }
    }

    setActiveId(null);
  };

  const handleRoleChange = (id: string, newRole: string) => {
    const updatedItems = localItems.map((item) =>
      item.id === id ? { ...item, role: newRole } : item
    );
    setLocalItems(updatedItems);
    if (onRoleChange) {
      onRoleChange(id, newRole);
    }
    if (onItemsChange) {
      onItemsChange(updatedItems);
    }
  };

  // Get active item for drag overlay
  const activeItem = localItems.find((item) => item.id === activeId);

  // Define columns
  const columns: { status: KanbanStatus }[] = [
    { status: "pending" },
    { status: "accepted" },
    { status: "rejected" },
  ];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: "32px",
          padding: {
            xs: "24px 16px",
            sm: "24px 48px",
            md: "24px 64px",
            lg: "24px 80px",
            xl: "24px 120px",
          },
          width: "100%",
          maxWidth: "1600px",
          margin: "0 auto",
          backgroundColor: "#e5e7eb",
          minHeight: "100vh",
        }}
      >
        {columns.map(({ status }) => {
          const config = getColumnConfig(status);
          const columnItems = filterItemsByStatus(localItems, status);
          const count = countItemsByStatus(localItems, status);

          return (
            <KanbanColumn
              key={status}
              title={config.title}
              status={status}
              items={columnItems}
              count={count}
              color={config.color}
              onRoleChange={handleRoleChange}
            />
          );
        })}
      </Box>

      {/* Drag Overlay - Shows the item being dragged */}
      <DragOverlay>
        {activeItem ? (
          <Box
            sx={{
              opacity: 0.8,
              transform: "rotate(5deg)",
              cursor: "grabbing",
            }}
          >
            <RegisterBox
              name={activeItem.name}
              id={activeItem.id}
              email={activeItem.email}
              registrationDate={activeItem.registrationDate}
              role={activeItem.role}
            />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanContainer;
