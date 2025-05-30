"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchIngredient } from "@/lib/api";
import { IngredientItem } from "@/types/ingredient";

export default function IngredientSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<IngredientItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("p")) || 1
  );
  const [totalCount, setTotalCount] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const itemsPerPage = 100;

  const updateUrl = useCallback(
    (q: string, p: number) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (p > 1) params.set("p", p.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const handleSearch = useCallback(
    async (e: React.FormEvent, page = 1) => {
      e.preventDefault();
      if (!searchTerm.trim()) {
        setError("검색어를 입력해주세요.");
        return;
      }

      setLoading(true);
      setError(null);
      setResults([]);
      setCurrentPage(page);
      setHasSearched(true);
      updateUrl(searchTerm, page);

      try {
        const response = await searchIngredient(searchTerm, page);

        if (response.body.items && Array.isArray(response.body.items)) {
          setResults(response.body.items);
          setTotalCount(response.body.totalCount);
        } else {
          setError("검색 결과를 불러오는데 실패했습니다.");
        }
      } catch (err) {
        console.error("Search error:", err);
        setError(
          err instanceof Error ? err.message : "검색 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, updateUrl]
  );

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > Math.ceil(totalCount / itemsPerPage)) return;

    setLoading(true);
    setError(null);
    updateUrl(searchTerm, page);

    try {
      const response = await searchIngredient(searchTerm, page);

      if (response.body.items && Array.isArray(response.body.items)) {
        setResults(response.body.items);
        setCurrentPage(page);
      } else {
        setError("검색 결과를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("Page change error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "페이지 로딩 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToExcel = () => {
    // 헤더 생성
    const headers = ["한글명", "영문명", "CAS 번호", "원료 설명", "동의어"];

    // 데이터 행 생성
    const rows = results.map((item) => [
      item.INGR_KOR_NAME,
      item.INGR_ENG_NAME,
      item.CAS_NO,
      item.ORIGIN_MAJOR_KOR_NAME,
      item.INGR_SYNONYM || "",
    ]);

    // CSV 형식의 문자열 생성
    const csvContent = [
      headers.join("\t"),
      ...rows.map((row) => row.join("\t")),
    ].join("\n");

    // 클립보드에 복사
    navigator.clipboard
      .writeText(csvContent)
      .then(() => {
        alert("검색 결과가 클립보드에 복사되었습니다. 엑셀에 붙여넣기 하세요.");
      })
      .catch((err) => {
        console.error("클립보드 복사 실패:", err);
        alert("클립보드 복사에 실패했습니다.");
      });
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    setMounted(true);
    // URL에 검색어가 있으면 자동으로 검색 실행
    if (searchParams.get("q")) {
      const page = searchParams.get("p") ? Number(searchParams.get("p")) : 1;
      handleSearch(
        {
          preventDefault: () => {},
        } as FormEvent<HTMLFormElement>,
        page
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="max-w-8xl mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="원료성분명을 입력하세요"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 w-32 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "검색 중..." : "검색"}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleCopyToExcel}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              테이블 복사 (엑셀용)
            </button>
          </div>

          <div>
            <table className="w-full bg-white border rounded-lg table-fixed">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-1 w-1/6 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    한글명
                  </th>
                  <th className="p-1 w-1/6 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    영문명
                  </th>
                  <th className="p-1 w-1/6 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CAS 번호
                  </th>
                  <th className="p-1 w-2/6 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    원료 설명
                  </th>
                  <th className="p-1 w-1/6 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    동의어
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-1 text-sm text-gray-900">
                      {item.INGR_KOR_NAME}
                    </td>
                    <td className="p-1 text-xs text-gray-900">
                      {item.INGR_ENG_NAME}
                    </td>
                    <td className="p-1 text-xs text-gray-900">{item.CAS_NO}</td>
                    <td className="p-1 text-sm text-gray-900">
                      {item.ORIGIN_MAJOR_KOR_NAME}
                    </td>
                    <td className="p-1 text-sm text-gray-900">
                      {item.INGR_SYNONYM || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                이전
              </button>
              <span className="px-4 py-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}

      {!loading && !error && hasSearched && results.length === 0 && (
        <div className="text-center text-gray-500">검색 결과가 없습니다.</div>
      )}
    </div>
  );
}
