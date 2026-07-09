import * as React from "react";

interface DataTableProps {
  headers: string[];
  children: React.ReactNode;
}

export function DataTable({ headers, children }: DataTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="border-b border-border bg-[var(--surface-alt)] text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-6 py-4 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-foreground">
          {children}
        </tbody>
      </table>
    </div>
  );
}
