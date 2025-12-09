"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  IconDotsVertical,
  IconX,
  IconEye,
  IconTrash,
  IconUserPlus,
  IconShieldCheck,
  IconBan,
  IconCircleCheck,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { userApi } from "@/lib/userApi";
import Image from "next/image";

export function AllUserTable({ initialData = [] }) {
  const router = useRouter();
  const [data, setData] = React.useState(initialData);
  const [loading, setLoading] = React.useState(false);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [alertDialog, setAlertDialog] = React.useState({
    open: false,
    title: "",
    description: "",
    action: null,
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

  // Fetch users from API
  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      };

      if (searchValue) {
        params.search = searchValue;
        params.searchField = searchField;
      }

      const statusFilter = columnFilters.find((f) => f.id === "status");
      if (statusFilter && statusFilter.value !== "all") {
        params.status = statusFilter.value;
      }

      const roleFilter = columnFilters.find((f) => f.id === "role");
      if (roleFilter && roleFilter.value !== "all") {
        params.role = roleFilter.value;
      }

      const response = await userApi.getAllUsers(params);

      if (response.success) {
        setData(response.data || []);
      } else {
        setData(response.data || response || []);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [pagination, searchValue, searchField, columnFilters]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue, searchField]);

  React.useEffect(() => {
    fetchUsers();
  }, [columnFilters, pagination.pageIndex, pagination.pageSize]);

  // Handle user actions
  const handleBlockUser = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    setAlertDialog({
      open: true,
      title: `${newStatus === "blocked" ? "Block" : "Unblock"} User`,
      description: `Are you sure you want to ${
        newStatus === "blocked" ? "block" : "unblock"
      } this user? ${
        newStatus === "blocked"
          ? "They will not be able to access their account."
          : "They will regain access to their account."
      }`,
      action: async () => {
        try {
          const response = await userApi.updateUserStatus(userId, newStatus);

          if (response.success) {
            toast.success(
              response.message ||
                `User ${
                  newStatus === "blocked" ? "blocked" : "unblocked"
                } successfully`
            );
            fetchUsers();
          } else {
            toast.error(response.message || "Failed to update user status");
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to update user status"
          );
          console.error(error);
        }
        setAlertDialog({ ...alertDialog, open: false });
      },
    });
  };

  const handleRoleChange = async (userId, newRole, currentRole) => {
    const roleNames = {
      donor: "Donor",
      volunteer: "Volunteer",
      admin: "Admin",
    };

    setAlertDialog({
      open: true,
      title: `Change Role to ${roleNames[newRole]}`,
      description: `Are you sure you want to change this user's role from ${roleNames[currentRole]} to ${roleNames[newRole]}? This will update their permissions immediately.`,
      action: async () => {
        try {
          const response = await userApi.updateUserRole(userId, newRole);

          if (response.success) {
            toast.success(
              response.message || `User role updated to ${roleNames[newRole]}`
            );
            fetchUsers();
          } else {
            toast.error(response.message || "Failed to update user role");
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to update user role"
          );
          console.error(error);
        }
        setAlertDialog({ ...alertDialog, open: false });
      },
    });
  };

  const handleDeleteUser = async (userId, userName) => {
    setAlertDialog({
      open: true,
      title: "Delete User",
      description: `Are you sure you want to delete ${userName}? This action cannot be undone and all user data will be permanently removed.`,
      action: async () => {
        try {
          const response = await userApi.deleteUser(userId);

          if (response.success) {
            toast.success(response.message || "User deleted successfully");
            fetchUsers();
          } else {
            toast.error(response.message || "Failed to delete user");
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to delete user");
          console.error(error);
        }
        setAlertDialog({ ...alertDialog, open: false });
      },
    });
  };

  const handleViewUser = (userId) => {
    router.push(`/dashboard/users/${userId}`);
  };

  // Define columns
  const columns = [
    {
      accessorKey: "avatar",
      header: "",
      cell: ({ row }) => (
        <Image
          height={50}
          width={50}
          src={row.original.avatar || "/default-avatar.png"}
          alt={row.original.name}
          className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100"
          onError={(e) => {
            e.target.src = "/default-avatar.png";
          }}
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.original.email}</div>
      ),
    },
    {
      accessorKey: "bloodGroup",
      header: "Blood Group",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="font-semibold text-red-600 border-red-300"
        >
          {row.original.bloodGroup}
        </Badge>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.original.location?.upazila}, {row.original.location?.district}
        </span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.original.phone || "N/A"}
        </span>
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
          variant={row.original.status === "active" ? "default" : "destructive"}
          className={`capitalize ${
            row.original.status === "active"
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : ""
          }`}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const userId = row.original._id;
        const userStatus = row.original.status;
        const userRole = row.original.role;
        const userName = row.original.name;

        return (
          <div className="flex items-center gap-2">
            {/* 3-Dot Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 cursor-pointer hover:bg-gray-100"
                >
                  <IconDotsVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs text-gray-500">
                  Actions
                </DropdownMenuLabel>

                {/* View Details */}
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleViewUser(userId)}
                >
                  <IconEye className="h-4 w-4 mr-2 text-blue-600" />
                  <span>View Details</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Status Management */}
                <DropdownMenuLabel className="text-xs text-gray-500">
                  Status Management
                </DropdownMenuLabel>

                {userStatus === "active" ? (
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                    onClick={() => handleBlockUser(userId, userStatus)}
                  >
                    <IconBan className="h-4 w-4 mr-2" />
                    <span>Block User</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="cursor-pointer text-green-600 focus:text-green-700 focus:bg-green-50"
                    onClick={() => handleBlockUser(userId, userStatus)}
                  >
                    <IconCircleCheck className="h-4 w-4 mr-2" />
                    <span>Unblock User</span>
                  </DropdownMenuItem>
                )}

                {/* Role Management */}
                {userRole !== "admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      Role Management
                    </DropdownMenuLabel>

                    {userRole === "user" && (
                      <div>
                        <DropdownMenuItem
                          className="cursor-pointer text-gray-600 focus:text-gray-700 focus:bg-gray-50"
                          onClick={() =>
                            handleRoleChange(userId, "admin", userRole)
                          }
                        >
                          <IconUserPlus className="h-4 w-4 mr-2" />
                          <span>Make as admin</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-gray-600 focus:text-gray-700 focus:bg-gray-50"
                          onClick={() =>
                            handleRoleChange(userId, "volunteer", userRole)
                          }
                        >
                          <IconUserPlus className="h-4 w-4 mr-2" />
                          <span>Make as Volunteer</span>
                        </DropdownMenuItem>
                      </div>
                    )}
                    {userRole === "volunteer" && (
                      <div>
                        <DropdownMenuItem
                          className="cursor-pointer text-gray-600 focus:text-gray-700 focus:bg-gray-50"
                          onClick={() =>
                            handleRoleChange(userId, "admin", userRole)
                          }
                        >
                          <IconUserPlus className="h-4 w-4 mr-2" />
                          <span>Make as admin</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-gray-600 focus:text-gray-700 focus:bg-gray-50"
                          onClick={() =>
                            handleRoleChange(userId, "user", userRole)
                          }
                        >
                          <IconUserPlus className="h-4 w-4 mr-2" />
                          <span>Demote to donor</span>
                        </DropdownMenuItem>
                      </div>
                    )}
                  </>
                )}

                {/* Delete User */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                  onClick={() => handleDeleteUser(userId, userName)}
                >
                  <IconTrash className="h-4 w-4 mr-2" />
                  <span>Delete User</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

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
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: false,
  });

  return (
    <>
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
              <p className="text-xs text-gray-500 mb-1.5 px-1">
                Filter by role
              </p>
              <Select
                value={
                  columnFilters.find((f) => f.id === "role")?.value || "all"
                }
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
        <div className="rounded-lg border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                      <TableHead
                        key={h.id}
                        className="whitespace-nowrap font-semibold text-gray-700"
                      >
                        {h.isPlaceholder
                          ? null
                          : flexRender(
                              h.column.columnDef.header,
                              h.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-2"></div>
                        <p className="text-gray-500">Loading users...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleViewUser(row.original._id)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="whitespace-nowrap"
                          onClick={(e) => {
                            if (cell.column.id === "actions") {
                              e.stopPropagation();
                            }
                          }}
                        >
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
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">
                          Try adjusting your filters or search
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 order-2 sm:order-1">
            Showing {table.getRowModel().rows.length} of {data.length} user(s)
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 order-1 sm:order-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium whitespace-nowrap text-gray-700">
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

            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-700">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount() || 1}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 cursor-pointer hover:bg-accent"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  ←
                </Button>
                <Button
                  variant="outline"
                  size="sm"
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

      {/* Alert Dialog */}
      <AlertDialog
        open={alertDialog.open}
        onOpenChange={(open) => setAlertDialog({ ...alertDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={alertDialog.action}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
