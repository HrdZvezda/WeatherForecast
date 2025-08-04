import { React, useState, useCallback } from 'react';

const useGetlocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError("您的瀏覽器不支援地理位置功能");
      return;
    }

    setLoading(true);
    setError("");
    console.log("開始定位...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        
        // 直接設置坐標對象，WeatherData.jsx 會處理
        setLocation(coords);
        setError("");
        setLoading(false);
        console.log("定位成功:", coords);
        console.log("緯度:", coords.lat, "經度:", coords.lon);
      },
      (err) => {
        setLoading(false);
        let message = "無法取得您的位置";
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = "位置權限被拒絕。請到瀏覽器設定中允許此網站存取位置資訊";
            console.error("定位權限被拒絕");
            break;
          case err.POSITION_UNAVAILABLE:
            message = "位置資訊不可用。請確保裝置已啟動GPS或網路定位服務";
            console.error("位置資訊不可用");
            break;
          case err.TIMEOUT:
            message = "取得位置逾時。請確保網路連線正常並重試";
            console.error("定位逾時");
            break;
          default:
            message = `定位發生未知錯誤: ${err.message}`;
            console.error("定位未知錯誤:", err);
            break;
        }
        setError(message);
        console.error("定位錯誤詳情:", {
          code: err.code,
          message: err.message,
          accuracy: err.accuracy
        });
      },
      {
        enableHighAccuracy: true,  // 啟用高精度定位
        timeout: 15000,            // 15秒逾時
        maximumAge: 300000         // 5分鐘內的快取位置可接受
      }
    );
  }, []);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return { 
    location, 
    error, 
    loading, 
    getLocation, 
    clearError 
  };
}

export default useGetlocation;