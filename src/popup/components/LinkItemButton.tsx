import { Box, Button, darken } from '@mui/material'
import { LinkItem } from '../hooks/useLinkItem'
import { Icons, IconSize } from './Icons'
import { getLocalizeMessage } from '../modules/i18n'

/** リンクアイテムボタン */
export const LinkItemButton = ({ linkItem }: { linkItem: LinkItem }) => {
  const { linkInfo, text, buttonText } = linkItem
  const { type, color, label } = linkInfo.groupInfo

  return (
    <Button
      fullWidth
      onClick={async () => {
        // クリップボードにコピー
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
      <Box title={label} style={{ ...IconSize, opacity: 0.5 }}>
        {Icons[type]}
      </Box>
      {/* リンク文字列のプレビュー */}
      <Box
        title={getLocalizeMessage('link_item_button_tooltip', 'Click to copy to clipboard.')}
        sx={{
          fontFamily: 'system-ui',
          fontSize: '0.8rem',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 1,
          p: 1,
        }}
      >
        {buttonText}
      </Box>
    </Button>
  )
}
