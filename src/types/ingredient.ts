export interface IngredientItem {
  INGR_KOR_NAME: string;
  INGR_ENG_NAME: string;
  CAS_NO: string;
  ORIGIN_MAJOR_KOR_NAME: string;
  INGR_SYNONYM: string | null;
}

export interface IngredientResponse {
  header: {
    resultCode: string;
    resultMsg: string;
  };
  body: {
    pageNo: number;
    totalCount: number;
    numOfRows: number;
    items: IngredientItem[];
  };
}
