# Weather Forecast App  

一個基於 React 的天氣預報網站，使用 OpenWeatherMap API 取得即時天氣、未來預報與空氣品質資料，並支援 中英文切換、城市收藏、地理定位。  

## 專案網址  
[Weather Forecast App](https://hrdzvezda.github.io/WeatherForecast/)  

---

## 功能特色  
- 即時天氣顯示：展示當前溫度、天氣狀態、城市名稱。  
- 五日天氣預報：以折線圖 (Recharts) 呈現未來的氣溫與降雨機率。  
- 空氣品質資訊：提供 AQI 與詳細的空氣污染物數值。  
- 中英文切換：自建 i18n Context，支援瀏覽器語言偵測與手動切換。  
- 收藏城市：使用 LocalStorage 儲存並快速查看多個城市的天氣。  
- 地理定位：透過 Geolocation API 取得使用者位置，自動顯示所在城市的天氣。  
- 即時時鐘：顯示當前時間與日期，隨系統更新。  

---

## 技術架構  
- HTML/CSS：頁面結構與樣式設計（含 CSS backdrop-filter、media queries）。  
- JavaScript (ES6+)：前端邏輯與資料處理。  
- React：前端框架，元件化開發與狀態管理。  
- Recharts：繪製氣溫與降雨的折線圖。  
- lucide-react：展示天氣相關圖示。  
- OpenWeatherMap API：天氣、預報、空氣品質資料來源。  
- LocalStorage API：儲存使用者收藏與語言設定。  
- Geolocation API：取得使用者當前位置。  
- 環境變數 (import.meta.env)：管理 API Key。  
- 自建 i18n Context：多語言切換與天氣描述翻譯。  

---
