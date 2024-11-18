'use client';

import React from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Opinion, Status } from '../types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanOpinion } from './KanbanOpinion';

interface KanbanBoardDndProps {
  columns: Status[];
  filteredOpinions: Opinion[];
  handleDragStart: any;
  handleDragEnd: any;
  handleAddOpinion: (status: Status, data: any) => void;
  handleEditOpinion: (opinionId: string, data: any) => void;
  handleDeleteOpinion: (opinionId: string) => void;
  handleAddRemark: (opinionId: string, remarkData: any) => void;
  activeOpinion: Opinion | null;
}

export function KanbanBoardDnd({
  columns,
  filteredOpinions,
  handleDragStart,
  handleDragEnd,
  handleAddOpinion,
  handleEditOpinion,
  handleDeleteOpinion,
  handleAddRemark,
  activeOpinion
}: KanbanBoardDndProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-grid grid gap-4 overflow-x-auto pb-4">
        {columns.map((columnStatus) => (
          <KanbanColumn
            key={columnStatus}
            status={columnStatus}
            items={filteredOpinions.filter((opinion) => opinion.status === columnStatus)}
            onAdd={handleAddOpinion}
            onEdit={handleEditOpinion}
            onDelete={handleDeleteOpinion}
            onAddRemark={handleAddRemark}
          />
        ))}
      </div>

      <DragOverlay>
        {activeOpinion && (
          <KanbanOpinion
            opinion={activeOpinion}
            onEdit={handleEditOpinion}
            onDelete={handleDeleteOpinion}
            onAddRemark={handleAddRemark}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}