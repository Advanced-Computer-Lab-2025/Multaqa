
// Example Usage Component
"use client"
import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Box } from '@mui/material';
import { SortableTicket } from '../RegistredComponent/SortableTicket';
import RegisterBox from '../RegistredComponent/Registree';

interface RegisterData {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  role: string;
}

export const RegisterBoxList: React.FC = () => {
  const [items, setItems] = useState<RegisterData[]>([
    {
      id: '1',
      name: 'Salma Tarek',
      email: 'salma@gmail.com',
      registrationDate: '25/08/2025',
      role: 'N/A',
    },
    {
      id: '2',
      name: 'Ahmed Hassan',
      email: 'ahmed@gmail.com',
      registrationDate: '26/08/2025',
      role: 'Staff',
    },
    {
      id: '3',
      name: 'Nour Mohamed',
      email: 'nour@gmail.com',
      registrationDate: '27/08/2025',
      role: 'TA',
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRoleChange = (id: string, newRole: string) => {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, role: newRole } : item
      )
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <Box sx={{ padding: 4 }}>
          {items.map((item) => (
            <SortableTicket key={item.id} id={item.id}>
              <RegisterBox
                name={item.name}
                id={item.id}
                email={item.email}
                registrationDate={item.registrationDate}
                role={item.role}
                onRoleChange={(newRole) => handleRoleChange(item.id, newRole)}
              />
            </SortableTicket>
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );
};