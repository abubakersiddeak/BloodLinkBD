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
import { IconDotsVertical, IconSearch, IconX } from "@tabler/icons-react";

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
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
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
          <Button variant="ghost" className="h-8 w-8 p-0">
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* Status Actions */}
          {row.original.status === "active" ? (
            <DropdownMenuItem className="text-destructive">
              Block User
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className="text-green-600">
              Unblock User
            </DropdownMenuItem>
          )}

          {/* Role Actions */}
          {row.original.role === "donor" && (
            <DropdownMenuItem>Make Volunteer</DropdownMenuItem>
          )}
          {(row.original.role === "donor" ||
            row.original.role === "volunteer") && (
            <DropdownMenuItem>Make Admin</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function DataTable({ data: initialData }) {
  const [data, setData] = React.useState(initialData);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Status filter options
  const statusOptions = ["all", "active", "blocked"];

  // Search fields
  const searchFields = [
    { value: "all", label: "All Fields" },
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "bloodGroup", label: "Blood Group" },
  ];

  const [searchField, setSearchField] = React.useState("all");

  // Debounced search value
  const [searchValue, setSearchValue] = React.useState("");
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setGlobalFilter(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Filter by status
  const handleStatusFilter = (status) => {
    if (status === "all") {
      setColumnFilters([]);
    } else {
      setColumnFilters([{ id: "status", value: status }]);
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      if (searchField === "all") {
        // Search in all searchable fields
        return ["name", "email", "bloodGroup"].some((field) => {
          const value = row.getValue(field)?.toLowerCase() || "";
          return value.includes(searchValue);
        });
      } else {
        // Search in selected field
        const value = row.getValue(searchField)?.toLowerCase() || "";
        return value.includes(searchValue);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Select
            value={columnFilters[0]?.value || "all"}
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Section */}
        <div className="flex flex-1 items-center gap-2 md:max-w-md">
          <Select value={searchField} onValueChange={setSearchField}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Search in..." />
            </SelectTrigger>
            <SelectContent>
              {searchFields.map((field) => (
                <SelectItem key={field.value} value={field.value}>
                  {field.label}
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
              className="pr-8"
            />
            {searchValue && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setSearchValue("")}
              >
                <IconX className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} user(s) total
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>←
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>→
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
