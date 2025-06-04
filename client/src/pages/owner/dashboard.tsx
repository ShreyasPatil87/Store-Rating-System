import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SortableTable } from "@/components/tables/sortable-table";
import { StarRating } from "@/components/ui/star-rating";
import { StoreWithRating, RatingWithUser } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function OwnerDashboard() {
  const { data: store, isLoading: storeLoading } = useQuery<StoreWithRating>({
    queryKey: ["/api/owner/store"],
  });
  
  const { data: ratings = [], isLoading: ratingsLoading } = useQuery<RatingWithUser[]>({
    queryKey: ["/api/owner/ratings"],
  });

  const columns = [
    {
      header: "Customer",
      accessorKey: "userName" as keyof RatingWithUser,
      cell: (rating: RatingWithUser) => (
        <div>
          <div className="font-semibold text-indigo-700">{rating.userName}</div>
          <div className="text-xs text-gray-400">{rating.userEmail}</div>
        </div>
      ),
      isSortable: true,
    },
    {
      header: "Rating",
      accessorKey: "rating" as keyof RatingWithUser,
      cell: (rating: RatingWithUser) => (
        <div className="flex items-center space-x-2">
          <div className="text-sm font-semibold text-gray-900">
            {rating.rating.toFixed(1)}
          </div>
          <StarRating
            value={rating.rating}
            readOnly
            size="sm"
          />
        </div>
      ),
      isSortable: true,
    },
    {
      header: "Date",
      accessorKey: "createdAt" as keyof RatingWithUser,
      cell: (rating: RatingWithUser) => (
        <div className="text-xs text-gray-400 italic">
          {formatDistanceToNow(new Date(rating.createdAt), { addSuffix: true })}
        </div>
      ),
      isSortable: true,
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-white py-8 px-6 sm:px-12 lg:px-24">
        <h2 className="text-3xl font-extrabold text-indigo-900 mb-6 tracking-wide drop-shadow-sm">
          Store Dashboard
        </h2>
        
        <Card className="shadow-lg rounded-xl border border-indigo-200 overflow-hidden">
          <CardHeader className="bg-indigo-100 border-b border-indigo-300">
            <h3 className="text-xl font-semibold text-indigo-900 tracking-wide">
              Store Information
            </h3>
          </CardHeader>
          <CardContent className="bg-white px-8 py-6">
            {store ? (
              <dl className="divide-y divide-indigo-100">
                <div className="py-4 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-semibold text-indigo-700">Store Name</dt>
                  <dd className="col-span-2 text-lg font-medium text-indigo-900">{store.name}</dd>
                </div>
                <div className="py-4 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-semibold text-indigo-700">Email Address</dt>
                  <dd className="col-span-2 text-base text-indigo-800">{store.email}</dd>
                </div>
                <div className="py-4 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-semibold text-indigo-700">Address</dt>
                  <dd className="col-span-2 text-base text-indigo-800">{store.address}</dd>
                </div>
                <div className="py-4 grid grid-cols-3 gap-4 items-center">
                  <dt className="text-sm font-semibold text-indigo-700">Average Rating</dt>
                  <dd className="col-span-2 flex items-center space-x-4">
                    <div className="text-4xl font-extrabold text-indigo-900">
                      {store.averageRating.toFixed(1)}
                    </div>
                    <StarRating
                      value={Math.round(store.averageRating)}
                      readOnly
                      size="lg"
                    />
                    <span className="text-sm text-indigo-600 font-medium">
                      ({store.totalRatings} ratings)
                    </span>
                  </dd>
                </div>
              </dl>
            ) : (
              <div className="text-center text-indigo-500 font-medium py-8">
                Loading store information...
              </div>
            )}
          </CardContent>
        </Card>

        <section className="mt-12">
          <h3 className="text-2xl font-semibold text-indigo-900 mb-4 tracking-wide">
            Customer Ratings
          </h3>

          {ratingsLoading ? (
            <p className="text-indigo-500 font-medium">Loading ratings...</p>
          ) : (
            <div className="rounded-lg shadow-md border border-indigo-200 overflow-hidden">
              <SortableTable
                data={ratings}
                columns={columns}
               
              />
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
