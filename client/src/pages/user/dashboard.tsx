import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreWithRating } from "@shared/schema";
import { SortableTable } from "@/components/tables/sortable-table";
import { StarRating } from "@/components/ui/star-rating";
import { Store, Star, Building } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function UserDashboard() {
  const { data: stores = [], isLoading } = useQuery<StoreWithRating[]>({
    queryKey: ["/api/user/stores"],
  });

  const topRatedStores = [...stores]
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 5);

  const columns = [
    {
      header: "Store Name",
      accessorKey: "name" as keyof StoreWithRating,
      isSortable: true,
      cell: (store: StoreWithRating) => (
        <div className="font-medium text-gray-900">{store.name}</div>
      ),
    },
    {
      header: "Address",
      accessorKey: "address" as keyof StoreWithRating,
      cell: (store: StoreWithRating) => (
        <div className="max-w-xs truncate text-gray-600">{store.address}</div>
      ),
    },
    {
      header: "Rating",
      accessorKey: "averageRating" as keyof StoreWithRating,
      isSortable: true,
      cell: (store: StoreWithRating) => (
        <div className="flex items-center">
          <div className="font-semibold text-indigo-600 mr-2">
            {store.averageRating ? store.averageRating.toFixed(1) : "N/A"}
          </div>
          {store.averageRating && (
            <StarRating value={Math.round(store.averageRating)} readOnly size="sm" />
          )}
        </div>
      ),
    },
    {
      header: "Your Rating",
      accessorKey: "userRating" as keyof StoreWithRating,
      isSortable: true,
      cell: (store: StoreWithRating) => (
        <div className="flex items-center">
          {store.userRating ? (
            <>
              <div className="font-semibold text-green-600 mr-2">
                {store.userRating.toFixed(1)}
              </div>
              <StarRating value={Math.round(store.userRating)} readOnly size="sm" />
            </>
          ) : (
            <span className="text-gray-400 italic">Not rated</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="py-10 px-4 sm:px-6 lg:px-10 bg-gradient-to-br from-gray-50 to-white min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">📊 Your Dashboard</h1>
          <p className="mt-2 text-gray-500">Explore top rated stores and manage your ratings easily.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-md hover:shadow-lg transition rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <Store className="text-indigo-500 w-5 h-5" />
                Total Stores
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">Available stores to rate</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-indigo-600">{stores.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <Star className="text-yellow-500 w-5 h-5" />
                Your Ratings
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">Stores you've rated</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-yellow-500">
                {stores.filter(store => store.userRating).length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <Building className="text-red-500 w-5 h-5" />
                Unrated Stores
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">Stores waiting for your rating</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-red-500">
                {stores.filter(store => !store.userRating).length}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🌟 Top Rated Stores</h2>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <SortableTable data={topRatedStores} columns={columns} />
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/user/stores">
            <Button className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 transition rounded-lg shadow">
              View All Stores
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
