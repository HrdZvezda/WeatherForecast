import { useState } from 'react'
import { APP_CONFIG } from '../components/Constant'

export function useUIState() {
  const [shake, setShake] = useState(false)
  const [searchStart, setSearchStart] = useState(false)
  const [shakeType, setShakeType] = useState('') // 新增：震動類型
  
  const triggerShake = (type = 'error') => {
    setShakeType(type)
    setShake(true)
    setTimeout(() => {
      setShake(false)
      setShakeType('')
    }, APP_CONFIG.SHAKE_DURATION)
  }
  
  // 專門為搜尋錯誤設計的震動
  const triggerSearchShake = () => {
    triggerShake('search-error')
  }
  
  // 專門為輸入無效設計的震動
  const triggerInputShake = () => {
    triggerShake('input-error')
  }
  
  return {
    shake,
    shakeType,
    searchStart,
    setSearchStart,
    triggerShake,
    triggerSearchShake,
    triggerInputShake
  }
}