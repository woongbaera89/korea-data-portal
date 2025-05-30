import { Suspense } from "react";
import IngredientSearch from "@/components/IngredientSearch";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-center">원료성분 정보 검색</h1>
        <Suspense>
          <IngredientSearch />
        </Suspense>
      </div>
    </main>
  );
}
