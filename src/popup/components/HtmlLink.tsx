import { pink } from '@mui/material/colors'
import { GroupInfo, LinkData, LinkInfo } from '../getLink'
import { Break, DescriptionText, LinkText, Paragraph, Span, TitleText, UrlText } from './Text'
import { Settings } from '../Popup'

export const groupInfo: GroupInfo = {
  id: 'Html',
  type: 'Html',
  label: 'HTML',
  color: pink[200],
}
const escapeHtml = (str: string) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replaceAll('\n', '<br>')
}

export const linkInfoList: LinkInfo[] = [
  {
    groupInfo,
    description: false,
    getLinkText: (props) => getLinkText(props),
    template: (props) => HtmlTemplate(props),
    // escape: { link: escapeHtml },
  },
  {
    groupInfo,
    description: true,
    getLinkText: (props) => getLinkText(props),
    template: (props) => HtmlTemplate(props),
    // escape: { link: escapeHtml, description: escapeHtml },
  },
]

/** リンクテキスト（クリップボードにコピーするテキスト）の取得 */
const getLinkText = ({ linkData, settings }: { linkData: LinkData; settings: Settings }) => {
  const { link, url, description } = linkData
  // format: '<a href="%URL%">%LINK%</a>\n<p>%DESCRIPTION%</p>',
  let text = `<a href="${url}">${escapeHtml(link)}</a>`
  if (settings.addDescription && description) {
    text += `\n<p>${escapeHtml(description)}</p>`
  }
  if (settings.addLineBreak) {
    text += '\n'
  }
  return text
}

const HtmlTemplate = ({ linkData, settings }: { linkData: LinkData; settings: Settings }) => {
  const { link, url, description } = linkData
  const { addDescription, addLineBreak } = settings
  return (
    <Paragraph>
      <Span>{'<a href="'}</Span>
      <UrlText>{url}</UrlText>
      <Span>{'">'}</Span>
      <LinkText>{escapeHtml(link)}</LinkText>
      <Span>{'</a>'}</Span>
      {addDescription && description && (
        <>
          <Break />
          <Span>{'<p>'}</Span>
          <DescriptionText>{escapeHtml(description)}</DescriptionText>
          <Span>{'</p>'}</Span>
        </>
      )}
      {addLineBreak && <Break />}
    </Paragraph>
  )
}
