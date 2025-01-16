import { useEffect, useRef, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useSettings } from './hooks/useSettings'
import { usePageData } from './hooks/usePageData'
import { useGroupInfo } from './hooks/useGroupInfo'
import { useLinkItem } from './hooks/useLinkItem'
import { LinkItemButton } from './components/LinkItemButton'
import { SettingsPanel } from './components/SettingsPanel'
import { getLocalizeMessage } from './modules/i18n'

/** リンクリストのポップアップ */
export const Popup = () => {
  const { pageData, hasDescription } = usePageData()
  const { settings, updateSettings } = useSettings()
  const { groupInfoList, updateGroupInfoList } = useGroupInfo({ settings })
  const { linkItemList } = useLinkItem({ pageData, settings })
  const [renderKey, setRenderKey] = useState(0)

  // リストの高さ調整
  const maxHeight = 600
  const settingsHeight = 62
  const listRef = useRef<HTMLDivElement>(null)
  const [wrapperHeight, setWrapperHeight] = useState<string | undefined>(undefined)
  useEffect(() => {
    const listHeight = listRef.current?.clientHeight
    if (listHeight && listHeight + settingsHeight > maxHeight) {
      setWrapperHeight(`${maxHeight - settingsHeight}px`)
    } else {
      setWrapperHeight(undefined)
    }
  }, [linkItemList])

  // ページデータがない場合は何も表示しない
  if (!pageData) {
    return <></>
  }

  return (
    <Box key={renderKey} sx={{ p: 0, m: 0 }}>
      {/* リンクアイテムボタンのリスト */}
      <Box
        className="LinkItemButtonListWrapper"
        sx={{
          p: 0,
          m: 0,
          height: wrapperHeight,
          overflowY: 'scroll',
          overflowX: 'hidden',
          overscrollBehavior: 'none',
        }}
      >
        <Stack
          ref={listRef}
          className="LinkItemButtonList"
          direction="column"
          spacing={0.5}
          sx={{
            p: 1,
            m: 0,
          }}
        >
          {linkItemList.length > 0 ? (
            linkItemList.map((linkItem) => <LinkItemButton key={linkItem.id} linkItem={linkItem} />)
          ) : (
            <Typography
              component="p"
              sx={{ py: 2, m: 0, color: '#666', fontSize: '0.8rem', textAlign: 'center' }}
            >
              {getLocalizeMessage('message_select_link_format', 'Please select a link format.')}
            </Typography>
          )}
        </Stack>
      </Box>
      {/* 設定 */}
      <SettingsPanel
        settings={settings}
        groupInfoList={groupInfoList}
        enableDescription={hasDescription}
        onChangeSettings={(newSettings) => {
          // 拡張機能設定の更新
          updateSettings(newSettings)
          // レンダリングの更新
          setRenderKey((prev) => prev + 1)
        }}
        onChangeGroupInfoList={(newGroupInfoList) => {
          // グループ定義リストの更新
          updateGroupInfoList(newGroupInfoList)
        }}
      />
    </Box>
  )
}

export default Popup
