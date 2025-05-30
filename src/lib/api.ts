import { IngredientResponse } from "@/types/ingredient";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL =
  "https://apis.data.go.kr/1471000/CsmtcsIngdCpntInfoService01/getCsmtcsIngdCpntInfoService01";

export async function searchIngredient(
  ingredientName: string,
  pageNo: number = 1
): Promise<IngredientResponse> {
  if (!API_KEY) {
    throw new Error("API key is not configured");
  }

  const params = new URLSearchParams({
    serviceKey: API_KEY,
    pageNo: pageNo.toString(),
    numOfRows: "100",
    type: "json",
    INGR_KOR_NAME: ingredientName,
  });

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data); // 디버깅을 위한 로그

    // API 응답 구조 확인
    if (!data.body || !Array.isArray(data.body.items)) {
      throw new Error("Invalid API response structure");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
