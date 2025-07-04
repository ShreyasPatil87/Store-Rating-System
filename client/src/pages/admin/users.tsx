import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortableTable } from "@/components/tables/sortable-table";
import { StarRating } from "@/components/ui/star-rating";
import { AddUserDialog } from "@/components/dialogs/add-user-dialog";
import { Plus, Search, Eye, Pencil } from "lucide-react";
import { UserWithStore, UserRole } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery<UserWithStore[]>({
    queryKey: ["/api/admin/users"],
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof UserWithStore,
      isSortable: true,
    },
    {
      header: "Email",
      accessorKey: "email" as keyof UserWithStore,
      isSortable: true,
    },
    {
      header: "Address",
      accessorKey: "address" as keyof UserWithStore,
      cell: (user: UserWithStore) => (
        <div className="max-w-xs truncate text-sm text-gray-700 dark:text-gray-300">{user.address}</div>
      ),
      isSortable: true,
    },
    {
      header: "Role",
      accessorKey: "role" as keyof UserWithStore,
      cell: (user: UserWithStore) => {
        let badgeVariant: "default" | "outline" | "secondary" | "destructive";
        let label: string;

        switch (user.role) {
          case UserRole.ADMIN:
            badgeVariant = "destructive";
            label = "Admin";
            break;
          case UserRole.OWNER:
            badgeVariant = "secondary";
            label = "Store Owner";
            break;
          default:
            badgeVariant = "outline";
            label = "User";
        }

        return <Badge variant={badgeVariant}>{label}</Badge>;
      },
      isSortable: true,
    },
    {
      header: "Store Rating",
      accessorKey: "storeRating" as keyof UserWithStore,
      cell: (user: UserWithStore) => {
        if (user.role !== UserRole.OWNER || !user.storeRating) {
          return <span className="text-gray-400">N/A</span>;
        }

        return (
          <div className="flex items-center">
            <div className="text-sm font-medium text-gray-900 dark:text-white mr-2">
              {user.storeRating.toFixed(1)}
            </div>
            <StarRating value={Math.round(user.storeRating)} readOnly size="sm" />
          </div>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "id" as keyof UserWithStore,
      cell: (user: UserWithStore) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-yellow-600 hover:text-yellow-800">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="py-8 px-6 sm:px-10 lg:px-12 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Users Management</h2>
          <Button
            onClick={() => setAddUserDialogOpen(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>

        {/* Search/Filter */}
        <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search users by name, email or address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-lg shadow-sm"
              />
            </div>
          </div>
          <div className="sm:w-64">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                <SelectItem value={UserRole.USER}>Normal User</SelectItem>
                <SelectItem value={UserRole.OWNER}>Store Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <SortableTable
            data={filteredUsers}
            columns={columns}
            onRowClick={(user) => console.log("Clicked user:", user)}
          />
        </div>
      </div>

      {/* Dialogs */}
      <AddUserDialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen} />
    </MainLayout>
  );
}