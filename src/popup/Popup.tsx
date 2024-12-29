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
import { getLinkItemList, GroupInfoList, LinkType } from './getLink'
import { PageData } from '../contentScript'

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

export interface Settings {
  enabledTypes: LinkType[]
  addDescription: boolean
  addLineBreak: boolean
}
const defaultSettings: Settings = {
  enabledTypes: [
    'LineBreak',
    'Markdown1',
    'Markdown2',
    'Html',
    'Wiki',
    'Textile',
    'Tab',
    'PageInfo',
  ],
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
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [pageData, setPageData] = useState<PageData>()
  const enabledTypes = settings.enabledTypes
  const addDescription = settings.addDescription
  const addLineBreak = settings.addLineBreak

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

  useEffect(() => {
    const getPageData = async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tab.id) {
        return
      }
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getPageData' })
      if (!response) {
        return
      }
      setPageData(response as PageData)
    }

    getPageData()
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

  return (
    <Box sx={{ p: 0, m: 0 }}>
      {/* リンクリスト */}
      {pageData && settings && (
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
      )}

      {/* 設定 */}
      {settings && (
        <Box
          sx={{
            backgroundColor: '#fff',
            position: 'fixed',
            bottom: 0,
            width: '100%',
          }}
        >
          <Stack direction="row">
            <ToggleButtonGroup
              color="primary"
              fullWidth
              value={settings.enabledTypes}
              onChange={(e, newValue) => {
                saveSettings({ ...settings, enabledTypes: newValue })
              }}
            >
              {GroupInfoList.map(({ type, label, color }) => {
                const enabled = !!enabledTypes?.find((t) => type === t)
                const foreColor = enabled ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)'
                const backColor = enabled ? `${color} !important` : 'transparent'
                return (
                  <ToggleButton
                    key={type}
                    value={type}
                    sx={{
                      color: foreColor,
                      backgroundColor: backColor,
                      borderRadius: 0,
                      px: 0,
                      py: 0.5,
                    }}
                  >
                    <Stack sx={{ alignItems: 'center' }}>
                      <div style={{ opacity: enabled ? 0.5 : 0.2 }}>{iconMap[type]}</div>
                      <Typography
                        component="p"
                        sx={{
                          color: foreColor,
                          fontSize: '0.6rem',
                          textTransform: 'none',
                          ml: 0.5,
                        }}
                      >
                        {label}
                      </Typography>
                    </Stack>
                  </ToggleButton>
                )
              })}
            </ToggleButtonGroup>
            <Stack
              direction="column"
              sx={{
                backgroundColor: '#f8f8f8',
                border: 'solid 1px rgba(0, 0, 0, 0.2)',
                borderLeft: 'none',
                display: 'flex',
                alignItems: 'flex-start',
                py: 0,
                px: 0.5,
              }}
            >
              <Typography sx={{ color: '#666', fontSize: '0.7rem' }}>Add</Typography>
              <FormControlLabel
                control={
                  <Checkbox checked={addDescription} size="small" disableRipple sx={{ p: 0 }} />
                }
                label={
                  <Typography sx={{ color: '#666', fontSize: '0.7rem' }}>description</Typography>
                }
                onChange={(e, checked) => {
                  saveSettings({ ...settings, addDescription: checked })
                }}
                sx={{ m: 0 }}
              />
              <FormControlLabel
                control={
                  <Checkbox checked={addLineBreak} size="small" disableRipple sx={{ p: 0 }} />
                }
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
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default Popup
