'use client';

import { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id?: string }>({ columns, data, emptyTitle = 'No records found', emptyDescription, onRowClick }: DataTableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
        <p className="font-medium text-foreground">{emptyTitle}</p>
        {emptyDescription && <p className="mt-1 max-w-sm mx-auto text-sm text-muted-foreground">{emptyDescription}</p>}
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/50">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={`px-4 py-3 text-left font-semibold text-foreground ${c.className || ''}`}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, i) => (
              <tr
                key={row.id ?? i}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-secondary/50' : ''}`}
              >
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 text-foreground ${c.className || ''}`}>
                    {c.render ? c.render(row) : (row as Record<string, unknown>)[c.key] as ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
