import { useCallback, useEffect, useState } from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'
import * as LineBreakLink from '../components/links/LineBreakLink'
import * as Markdown1Link from '../components/links/Markdown1Link'
import * as Markdown2Link from '../components/links/Markdown2Link'
import * as HtmlLink from '../components/links/HtmlLink'
import * as WikiLink from '../components/links/WikiLink'
import * as TextileLink from '../components/links/TextileLink'
import * as TabLink from '../components/links/TabLink'
import * as PageInfo from '../components/links/PageInfo'
import { Settings } from './useSettings'
import { LinkType } from './useLinkItem'

/** グループ定義 */
export interface GroupInfo {
  id: UniqueIdentifier
  type: LinkType
  label: string
  color: string
}

/** グループ定義のリスト */
const GroupInfoList = [
  LineBreakLink.groupInfo,
  Markdown1Link.groupInfo,
  Markdown2Link.groupInfo,
  HtmlLink.groupInfo,
  WikiLink.groupInfo,
  TextileLink.groupInfo,
  TabLink.groupInfo,
  PageInfo.groupInfo,
]

/** グループ定義フック */
export const useGroupInfo = ({ settings }: { settings: Settings }) => {
  /** グループ定義リスト */
  const [groupInfoList, setGroupInfoList] = useState<GroupInfo[]>(GroupInfoList)

  /** グループ定義リストの更新 */
  const updateGroupInfoList = useCallback((newList: GroupInfo[]) => {
    setGroupInfoList(newList)
  }, [])

  /** グループ定義リストをソートして更新 */
  useEffect(() => {
    const sortedList = groupInfoList.sort((a, b) => {
      const indexA = settings.groupOrder.indexOf(a.type)
      const indexB = settings.groupOrder.indexOf(b.type)
      // typeOrder にない要素は後ろに配置する
      const rankA = indexA === -1 ? Infinity : indexA
      const rankB = indexB === -1 ? Infinity : indexB
      return rankA - rankB
    })
    updateGroupInfoList(sortedList)
  }, [settings.groupOrder])

  return {
    /** グループ定義リスト */
    groupInfoList,
    /** グループ定義リストの更新 */
    updateGroupInfoList,
  }
}
