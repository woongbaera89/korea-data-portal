"use client";

import IngredientSearch from "@/components/IngredientSearch";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          원료성분 정보 검색
        </h1>
        <IngredientSearch />
      </div>
    </main>
  );
}
