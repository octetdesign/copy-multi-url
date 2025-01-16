import { useCallback, useEffect, useState } from 'react'

/** Open Graph Info (<meta property="og:*")>) */
interface OpenGraphInfo {
  /** Title (<meta property="og:title")>) */
  title?: string
  /** Description (<meta property="og:description")>) */
  description?: string
  /** Type (<meta property="og:type")>) */
  type?: string
  /** URL (<meta property="og:url")>) */
  url?: string
  /** Site Name (<meta property="og:site_name")>) */
  siteName?: string
}

/** ページデータ */
export interface PageData {
  /** Title (document.title) */
  title: string
  /** URL (location.href) */
  url: string
  /** Description (<meta name="description")>) */
  description?: string
  /** Author (<meta name="author")>) */
  author?: string
  /** Keywords (<meta name="keywords")>) */
  keywords?: string
  /** Open Graph Info (<meta property="og:*")>) */
  og?: OpenGraphInfo
}

/** ページデータフック */
export const usePageData = () => {
  /** ページデータ */
  const [pageData, setPageData] = useState<PageData>()

  /** ページデータの取得 */
  const getPageData = useCallback(() => {
    const location = window.location
    const url = location.href
    let title = document.title

    // title が空だったら location から生成する
    if (title === '') {
      title = location.pathname.replace(/\/$/, '').replace(/.*\//, '')
      title = title === '' ? location.hostname : `${title} - ${location.hostname}`
    }

    const getMetaData = (name: string) => {
      const data = document.querySelector(`meta[${name}]`)?.getAttribute('content')
      return data ? data : undefined
    }
    const getOgData = (name: string) => {
      return getMetaData(`property="og:${name}"`)
    }

    const pageData: PageData = {
      title,
      url,
      description: getMetaData('name="description"'),
      author: getMetaData('name="author"'),
      keywords: getMetaData('name="keywords"'),
      og: {
        title: getOgData('title'),
        description: getOgData('description'),
        type: getOgData('type'),
        url: getOgData('url'),
        siteName: getOgData('site_name'),
      },
    }

    return pageData
  }, [])

  /** ページデータの読み込み */
  useEffect(() => {
    const load = async () => {
      // 現在のタブを取得
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tab?.id || !tab?.url) {
        console.warn('No active tab found.')
        return
      }
      try {
        // スクリプトを実行してページデータを取得
        const result = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: getPageData,
        })
        const pageData = result[0].result
        setPageData(pageData)
      } catch (error) {
        // スクリプト実行エラー時はタブからタイトルとURLだけ取得
        console.warn(error)
        const pageData: PageData = {
          title: tab.title ? tab.title : tab.url,
          url: tab.url,
        }
        setPageData(pageData)
      }
    }
    load()
  }, [])

  return {
    /** ページデータ */
    pageData,
    /** ページデータに説明があるか */
    hasDescription: pageData?.description !== undefined || pageData?.og?.description !== undefined,
  }
}
