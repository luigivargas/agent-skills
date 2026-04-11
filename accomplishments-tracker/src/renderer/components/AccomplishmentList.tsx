import React from 'react';
import { Accomplishment } from '../../shared/types';
import AccomplishmentCard from './AccomplishmentCard';

interface AccomplishmentListProps {
  accomplishments: Accomplishment[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function AccomplishmentList({ accomplishments, onEdit, onDelete }: AccomplishmentListProps) {
  if (accomplishments.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
        <p className="text-lg text-gray-500 dark:text-gray-400">No accomplishments yet</p>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          Add your first accomplishment using the form above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {accomplishments.map((accomplishment) => (
        <AccomplishmentCard
          key={accomplishment.id}
          accomplishment={accomplishment}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default AccomplishmentList;
