'use client';

import React from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Opinion, Status, WorkflowStatus } from '../types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanOpinion } from './KanbanOpinion';

interface KanbanBoardDndProps {
  workflowStatuses: WorkflowStatus[];
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
  workflowStatuses,
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

    // Sort workflow statuses to put 'unassigned' first
	const sortedStatuses = [...workflowStatuses].sort((a, b) => {
		if (a.name === 'unassigned') return -1;
		if (b.name === 'unassigned') return 1;
		return 0;
	  });
	

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-grid grid gap-4 overflow-x-auto pb-4">
	  {sortedStatuses.map((status) => (
          <KanbanColumn
            key={status.name}
            status={status.name}
            statusDescription={status.description}
            items={filteredOpinions.filter((opinion) => opinion.status === status.name)}
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