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
  
  return {
    shake,
    shakeType,
    searchStart,
    setSearchStart,
    triggerShake,
  }
}