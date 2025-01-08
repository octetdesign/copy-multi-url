// import LineBreakIcon from '@mui/icons-material/KeyboardReturn'
import LineBreakIcon from '@mui/icons-material/SubdirectoryArrowLeft'
import { MarkdownIcon } from './icon/MarkdownIcon'
import HtmlIcon from '@mui/icons-material/Code'
// import HtmlIcon from '@mui/icons-material/Html'
import { WikiIcon } from './icon/WikiIcon'
// import TextileIcon from '@mui/icons-material/FormatQuote'
import TextileIcon from '@mui/icons-material/TextFields'
import { ReStructuredTextIcon } from './icon/ReStructuredTextIcon'
import PageInfoIcon from '@mui/icons-material/Article'
import TabIcon from '@mui/icons-material/KeyboardTab'
import { SxProps } from '@mui/material'

/** アイコンのサイズ */
export const IconSize = { width: '24px', height: '24px' }
/** アイコンに設定するsxの値 */
const IconSx: SxProps = { ...IconSize, color: '#000' }

/** リンクタイプに応じたアイコン */
export const Icons = {
  LineBreak: <LineBreakIcon sx={IconSx} />,
  Markdown1: <MarkdownIcon sx={IconSx} />,
  Markdown2: <MarkdownIcon sx={IconSx} />,
  Html: <HtmlIcon sx={IconSx} />,
  Wiki: <WikiIcon sx={IconSx} />,
  Textile: <TextileIcon sx={IconSx} />,
  ReStructuredText1: <ReStructuredTextIcon sx={IconSx} />,
  ReStructuredText2: <ReStructuredTextIcon sx={IconSx} />,
  Tab: <TabIcon sx={IconSx} />,
  PageInfo: <PageInfoIcon sx={IconSx} />,
}
