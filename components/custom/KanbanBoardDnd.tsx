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

  const statusOrder: Status[] = [
    'unassigned',
	'in_review',
    'assigned_to_department',
    'assigned_to_expert',
    'expert_opinion_submitted',
    'head_review_pending',
    'head_approved',
    'pending_other_department',
    'additional_info_requested',
    'completed',
    'rejected'
  ];

  // Sort workflow statuses based on the defined order
  const sortedStatuses = [...workflowStatuses].sort((a, b) => {
    const indexA = statusOrder.indexOf(a.name);
    const indexB = statusOrder.indexOf(b.name);
    return indexA - indexB;
  });

  console.log('Filtered Opinions:', filteredOpinions); // Add this for debugging
  console.log('Workflow Statuses:', sortedStatuses); // Add this for debugging
	

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-grid grid gap-6 overflow-x-auto pb-4">
	  {sortedStatuses.map((status) => {
          const statusOpinions = filteredOpinions.filter(
            opinion => opinion.current_status.name === status.name
          );

          console.log(`Opinions for ${status.name}:`, statusOpinions);
		  return (
            <KanbanColumn
              key={status.name}
              status={status.name}
              statusDescription={status.description}
              items={statusOpinions}
              onAdd={handleAddOpinion}
              onEdit={handleEditOpinion}
              onDelete={handleDeleteOpinion}
              onAddRemark={handleAddRemark}
            />
          );
        })}
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