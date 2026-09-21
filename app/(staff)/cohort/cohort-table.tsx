"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { copy } from "@/lib/copy";
import { relativeDays } from "@/lib/dates";
import { StatusPill } from "@/components/ui";
import type { MemberStatusRow } from "@/lib/types";
import { sendReminder } from "@/app/(staff)/actions";

type Filter = "all" | "slowing" | "stalled" | "mine";

const ORDER = { stalled: 0, slowing: 1, active: 2 } as const;

export function CohortTable({
  rows,
  assistants,
  currentUserId,
}: {
  rows: MemberStatusRow[];
  assistants: Record<string, string>;
  currentUserId: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortingState>([{ id: "status", desc: false }]);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const data = useMemo(() => {
    const filtered = rows.filter((r) => {
      if (filter === "slowing") return r.status === "slowing";
      if (filter === "stalled") return r.status === "stalled";
      if (filter === "mine") return r.assistant_id === currentUserId;
      return true;
    });
    // Stale prve.
    return [...filtered].sort((a, b) => ORDER[a.status] - ORDER[b.status]);
  }, [rows, filter, currentUserId]);

  const columns = useMemo<ColumnDef<MemberStatusRow>[]>(
    () => [
      {
        id: "select",
        header: () => null,
        cell: ({ row }) => (
          <input
            type="checkbox"
            aria-label={row.original.full_name}
            checked={Boolean(selected[row.original.member_id])}
            onChange={(e) =>
              setSelected((s) => ({ ...s, [row.original.member_id]: e.target.checked }))
            }
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "full_name",
        header: copy.cohort.colName,
        cell: ({ row }) => (
          <Link
            href={`/cohort/${row.original.member_id}`}
            className="transition-colors hover:text-accent-text"
          >
            {row.original.full_name}
          </Link>
        ),
      },
      {
        accessorKey: "current_module",
        header: copy.cohort.colModule,
        cell: ({ row }) => row.original.current_module ?? "—",
      },
      {
        accessorKey: "lessons_done_pct",
        header: copy.cohort.colLessons,
        cell: ({ row }) => `${row.original.lessons_done_pct}%`,
      },
      {
        accessorKey: "days_since_activity",
        header: copy.cohort.colDays,
        cell: ({ row }) => relativeDays(row.original.days_since_activity),
      },
      {
        accessorKey: "overdue_assignments",
        header: copy.cohort.colOverdue,
        cell: ({ row }) =>
          row.original.overdue_assignments ? (
            <span style={{ color: "var(--danger)" }}>{row.original.overdue_assignments}</span>
          ) : (
            "—"
          ),
      },
      {
        accessorKey: "status",
        header: copy.cohort.colStatus,
        cell: ({ row }) => <StatusPill status={row.original.status} />,
        sortingFn: (a, b) => ORDER[a.original.status] - ORDER[b.original.status],
      },
      {
        accessorKey: "assistant_id",
        header: copy.cohort.colAssistant,
        cell: ({ row }) =>
          row.original.assistant_id
            ? (assistants[row.original.assistant_id] ?? copy.cohort.noAssistant)
            : copy.cohort.noAssistant,
      },
    ],
    [assistants, selected],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedIds = Object.entries(selected)
    .filter(([, v]) => v)
    .map(([k]) => k);
  const stalledIds = rows.filter((r) => r.status === "stalled").map((r) => r.member_id);
  const targets = selectedIds.length ? selectedIds : stalledIds;

  function remind() {
    setMessage(null);
    startTransition(async () => {
      const result = await sendReminder(targets);
      setMessage(result.message ?? result.error ?? null);
      setSelected({});
    });
  }

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: copy.cohort.filterAll },
    { key: "slowing", label: copy.cohort.filterSlowing },
    { key: "stalled", label: copy.cohort.filterStalled },
    { key: "mine", label: copy.cohort.filterMine },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`rounded border px-3 py-1.5 text-small transition-colors ${
                filter === f.key ? "border-accent-text text-accent-text" : "border-line text-muted hover:text-text"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {selectedIds.length ? (
            <span className="text-small text-muted">{copy.cohort.selected(selectedIds.length)}</span>
          ) : null}
          <button type="button" className="btn-secondary" onClick={remind} disabled={pending || !targets.length}>
            {selectedIds.length ? copy.cohort.remind : copy.cohort.remindAllStalled}
          </button>
        </div>
      </div>

      <p role="status" aria-live="polite" className="mb-4 text-small text-accent-text">
        {message}
      </p>

      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[720px] border-collapse text-small">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-line bg-tint/50">
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-3 py-3 text-left font-medium text-muted first:pl-5">
                    {h.isPlaceholder ? null : h.column.getCanSort() ? (
                      <button
                        type="button"
                        className="transition-colors hover:text-text"
                        onClick={h.column.getToggleSortingHandler()}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {{ asc: " ↑", desc: " ↓" }[h.column.getIsSorted() as string] ?? ""}
                      </button>
                    ) : (
                      flexRender(h.column.columnDef.header, h.getContext())
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0 transition-colors hover:bg-tint/40">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-3.5 align-middle tabular-nums first:pl-5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 ? <p className="mt-5 text-small text-muted">{copy.cohort.empty}</p> : null}
    </div>
  );
}
