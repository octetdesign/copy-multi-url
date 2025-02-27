import * as LineBreakLink from '../components/links/LineBreakLink'
import * as Markdown1Link from '../components/links/Markdown1Link'
import * as Markdown2Link from '../components/links/Markdown2Link'
import * as HtmlLink from '../components/links/HtmlLink'
import * as WikiLink from '../components/links/WikiLink'
import * as TextileLink from '../components/links/TextileLink'
import * as ReStructuredText1Link from '../components/links/ReStructuredText1Link'
import * as ReStructuredText2Link from '../components/links/ReStructuredText2Link'
import * as TabLink from '../components/links/TabLink'
import * as PageInfo from '../components/links/PageInfo'
import { PageData } from './usePageData'
import { Settings } from './useSettings'
import { GroupInfo } from './useGroupInfo'
import { useMemo } from 'react'

/** リンクタイプ */
export type LinkType =
  | 'LineBreak'
  | 'Markdown1'
  | 'Markdown2'
  | 'Html'
  | 'Wiki'
  | 'Textile'
  | 'ReStructuredText1'
  | 'ReStructuredText2'
  | 'Tab'
  | 'PageInfo'

/** リンク定義 */
export interface LinkInfo {
  /** グループ定義 */
  groupInfo: GroupInfo
  /** 説明を含むか */
  description: boolean
  /** リンク文字列の取得 */
  getLinkText: (props: { linkData: LinkData; settings: Settings }) => string
  /** リンクアイテムボタンに表示するテキストのコンポーネント */
  buttonText: (props: { linkData: LinkData; settings: Settings }) => React.ReactNode
}

/** リンク定義のリスト */
export const LinkInfoList = [
  ...LineBreakLink.linkInfoList,
  ...Markdown1Link.linkInfoList,
  ...Markdown2Link.linkInfoList,
  ...HtmlLink.linkInfoList,
  ...WikiLink.linkInfoList,
  ...TextileLink.linkInfoList,
  ...ReStructuredText1Link.linkInfoList,
  ...ReStructuredText2Link.linkInfoList,
  ...TabLink.linkInfoList,
  ...PageInfo.linkInfoList,
]

/** リンクデータ */
export interface LinkData {
  pageData: PageData
  link: string
  url: string
  description?: string
}

/** ページデータの取得元 */
type GetFrom = 'document' | 'og'

/** リンクアイテム */
export interface LinkItem {
  /** ID */
  id: string
  /** リンク定義 */
  linkInfo: LinkInfo
  /** ページデータの取得元 */
  getFrom: GetFrom
  /** リンクテキスト */
  text: string
  /** リンクアイテムボタンに表示するテキストのコンポーネント */
  buttonText: React.ReactNode
}

/** リンクアイテムフック */
export const useLinkItem = ({
  pageData,
  settings,
}: {
  /** ページデータ */
  pageData: PageData | undefined
  /** 拡張機能設定 */
  settings: Settings
}) => {
  /** リンクアイテムリスト */
  const linkItemList = useMemo(() => {
    if (!pageData) {
      return []
    }
    let linkItemList: LinkItem[] = []
    const getFromList: GetFrom[] = ['document', 'og']
    LinkInfoList
      // 説明を付加する／しないでフィルタ
      .filter((linkInfo) => linkInfo.description === settings.addDescription)
      .forEach((linkInfo, index) => {
        getFromList.forEach((getFrom) => {
          const id = `link-${index}-${getFrom}`
          const linkData = getLinkData[getFrom](pageData)
          // リンクテキスト（クリップボードにコピーするテキスト）の取得
          const text = linkInfo.getLinkText({ linkData, settings })
          // 同じテキストが既に存在していたら除外
          if (text && linkItemList.find((l) => l.text === text)) {
            return
          }
          // 画面表示用のリンクコンポーネントを取得
          const buttonText = linkInfo.buttonText({ linkData, settings })
          // リストに追加
          linkItemList.push({ id, linkInfo, getFrom, text, buttonText })
        })
      })
    // リンクアイテムリストの並べ替え
    if (settings.groupOrder) {
      const order = settings.groupOrder
      linkItemList = linkItemList.sort((a, b) => {
        const indexA = order.indexOf(a.linkInfo.groupInfo.type)
        const indexB = order.indexOf(b.linkInfo.groupInfo.type)
        // typeOrder にない要素は後ろに配置する
        const rankA = indexA === -1 ? Infinity : indexA
        const rankB = indexB === -1 ? Infinity : indexB
        return rankA - rankB
      })
    }
    // 設定に従って絞り込みを行う
    linkItemList = linkItemList.filter(
      (linkItem) =>
        settings.enabledTypes?.find((type) => linkItem.linkInfo.groupInfo.type === type) &&
        settings.addDescription === linkItem.linkInfo.description,
    )
    return linkItemList
  }, [pageData, settings])

  return {
    /** リンクアイテムリスト */
    linkItemList,
  }
}

/** リンクデータの取得 */
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
