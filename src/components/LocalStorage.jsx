import React from "react"

export class LocalStorageManager {
    static get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
      } catch (error) {
        console.error(`讀取 localStorage 失敗 (${key}):`, error)
        return defaultValue
      }
    }
    
    static set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value))
        return true
      } catch (error) {
        console.error(`寫入 localStorage 失敗 (${key}):`, error)
        return false
      }
    }
    
    static remove(key) {
      try {
        localStorage.removeItem(key)
        return true
      } catch (error) {
        console.error(`刪除 localStorage 失敗 (${key}):`, error)
        return false
      }
    }
  }