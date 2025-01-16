import { useEffect, useState } from 'react'
import LineBreakIcon from '@mui/icons-material/SubdirectoryArrowLeft'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { GroupInfo } from '../hooks/useGroupInfo'
import { Settings } from '../hooks/useSettings'
import { GroupButton } from './GroupButton'
import { Icons } from './Icons'
import { getLocalizeMessage } from '../modules/i18n'
import { yellow } from '@mui/material/colors'

/** 設定パネル */
export const SettingsPanel = ({
  settings,
  groupInfoList,
  enableDescription,
  onChangeSettings,
  onChangeGroupInfoList,
}: {
  /** 拡張機能設定 */
  settings: Settings
  /** グループ定義リスト */
  groupInfoList: GroupInfo[]
  /** descriptionが有効か */
  enableDescription: boolean
  /** 拡張機能設定変更時の処理 */
  onChangeSettings: (newSettings: Settings) => void
  /** グループ定義リスト変更時の処理 */
  onChangeGroupInfoList: (newGroupInfoList: GroupInfo[]) => void
}) => {
  const { enabledTypes, addDescription, addLineBreak } = settings
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const [showHelp, setShowHelp] = useState(false)

  /** グループボタンのドロップ時の処理 */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) {
      return
    }
    if (active.id === over.id) {
      return
    }
    // グループリストの更新
    const oldIndex = groupInfoList.findIndex((info) => info.id === active.id)
    const newIndex = groupInfoList.findIndex((info) => info.id === over.id)
    const newGroupInfoList = arrayMove(groupInfoList, oldIndex, newIndex)
    onChangeGroupInfoList(newGroupInfoList)
    // 拡張機能設定の更新
    const groupOrder = newGroupInfoList.map((info) => info.type)
    onChangeSettings({ ...settings, groupOrder })
  }

  // Spaceキーの押下で addDescription の設定を反転させる
  useEffect(() => {
    const handleSpaceKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && enableDescription) {
        onChangeSettings({ ...settings, addDescription: !addDescription })
      }
    }
    document.addEventListener('keydown', handleSpaceKey)
    return () => {
      document.removeEventListener('keydown', handleSpaceKey)
    }
  }, [])

  return (
    <Box className="SettingsPanel" sx={{ overflow: 'hidden', overscrollBehavior: 'none' }}>
      {/* Help */}
      <Box
        className="Help"
        sx={{
          backgroundColor: yellow[50],
          borderTop: 'solid 1px rgba(0, 0, 0, 0.2)',
          position: 'fixed',
          bottom: showHelp ? '61px' : '-61px',
          opacity: showHelp ? 1 : 0,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1,
          transition: 'bottom 0.3s ease-in-out, opacity 0.5s ease-in-out',
        }}
      >
        <HelpOutlineIcon sx={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '1rem', mr: 0.5 }} />
        <Typography component="p" sx={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: '0.7rem' }}>
          {getLocalizeMessage('settings_group_help_link', '')}
          {enableDescription && getLocalizeMessage('settings_group_help_description', '')}
        </Typography>
      </Box>
      <Box
        sx={{
          zIndex: 10,
          position: 'relative',
          backgroundColor: '#fff',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          borderTop: 'solid 1px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Groups */}
        <Stack
          className="groups"
          direction="row"
          onMouseEnter={() => setShowHelp(true)}
          onMouseLeave={() => setShowHelp(false)}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={() => setShowHelp(false)}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={groupInfoList} strategy={horizontalListSortingStrategy}>
              {groupInfoList.map(({ id, type, label, color }) => {
                const enabled = !!enabledTypes?.find((t) => type === t)
                const foreColor = enabled ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)'
                const backColor = enabled ? color : '#ffffff'
                return (
                  <GroupButton
                    key={id}
                    id={id}
                    label={label}
                    icon={Icons[type]}
                    enabled={enabled}
                    foreColor={foreColor}
                    backColor={backColor}
                    onClick={() => {
                      const newEnableTypes = [...enabledTypes]
                      if (enabled) {
                        newEnableTypes.splice(newEnableTypes.indexOf(type), 1)
                      } else {
                        newEnableTypes.push(type)
                      }
                      onChangeSettings({ ...settings, enabledTypes: newEnableTypes })
                    }}
                  />
                )
              })}
            </SortableContext>
          </DndContext>
        </Stack>
        {/* Append options */}
        <Box className="append-options">
          <Stack
            direction="column"
            sx={{
              backgroundColor: '#f8f8f8',
              borderLeft: 'solid 1px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'flex-start',
              py: 0,
              px: 0.5,
            }}
          >
            {/* Append */}
            <Typography sx={{ color: '#666', fontSize: '0.7rem' }}>
              {getLocalizeMessage('settings_append', 'Append')}
            </Typography>
            {/* description */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={addDescription}
                  size="small"
                  disabled={!enableDescription}
                  disableRipple
                  sx={{ p: 0 }}
                />
              }
              label={
                <Typography
                  sx={{ color: enableDescription ? '#666' : 'rgba(0,0,0,0.3)', fontSize: '0.7rem' }}
                >
                  description
                </Typography>
              }
              title={getLocalizeMessage('settings_description_tooltip', '')}
              onChange={(e, checked) => {
                onChangeSettings({ ...settings, addDescription: checked })
              }}
              sx={{ m: 0 }}
            />
            {/* break */}
            <FormControlLabel
              control={<Checkbox checked={addLineBreak} size="small" disableRipple sx={{ p: 0 }} />}
              label={
                <Typography
                  sx={{
                    color: '#666',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  [{<LineBreakIcon sx={{ color: '#666', width: '10px' }} />}]
                </Typography>
              }
              title={getLocalizeMessage('settings_line_break_tooltip', '')}
              onChange={(e, checked) => {
                onChangeSettings({ ...settings, addLineBreak: checked })
              }}
              sx={{ m: 0 }}
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
