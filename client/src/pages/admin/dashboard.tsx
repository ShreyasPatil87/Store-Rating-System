import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddStoreDialog } from "@/components/dialogs/add-store-dialog";
import { AddUserDialog } from "@/components/dialogs/add-user-dialog";
import { Loader2, Users, Store, Star, Plus } from "lucide-react";
import { useState } from "react";
import { StoreStatistics } from "@shared/schema";

export default function AdminDashboard() {
  const [addStoreDialogOpen, setAddStoreDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);

  const { data: stats, isLoading } = useQuery<StoreStatistics>({
    queryKey: ["/api/admin/statistics"],
  });

  const cardStyle = "bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6";
  const iconContainerStyle = "flex-shrink-0 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-xl p-3";
  const statTextStyle = "text-sm font-medium text-gray-500 truncate";
  const statValueStyle = "text-2xl font-bold text-gray-800";

  return (
    <MainLayout>
      <div className="py-10 px-6 sm:px-8 lg:px-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 Admin Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className={cardStyle}>
            <CardContent className="flex items-center gap-4">
              <div className={iconContainerStyle}>
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className={statTextStyle}>Total Users</div>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600 mt-1" />
                ) : (
                  <div className={statValueStyle}>{stats?.totalUsers || 0}</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={cardStyle}>
            <CardContent className="flex items-center gap-4">
              <div className={iconContainerStyle}>
                <Store className="h-6 w-6" />
              </div>
              <div>
                <div className={statTextStyle}>Total Stores</div>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600 mt-1" />
                ) : (
                  <div className={statValueStyle}>{stats?.totalStores || 0}</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={cardStyle}>
            <CardContent className="flex items-center gap-4">
              <div className={iconContainerStyle}>
                <Star className="h-6 w-6" />
              </div>
              <div>
                <div className={statTextStyle}>Total Ratings</div>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600 mt-1" />
                ) : (
                  <div className={statValueStyle}>{stats?.totalRatings || 0}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">⚡ Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button 
              onClick={() => setAddStoreDialogOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" /> Add New Store
            </Button>
            <Button 
              onClick={() => setAddUserDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" /> Add New User
            </Button>
          </div>
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
      />
    </MainLayout>
  );
}
