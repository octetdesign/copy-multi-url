import { Box, Stack } from '@mui/material'
import { useSettings } from './hooks/useSettings'
import { usePageData } from './hooks/usePageData'
import { useGroupInfo } from './hooks/useGroupInfo'
import { useLinkItem } from './hooks/useLinkItem'
import { LinkItemButton } from './components/LinkItemButton'
import { SettingsPanel } from './components/SettingsPanel'

/** リンクリストのポップアップ */
export const Popup = () => {
  const { pageData } = usePageData()
  const { settings, updateSettings } = useSettings()
  const { groupInfoList, updateGroupInfoList } = useGroupInfo({ settings })
  const { linkItemList } = useLinkItem({ pageData, settings })

  if (!pageData) {
    return <></>
  }

  return (
    <Box sx={{ p: 0, m: 0 }}>
      {/* リンクアイテムボタンのリスト */}
      <Stack
        direction="column"
        spacing={0.5}
        sx={{
          p: 1,
          mb: '64px',
        }}
      >
        {linkItemList.map((linkItem) => (
          <LinkItemButton key={linkItem.id} linkItem={linkItem} />
        ))}
      </Stack>
      {/* 設定 */}
      <SettingsPanel
        settings={settings}
        groupInfoList={groupInfoList}
        onChangeSettings={(newSettings) => {
          // 拡張機能設定の更新
          updateSettings(newSettings)
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
