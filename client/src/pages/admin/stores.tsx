import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SortableTable } from "@/components/tables/sortable-table";
import { StarRating } from "@/components/ui/star-rating";
import { AddStoreDialog } from "@/components/dialogs/add-store-dialog";
import { AddUserDialog } from "@/components/dialogs/add-user-dialog";
import { Plus, Search, Eye, Pencil, UserPlus, Loader2 } from "lucide-react";
import { StoreWithRating, UserRole } from "@shared/schema";

export default function AdminStores() {
  const [searchQuery, setSearchQuery] = useState("");
  const [addStoreDialogOpen, setAddStoreDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  
  const { data: stores = [], isLoading, error } = useQuery<StoreWithRating[]>({
    queryKey: ["/api/admin/stores"],
  });

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof StoreWithRating,
      isSortable: true,
    },
    {
      header: "Email",
      accessorKey: "email" as keyof StoreWithRating,
      isSortable: true,
    },
    {
      header: "Address",
      accessorKey: "address" as keyof StoreWithRating,
      cell: (store: StoreWithRating) => (
        <div className="max-w-xs truncate">{store.address}</div>
      ),
      isSortable: true,
    },
    {
      header: "Rating",
      accessorKey: "averageRating" as keyof StoreWithRating,
      cell: (store: StoreWithRating) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900 mr-2">
            {store.averageRating.toFixed(1)}
          </div>
          <StarRating
            value={Math.round(store.averageRating)}
            readOnly
            size="sm"
          />
          <span className="ml-2 text-xs text-gray-500">
            ({store.totalRatings})
          </span>
        </div>
      ),
      isSortable: true,
    },
    {
      header: "Action",
      accessorKey: "id" as keyof StoreWithRating,
      cell: (store: StoreWithRating) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="text-primary hover:text-primary-700">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-3xl font-bold text-gray-900">📦 Store Management</h2>
          <div className="flex gap-3">
            <Button
              onClick={() => setAddUserDialogOpen(true)}
              variant="outline"
              className="flex items-center"
            >
              <UserPlus className="mr-2 h-4 w-4" /> Add Store Owner
            </Button>
            <Button 
              onClick={() => setAddStoreDialogOpen(true)}
              className="flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Store
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="rounded-xl bg-white shadow-sm p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search stores by name, email or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl bg-white shadow-md p-4">
          {isLoading ? (
            <div className="flex justify-center py-10 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading stores...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 font-medium py-6">
              ❌ Failed to load store data. Please refresh.
            </div>
          ) : (
            <SortableTable
              data={filteredStores}
              columns={columns}
              onRowClick={(store) => console.log("Clicked store:", store)}
          
            />
          )}
        </div>
      </div>

      {/* Dialogs */}
      <AddStoreDialog 
        open={addStoreDialogOpen} 
        onOpenChange={setAddStoreDialogOpen} 
      />
      <AddUserDialog 
        open={addUserDialogOpen} 
        onOpenChange={setAddUserDialogOpen}
        defaultRole={UserRole.OWNER}
      />
    </MainLayout>
  );
}
