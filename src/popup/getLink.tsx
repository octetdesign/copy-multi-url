import { ReactNode } from 'react'
import { PageData } from '../contentScript'
import * as LineBreakLink from './components/LineBreakLink'
import * as Markdown1Link from './components/Markdown1Link'
import * as Markdown2Link from './components/Markdown2Link'
import * as HtmlLink from './components/HtmlLink'
import * as WikiLink from './components/WikiLink'
import * as TextileLink from './components/TextileLink'
import * as TabLink from './components/TabLink'
import * as PageInfo from './components/PageInfo'
import { Settings } from './Popup'

export type LinkType =
  | 'LineBreak'
  | 'Markdown1'
  | 'Markdown2'
  | 'Html'
  | 'Wiki'
  | 'Textile'
  | 'Tab'
  | 'PageInfo'
export interface GroupInfo {
  type: LinkType
  label: string
  color: string
}

export interface LinkInfo {
  groupInfo: GroupInfo
  description: boolean
  getLinkText: (props: { linkData: LinkData; settings: Settings }) => string
  template: (props: { linkData: LinkData; settings: Settings }) => React.ReactNode
}

export const GroupInfoList = [
  LineBreakLink.groupInfo,
  Markdown1Link.groupInfo,
  Markdown2Link.groupInfo,
  HtmlLink.groupInfo,
  WikiLink.groupInfo,
  TextileLink.groupInfo,
  TabLink.groupInfo,
  PageInfo.groupInfo,
]

export const LinkInfoList = [
  ...LineBreakLink.linkInfoList,
  ...Markdown1Link.linkInfoList,
  ...Markdown2Link.linkInfoList,
  ...HtmlLink.linkInfoList,
  ...WikiLink.linkInfoList,
  ...TextileLink.linkInfoList,
  ...TabLink.linkInfoList,
  ...PageInfo.linkInfoList,
]

type From = 'document' | 'og'

/** リンクアイテムリストの取得 */
export const getLinkItemList = ({
  pageData,
  settings,
}: {
  pageData: PageData | undefined
  settings: Settings | undefined
}) => {
  if (!pageData || !settings) {
    return []
  }
  const linkItemList: { linkInfo: LinkInfo; from: From; text: string; component: ReactNode }[] = []
  const fromList: From[] = ['document', 'og']
  LinkInfoList
    // 説明を付加する／しないでフィルタ
    .filter((linkInfo) => linkInfo.description === settings.addDescription)
    .forEach((linkInfo) => {
      fromList.forEach((from) => {
        const linkData = getLinkData[from](pageData)
        // リンクテキスト（クリップボードにコピーするテキスト）の取得
        const text = linkInfo.getLinkText({ linkData, settings })
        // 同じテキストが既に存在していたら除外
        if (text && linkItemList.find((l) => l.text === text)) {
          return
        }
        // 画面表示用のリンクコンポーネントを取得
        const component = linkInfo.template({ linkData, settings })
        // リストに追加
        linkItemList.push({ linkInfo, from, text, component })
      })
    })
  return linkItemList
}

export interface LinkData {
  pageData: PageData
  link: string
  url: string
  description?: string
}

const getLinkData: { [from: string]: (pageData: PageData) => LinkData } = {
  /** documentから取得 */
  document: (pageData) => {
    const { title, url, description } = pageData
    return {
      pageData,
      link: title,
      url,
      description: selectAorB(description, pageData.og?.description),
    }
  },
  /** なるべくOGPから取得 */
  og: (pageData) => {
    const { title, url, description } = pageData
    const ogTitle = pageData.og?.title
    const ogUrl = pageData.og?.url
    const ogDescription = pageData.og?.description
    const ogSiteName = pageData.og?.siteName

    // linkの設定
    let link = title
    let ogLink = ogTitle ? ogTitle : title
    if (ogSiteName) {
      // link に ogSiteName が含まれていなかったら付加したものを link にセット
      if (link.indexOf(ogSiteName) == -1) {
        link = `${link} - ${ogSiteName}`
      }
      // ogLink に ogSiteName が含まれていなかったら付加したものを ogLink にセット
      if (ogLink.indexOf(ogSiteName) == -1) {
        ogLink = `${ogLink} - ${ogSiteName}`
      }
    }

    return {
      pageData,
      link: selectAorB(link, ogLink),
      url: selectAorB(ogUrl, url),
      description: selectAorB(ogDescription, description),
    }
  },
}

////////

/**
 * a と b が類似していたら a を、類似していなかったら b を返す。
 * @param a
 * @param b
 * @returns
 */
const selectAorB = (a: string | undefined, b: string | undefined) => {
  const strA = a !== undefined ? a : ''
  const strB = b !== undefined ? b : ''
  if (strA === strB) return strA
  if (strA && !strB) return strA
  if (!strA && strB) return strB
  // strA と strB が似ていたら strA を、似ていなかったら strB を返す
  return areStringsSimilar(strA, strB, 0.9) ? strA : strB
}

/**
 * レーベンシュタイン距離（編集距離）を計算する関数
 * @param str1 比較対象の文字列1
 * @param str2 比較対象の文字列2
 * @returns レーベンシュタイン距離
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length
  const dp: number[][] = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0))

  for (let i = 0; i <= len1; i++) dp[i][0] = i
  for (let j = 0; j <= len2; j++) dp[0][j] = j

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1
      }
    }
  }
  return dp[len1][len2]
}

/**
 * 文字列の類似度を計算する関数
 * @param str1 比較対象の文字列1
 * @param str2 比較対象の文字列2
 * @returns 類似度（0〜1の範囲）
 */
function calculateSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1, str2)
  const maxLength = Math.max(str1.length, str2.length)

  // 最大長が0の場合（両方空文字）は類似度を1とする
  return maxLength === 0 ? 1 : 1 - distance / maxLength
}

/**
 * 文字列が類似しているかを判定する関数
 * @param str1 比較対象の文字列1
 * @param str2 比較対象の文字列2
 * @param threshold 類似度の閾値（デフォルト: 0.9）
 * @returns true: 類似している / false: 類似していない
 */
function areStringsSimilar(str1: string, str2: string, threshold: number = 0.9): boolean {
  if (str1 === str2) {
    return true
  }
  const similarity = calculateSimilarity(str1, str2)
  return similarity >= threshold
}
