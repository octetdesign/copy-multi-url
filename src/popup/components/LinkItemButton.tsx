import { Box, Button, darken, Tooltip } from '@mui/material'
import { LinkItem } from '../hooks/useLinkItem'
import { Icons, IconSize } from './Icons'

/** リンクアイテムボタン */
export const LinkItemButton = ({ linkItem }: { linkItem: LinkItem }) => {
  const { linkInfo } = linkItem
  const { type, color } = linkInfo.groupInfo

  return (
    <Button
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
}