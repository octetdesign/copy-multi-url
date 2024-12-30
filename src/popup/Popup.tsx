import {
  Box,
  Button,
  Checkbox,
  darken,
  FormControlLabel,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
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
import { useSettings } from './hooks/useSettings'
import { usePageData } from './hooks/usePageData'
import { useGroupInfo } from './hooks/useGroupInfo'
import { useLinkItem } from './hooks/useLinkItem'
import { Icons, IconSize } from './components/Icons'
import { GroupButton } from './components/GroupButton'

/** リンクリストのポップアップ */
export const Popup = () => {
  const { pageData } = usePageData()
  const { settings, updateSettings } = useSettings()
  const { groupInfoList, updateGroupInfoList } = useGroupInfo({ settings })
  const { linkItemList } = useLinkItem({ pageData, settings })
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
    const oldIndex = groupInfoList.findIndex((info) => info.id === active.id)
    const newIndex = groupInfoList.findIndex((info) => info.id === over.id)
    const newGroupInfoList = arrayMove(groupInfoList, oldIndex, newIndex)
    updateGroupInfoList(newGroupInfoList)
    const groupOrder = newGroupInfoList.map((info) => info.type)
    updateSettings({ ...settings, groupOrder })
  }

  if (!pageData || !settings) {
    return <></>
  }

  const { enabledTypes, addDescription, addLineBreak } = settings

  return (
    <Box sx={{ p: 0, m: 0 }}>
      {/* リンクリスト */}
      <Stack
        direction="column"
        spacing={0.5}
        sx={{
          fontFamily: 'system-ui',
          p: 1,
          mb: '64px',
        }}
      >
        {linkItemList.map((linkItem) => {
          const { linkInfo } = linkItem
          const { type, color } = linkInfo.groupInfo
          return (
            <Button
              key={`${type}-${linkItem.getFrom}-${linkInfo.description}`}
              fullWidth
              onClick={async (e) => {
                const text = e.altKey || e.metaKey ? `${linkItem.text}\n` : linkItem.text
                await navigator.clipboard.writeText(text)
                setTimeout(() => {
                  window.close()
                }, 350)
              }}
              sx={{
                textTransform: 'none',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                alignItems: 'center',
                gap: 1,
                backgroundColor: color,
                borderRadius: 1,
                p: 0.5,
                pl: 1,
                cursor: 'pointer',
                ':hover': {
                  backgroundColor: darken(color, 0.1),
                  outline: `solid 1px ${darken(color, 0.2)}`,
                },
              }}
            >
              {/* アイコン */}
              <Tooltip title={linkInfo.groupInfo.label} arrow placement="bottom">
                <div style={{ ...IconSize, opacity: 0.5 }}>{Icons[type]}</div>
              </Tooltip>
              {/* リンクプレビュー */}
              <Box
                title="Copy to Clipboard"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: 'system-ui',
                  fontSize: '0.8rem',
                  textAlign: 'left',
                  whiteSpace: 'pre-wrap',
                  borderRadius: 1,
                  p: 1,
                }}
              >
                {linkItem.component}
              </Box>
            </Button>
          )
        })}
      </Stack>

      {/* 設定 */}
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={groupInfoList} strategy={horizontalListSortingStrategy}>
              {groupInfoList.map(({ id, type, label, color }) => {
                const enabled = !!enabledTypes?.find((t) => type === t)
                const foreColor = enabled ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)'
                const backColor = enabled ? `${color} !important` : 'transparent'
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
                      updateSettings({ ...settings, enabledTypes: newEnableTypes })
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
          <Typography sx={{ color: '#666', fontSize: '0.7rem' }}>Add</Typography>
          <FormControlLabel
            control={<Checkbox checked={addDescription} size="small" disableRipple sx={{ p: 0 }} />}
            label={<Typography sx={{ color: '#666', fontSize: '0.7rem' }}>description</Typography>}
            onChange={(e, checked) => {
              updateSettings({ ...settings, addDescription: checked })
            }}
            sx={{ m: 0 }}
          />
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
            onChange={(e, checked) => {
              updateSettings({ ...settings, addLineBreak: checked })
            }}
            sx={{ m: 0 }}
          />
        </Stack>
      </Box>
    </Box>
  )
}

export default Popup
