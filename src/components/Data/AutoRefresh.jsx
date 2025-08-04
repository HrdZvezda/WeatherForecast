import { useEffect, useRef } from 'react'
import { APP_CONFIG } from './Constant.jsx'

export function useAutoRefresh(callback, dependencies = [], enabled = true) {
  const intervalRef = useRef(null)
  
  useEffect(() => {
    if (!enabled) return
    
    // 清除之前的 interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    // 設置新的 interval
    intervalRef.current = setInterval(() => {
      console.log('自動更新中...')
      callback()
    }, APP_CONFIG.AUTO_REFRESH_INTERVAL)
    
    // 清理函數
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [...dependencies, enabled])
  
  // 組件卸載時清理
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
}