import { blueGrey } from '@mui/material/colors'
import { GroupInfo, LinkData, LinkInfo } from '../getLink'
import { Settings } from '../Popup'

export const groupInfo: GroupInfo = {
  type: 'PageInfo',
  label: 'Page Info',
  color: blueGrey[200],
}

export const linkInfoList: LinkInfo[] = [
  {
    groupInfo,
    description: false,
    getLinkText: (props) => getLinkText(props),
    template: (props) => PageInfoTemplate(props),
  },
  {
    groupInfo,
    description: true,
    getLinkText: (props) => getLinkText(props),
    template: (props) => PageInfoTemplate(props),
  },
]

/** リンクテキスト（クリップボードにコピーするテキスト）の取得 */
const getLinkText = ({ linkData, settings }: { linkData: LinkData; settings: Settings }) => {
  const { pageData } = linkData
  const lines: string[] = []
  const add = (value: string | undefined, label: string) => {
    if (value !== undefined) {
      lines.push(`${label}\t${value.replaceAll('\t', '\\t').replaceAll('\n', '\\n')}`)
    }
  }
  add(pageData.title, 'title')
  add(pageData.url, 'url')
  add(pageData.description, 'description')
  add(pageData.author, 'author')
  add(pageData.keywords, 'keywords')
  add(pageData.og?.title, 'og:title')
  add(pageData.og?.url, 'og:url')
  add(pageData.og?.description, 'og:description')
  add(pageData.og?.siteName, 'og:site_name')
  add(pageData.og?.type, 'og:type')
  let text = lines.join('\n')
  if (settings.addLineBreak) {
    text += '\n'
  }
  return text
}

const PageInfoTemplate = ({ linkData, settings }: { linkData: LinkData; settings: Settings }) => {
  const { pageData } = linkData
  const Info = ({ label, value }: { label: string; value?: string }) => {
    if (value === undefined) return undefined
    const cellStyle = {
      color: 'rgba(0, 0, 0, 0.9)',
      fontWeight: 'normal',
      borderBottom: 'solid 1px #ddd',
      padding: '2px 4px',
    }
    return (
      <tr style={{}}>
        <th style={{ ...cellStyle, color: 'rgba(0, 0, 0, 0.5)' }}>{label}</th>
        <td style={{ ...cellStyle, wordBreak: 'break-all' }}>{value}</td>
      </tr>
    )
  }
  return (
    <table style={{ borderCollapse: 'collapse' }}>
      <tbody>
        <Info value={pageData.title} label="title" />
        <Info value={pageData.url} label="url" />
        <Info value={pageData.description} label="description" />
        <Info value={pageData.author} label="author" />
        <Info value={pageData.keywords} label="keywords" />
        <Info value={pageData.og?.title} label="og:title" />
        <Info value={pageData.og?.url} label="og:url" />
        <Info value={pageData.og?.description} label="og:description" />
        <Info value={pageData.og?.siteName} label="og:site_name" />
        <Info value={pageData.og?.type} label="og:type" />
      </tbody>
    </table>
  )
}
