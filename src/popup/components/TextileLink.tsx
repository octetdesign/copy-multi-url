import { brown } from '@mui/material/colors'
import { GroupInfo, LinkData, LinkInfo } from '../getLink'
import { Break, DescriptionText, LinkText, Paragraph, Span, TitleText, UrlText } from './Text'
import { Settings } from '../Popup'

export const groupInfo: GroupInfo = {
  type: 'Textile',
  label: 'Textile',
  color: brown[200],
}

const escapeLink = (link: string) => link.replaceAll('"', '\\"')

export const linkInfoList: LinkInfo[] = [
  {
    groupInfo,
    description: false,
    getLinkText: (props) => getLinkText(props),
    template: (props) => TextileTemplate(props),
  },
  {
    groupInfo,
    description: true,
    getLinkText: (props) => getLinkText(props),
    template: (props) => TextileTemplate(props),
  },
]

/** リンクテキスト（クリップボードにコピーするテキスト）の取得 */
const getLinkText = ({ linkData, settings }: { linkData: LinkData; settings: Settings }) => {
  const { link, url, description } = linkData
  // format: '"%LINK%":%URL%\n%DESCRIPTION%',
  let text = `"${escapeLink(link)}":${url}`
  if (settings.addDescription && description) {
    text += `\n${description}`
  }
  if (settings.addLineBreak) {
    text += '\n'
  }
  return text
}

const TextileTemplate = ({ linkData, settings }: { linkData: LinkData; settings: Settings }) => {
  const { link, url, description } = linkData
  const { addDescription, addLineBreak } = settings
  return (
    <Paragraph>
      <Span>"</Span>
      <LinkText>{escapeLink(link)}</LinkText>
      <Span>":</Span>
      <UrlText>{url}</UrlText>
      {addDescription && description && (
        <>
          <Break />
          <DescriptionText>{description}</DescriptionText>
        </>
      )}
      {addLineBreak && <Break />}
    </Paragraph>
  )
}
