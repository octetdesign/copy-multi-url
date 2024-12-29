console.info('contentScript is running')

export interface OpenGraphInfo {
  title?: string
  description?: string
  type?: string
  url?: string
  siteName?: string
}

export interface PageData {
  title: string
  url: string
  description?: string
  author?: string
  keywords?: string
  og?: OpenGraphInfo
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageData') {
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

    sendResponse(pageData)
  }
  return true // 非同期レスポンスのために必要
})
