"use client";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IconDotsVertical, IconX } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

// Define columns
const columns = [
  {
    accessorKey: "avatar",
    header: "",
    cell: ({ row }) => (
      <img
        src={row.original.avatar}
        alt={row.original.name}
        className="h-10 w-10 rounded-full"
      />
    ),
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "bloodGroup",
    header: "Blood Group",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-semibold">
        {row.original.bloodGroup}
      </Badge>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "success" : "destructive"}
        className="capitalize"
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {row.original.status === "active" ? (
            <DropdownMenuItem className="text-destructive cursor-pointer">
              Block User
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className="text-green-600 cursor-pointer">
              Unblock User
            </DropdownMenuItem>
          )}
          {row.original.role === "donor" && (
            <DropdownMenuItem className="cursor-pointer">
              Make Volunteer
            </DropdownMenuItem>
          )}
          {(row.original.role === "donor" ||
            row.original.role === "volunteer") && (
            <DropdownMenuItem className="cursor-pointer">
              Make Admin
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function AllUserTable({ data: initialData }) {
  const [data] = React.useState(initialData);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const statusOptions = ["all", "active", "blocked"];
  const roleOptions = ["all", "donor", "volunteer", "admin"];
  const searchFields = [
    { value: "all", label: "All Fields" },
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "bloodGroup", label: "Blood Group" },
  ];

  const [searchField, setSearchField] = React.useState("all");
  const [searchValue, setSearchValue] = React.useState("");

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => setGlobalFilter(searchValue), 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Handlers
  const handleStatusFilter = (status) => {
    setColumnFilters((prev) => {
      const others = prev.filter((f) => f.id !== "status");
      return status === "all"
        ? others
        : [...others, { id: "status", value: status }];
    });
  };

  const handleRoleFilter = (role) => {
    setColumnFilters((prev) => {
      const others = prev.filter((f) => f.id !== "role");
      return role === "all" ? others : [...others, { id: "role", value: role }];
    });
  };

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: (row, _, filterValue) => {
      const searchVal = filterValue.toLowerCase();
      if (searchField === "all") {
        return ["name", "email", "bloodGroup"].some((field) =>
          (row.getValue(field)?.toLowerCase() || "").includes(searchVal)
        );
      } else {
        return (row.getValue(searchField)?.toLowerCase() || "").includes(
          searchVal
        );
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
      {/* Filters + Search */}
      <div className="flex flex-col space-y-4 md:space-y-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div className="w-full">
            <p className="text-xs text-gray-500 mb-1.5 px-1">
              Filter by status
            </p>
            <Select
              value={
                columnFilters.find((f) => f.id === "status")?.value || "all"
              }
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-full cursor-pointer hover:bg-accent">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    className="capitalize cursor-pointer hover:bg-accent"
                  >
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Role Filter */}
          <div className="w-full">
            <p className="text-xs text-gray-500 mb-1.5 px-1">Filter by role</p>
            <Select
              value={columnFilters.find((f) => f.id === "role")?.value || "all"}
              onValueChange={handleRoleFilter}
            >
              <SelectTrigger className="w-full cursor-pointer hover:bg-accent">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((r) => (
                  <SelectItem
                    key={r}
                    value={r}
                    className="capitalize cursor-pointer hover:bg-accent"
                  >
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Section */}
          <div className="w-full sm:col-span-2">
            <p className="text-xs text-gray-500 mb-1.5 px-1">Search</p>
            <div className="flex gap-2">
              <Select value={searchField} onValueChange={setSearchField}>
                <SelectTrigger className="w-[130px] cursor-pointer hover:bg-accent">
                  <SelectValue placeholder="Search in..." />
                </SelectTrigger>
                <SelectContent>
                  {searchFields.map((f) => (
                    <SelectItem
                      key={f.value}
                      value={f.value}
                      className="cursor-pointer hover:bg-accent"
                    >
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Input
                  placeholder={`Search ${
                    searchField === "all"
                      ? "all fields"
                      : searchFields
                          .find((f) => f.value === searchField)
                          ?.label.toLowerCase()
                  }...`}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pr-8 cursor-text"
                />
                {searchValue && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent cursor-pointer"
                    onClick={() => setSearchValue("")}
                  >
                    <IconX className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    className="whitespace-nowrap cursor-pointer hover:bg-accent/50"
                  >
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-accent/50 cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          {table.getFilteredRowModel().rows.length} user(s) total
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 order-1 sm:order-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium whitespace-nowrap">
              Rows per page
            </p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(v) => table.setPageSize(Number(v))}
            >
              <SelectTrigger className="h-8 w-[70px] cursor-pointer hover:bg-accent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((n) => (
                  <SelectItem
                    key={n}
                    value={`${n}`}
                    className="cursor-pointer hover:bg-accent"
                  >
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0 cursor-pointer hover:bg-accent"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                ←
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0 cursor-pointer hover:bg-accent"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
