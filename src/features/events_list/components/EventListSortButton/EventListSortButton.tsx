import { Button } from '@konturio/ui-kit';
import { useState, useCallback } from 'react';

interface EventListSortButtonProps {
  onSort: (order: 'asc' | 'desc') => void;
  onFocus?: () => void;
}

export function EventListSortButton({ onSort, onFocus }: EventListSortButtonProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = useCallback(() => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    onSort(newOrder);
  }, [sortOrder, onSort]);

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button onClick={handleSort} size="small" variant="invert-outline">
        {sortOrder === 'desc' ? 'Sort ↓' : 'Sort ↑'}
      </Button>
      {onFocus && (
        <Button
          onClick={onFocus}
          size="small"
          variant="invert-outline"
          title="Scroll to selected event"
        >
          ◉
        </Button>
      )}
    </div>
  );
}
