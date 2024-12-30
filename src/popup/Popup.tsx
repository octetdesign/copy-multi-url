import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Checkbox,
  darken,
  FormControlLabel,
  Stack,
  SxProps,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'

import './Popup.css'
import { getLinkItemList, GroupInfo, GroupInfoList, LinkType } from './getLink'

// import LineBreakIcon from '@mui/icons-material/KeyboardReturn'
import LineBreakIcon from '@mui/icons-material/SubdirectoryArrowLeft'
import { MarkdownIcon } from './components/icon/MarkdownIcon'
import HtmlIcon from '@mui/icons-material/Code'
// import HtmlIcon from '@mui/icons-material/Html'
import { WikiIcon } from './components/icon/WikiIcon'
// import TextileIcon from '@mui/icons-material/FormatQuote'
import TextileIcon from '@mui/icons-material/TextFields'
import PageInfoIcon from '@mui/icons-material/Article'
import TabIcon from '@mui/icons-material/KeyboardTab'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { GroupButton } from './components/GroupButton'

interface OpenGraphInfo {
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

const getPageData = () => {
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
}

export interface Settings {
  groupOrder: LinkType[]
  enabledTypes: LinkType[]
  addDescription: boolean
  addLineBreak: boolean
}
const groups: LinkType[] = [
  'LineBreak',
  'Markdown1',
  'Markdown2',
  'Html',
  'Wiki',
  'Textile',
  'Tab',
  'PageInfo',
]
const defaultSettings: Settings = {
  groupOrder: groups,
  enabledTypes: groups,
  addDescription: false,
  addLineBreak: false,
}

const saveSettingsToStorage = async (settings: Settings) => {
  try {
    await chrome.storage.local.set({ settings })
    console.log('Settings saved successfully')
  } catch (error) {
    console.error('Error saving settings:', error)
  }
}

const loadSettings = async (): Promise<Settings> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['settings'], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(result.settings || defaultSettings) // defaultSettingsは初期値
      }
    })
  })
}

/** リンクリストのポップアップ */
export const Popup = () => {
  const [groupInfoList, setGroupInfoList] = useState<GroupInfo[]>(GroupInfoList)
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [pageData, setPageData] = useState<PageData>()
  const { groupOrder, enabledTypes, addDescription, addLineBreak } = settings

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const sortedGroupInfoList = groupInfoList.sort((a, b) => {
    const indexA = groupOrder.indexOf(a.type)
    const indexB = groupOrder.indexOf(b.type)
    // typeOrder にない要素は後ろに配置する
    const rankA = indexA === -1 ? Infinity : indexA
    const rankB = indexB === -1 ? Infinity : indexB
    return rankA - rankB
  })

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
    setGroupInfoList(newGroupInfoList)
    const groupOrder = newGroupInfoList.map((info) => info.type)
    saveSettings({ ...settings, groupOrder })
  }

  useEffect(() => {
    const func = async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tab?.id || !tab?.url) {
        console.warn('No active tab found.')
        return
      }

      const result = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getPageData,
      })
      const pageData = result[0].result

      setPageData(pageData)
    }
    func()
  }, [])

  useEffect(() => {
    const load = async () => {
      const settings = await loadSettings()
      if (!settings) {
        return
      }
      setSettings(settings)
    }
    load()
  }, [])

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings)
    saveSettingsToStorage(newSettings)
  }

  const iconSize = { width: '24px', height: '24px' }
  const iconSx: SxProps = { ...iconSize, color: '#000' }
  const iconMap = {
    LineBreak: <LineBreakIcon sx={iconSx} />,
    Markdown1: <MarkdownIcon sx={iconSx} />,
    Markdown2: <MarkdownIcon sx={iconSx} />,
    Html: <HtmlIcon sx={iconSx} />,
    Wiki: <WikiIcon sx={iconSx} />,
    Textile: <TextileIcon sx={iconSx} />,
    Tab: <TabIcon sx={iconSx} />,
    PageInfo: <PageInfoIcon sx={iconSx} />,
  }

  if (!pageData || !settings) {
    return <></>
  }

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
        {getLinkItemList({ pageData, settings })
          .filter(
            (linkItem) =>
              enabledTypes?.find((type) => linkItem.linkInfo.groupInfo.type === type) &&
              addDescription === linkItem.linkInfo.description,
          )
          .map((linkItem) => {
            const { linkInfo } = linkItem
            const { type, color } = linkInfo.groupInfo
            return (
              <Button
                key={`${type}-${linkItem.from}-${linkInfo.description}`}
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
                <Tooltip title={linkInfo.groupInfo.label} arrow placement="bottom">
                  <div style={{ ...iconSize, opacity: 0.5 }}>{iconMap[type]}</div>
                </Tooltip>

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
            <SortableContext items={sortedGroupInfoList} strategy={horizontalListSortingStrategy}>
              {sortedGroupInfoList.map(({ id, type, label, color }) => {
                const enabled = !!enabledTypes?.find((t) => type === t)
                const foreColor = enabled ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)'
                const backColor = enabled ? `${color} !important` : 'transparent'
                return (
                  <GroupButton
                    key={id}
                    id={id}
                    label={label}
                    icon={iconMap[type]}
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
                      saveSettings({ ...settings, enabledTypes: newEnableTypes })
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
              saveSettings({ ...settings, addDescription: checked })
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
              saveSettings({ ...settings, addLineBreak: checked })
            }}
            sx={{ m: 0 }}
          />
        </Stack>
      </Box>
    </Box>
  )
}

export default Popup
