import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StarRating } from "@/components/ui/star-rating";
import { Search } from "lucide-react";
import { StoreWithRating } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function UserStores() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: stores = [], isLoading } = useQuery<StoreWithRating[]>({
    queryKey: ["/api/stores"],
  });

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ratingMutation = useMutation({
    mutationFn: async ({ storeId, rating }: { storeId: number; rating: number }) => {
      const res = await apiRequest("POST", "/api/ratings", { storeId, rating });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
      toast({
        title: "Rating submitted",
        description: "Your rating has been submitted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit rating",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRatingChange = (storeId: number, rating: number) => {
    ratingMutation.mutate({ storeId, rating });
  };

  return (
    <MainLayout>
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">🌟 Explore & Rate Stores</h2>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search stores by name or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-2 text-sm rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Store Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStores.map((store) => (
            <Card key={store.id} className="rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200">
              <CardContent className="p-5">
                <h3 className="text-xl font-semibold text-gray-800">{store.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{store.address}</p>

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-600">
                    ⭐ {store.averageRating.toFixed(1)}
                  </span>
                  <StarRating
                    value={Math.round(store.averageRating)}
                    readOnly
                    size="sm"
                  />
                  <span className="text-sm text-gray-500">({store.totalRatings} ratings)</span>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-1">Your rating:</p>
                  <StarRating
                    value={store.userRating || 0}
                    onChange={(rating) => handleRatingChange(store.id, rating)}
                    size="lg"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredStores.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 text-sm">No stores found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
