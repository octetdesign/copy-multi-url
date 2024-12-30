import { useCallback, useEffect, useState } from 'react'
import { LinkType } from '../hooks/useLinkItem'

/** 機能拡張の設定 */
export interface Settings {
  /** グループの並び順 */
  groupOrder: LinkType[]
  /** 有効なリンクタイプ */
  enabledTypes: LinkType[]
  /** リンクに説明を追加するか */
  addDescription: boolean
  /** リンクに改行を追加するか */
  addLineBreak: boolean
}
const groups: LinkType[] = [
  'LineBreak',
  'Markdown1',
  'Markdown2',
  'Html',
  'Wiki',
  'Textile',
  'Tab',
  'PageInfo',
]
/** 初期設定 */
const defaultSettings: Settings = {
  groupOrder: groups,
  enabledTypes: groups,
  addDescription: false,
  addLineBreak: false,
}

/** 拡張機能の設定 */
export const useSettings = () => {
  /** 拡張機能の設定 */
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  /** 拡張機能の設定を読み込む */
  const loadSettings = useCallback(async (): Promise<Settings> => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['settings'], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(result.settings || defaultSettings) // defaultSettingsは初期値
        }
      })
    })
  }, [])

  /** 拡張機能の設定を保存する */
  const saveSettings = useCallback(async (settings: Settings) => {
    try {
      await chrome.storage.local.set({ settings })
      // console.log('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }, [])

  /** 拡張機能の設定を更新する */
  const updateSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings)
    saveSettings(newSettings)
  }, [])

  /** 設定の読み込み */
  useEffect(() => {
    const load = async () => {
      const settings = await loadSettings()
      if (!settings) {
        return
      }
      setSettings(settings)
    }
    load()
  }, [])

  return {
    /** 拡張機能の設定 */
    settings,
    /** 設定を更新する */
    updateSettings,
  }
}
