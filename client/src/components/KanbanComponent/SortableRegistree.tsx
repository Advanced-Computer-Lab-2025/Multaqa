"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import RegisterBox from "../RegistredComponent/Registree";
import { SortableRegistreeProps } from "./types";

/**
 * Wrapper component that makes Registree draggable using DndKit
 * Does not modify the original Registree component
 */
const SortableRegistree: React.FC<SortableRegistreeProps> = ({
  item,
  onRoleChange,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const handleRoleChange = (newRole: string) => {
    if (onRoleChange) {
      onRoleChange(newRole);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <RegisterBox
        name={item.name}
        id={item.id}
        email={item.email}
        registrationDate={item.registrationDate}
        role={item.role}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
};

export default SortableRegistree;
