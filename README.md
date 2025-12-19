# Used Car Dashboard (Static GitHub Pages)

## 로컬 실행
```bash
npm install
npm run dev
```

## CSV 연결
- `public/cars.csv`를 본인 CSV로 교체하세요.
- 헤더: id, brand, model, year, price, mileage, fuelType, transmission

## GitHub Pages 배포
1) 이 레포를 `main`에 push
2) GitHub → Settings → Pages → Source: GitHub Actions
3) `.github/workflows/deploy.yml`에서 `BASE_PATH`를 `"/<레포이름>"`으로 수정
4) main에 push하면 자동 배포


## 빌드 오류(window/useSearchParams) 해결
- `window` 접근은 마운트 이후(useEffect)에서만 수행하도록 처리했습니다.
- `/detail`은 `Suspense`로 감싸 CSR 훅(useSearchParams)을 안전하게 사용합니다.
