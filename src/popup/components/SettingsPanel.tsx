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
import { GroupInfo } from '../hooks/useGroupInfo'
import { Settings } from '../hooks/useSettings'
import { GroupButton } from './GroupButton'
import { Icons } from './Icons'
import { getLocalizeMessage } from '../modules/i18n'

/** 設定パネル */
export const SettingsPanel = ({
  settings,
  groupInfoList,
  onChangeSettings,
  onChangeGroupInfoList,
}: {
  /** 拡張機能設定 */
  settings: Settings
  /** グループ定義リスト */
  groupInfoList: GroupInfo[]
  /** 拡張機能設定変更時の処理 */
  onChangeSettings: (newSettings: Settings) => void
  /** グループ定義リスト変更時の処理 */
  onChangeGroupInfoList: (newGroupInfoList: GroupInfo[]) => void
}) => {
  const { enabledTypes, addDescription, addLineBreak } = settings
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

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

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        position: 'fixed',
        bottom: 0,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        width: '100%',
        borderTop: 'solid 1px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Groups */}
      <Stack direction="row">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
      {/* Add options */}
      <Stack
        direction="column"
        sx={{
          backgroundColor: '#f8f8f8',
          display: 'flex',
          alignItems: 'flex-start',
          py: 0,
          px: 0.5,
        }}
      >
        {/* Add */}
        <Typography sx={{ color: '#666', fontSize: '0.7rem' }}>
          {getLocalizeMessage('settings_add', 'Add')}
        </Typography>
        {/* description */}
        <FormControlLabel
          control={<Checkbox checked={addDescription} size="small" disableRipple sx={{ p: 0 }} />}
          label={<Typography sx={{ color: '#666', fontSize: '0.7rem' }}>description</Typography>}
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
  )
}
