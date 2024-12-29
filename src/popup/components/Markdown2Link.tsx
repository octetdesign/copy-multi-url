import { blue } from '@mui/material/colors'
import { GroupInfo, LinkData, LinkInfo } from '../getLink'
import { Break, DescriptionText, LinkText, Paragraph, Span, TitleText, UrlText } from './Text'
import { Settings } from '../Popup'

export const groupInfo: GroupInfo = {
  type: 'Markdown2',
  label: 'Markdown2',
  color: blue[200],
}

const escapeLink = (link: string) => link.replaceAll('[', '\\[').replaceAll(']', '\\]')

export const linkInfoList: LinkInfo[] = [
  {
    groupInfo,
    description: false,
    getLinkText: (props) => getLinkText(props),
    template: (props) => Markdown2Template(props),
  },
  {
    groupInfo,
    description: true,
    getLinkText: (props) => getLinkText(props),
    template: (props) => Markdown2Template(props),
  },
]

/** リンクテキスト（クリップボードにコピーするテキスト）の取得 */
const getLinkText = ({ linkData, settings }: { linkData: LinkData; settings: Settings }) => {
  const { link, url, description } = linkData
  //format: '[id]: %URL%\n[%LINK%][id]\n\n%DESCRIPTION%',
  let text = `[id]: ${url}\n[${escapeLink(link)}][id]`
  if (settings.addDescription && description) {
    text += `\n\n${description}`
  }
  if (settings.addLineBreak) {
    text += '\n'
  }
  return text
}

const Markdown2Template = ({ linkData, settings }: { linkData: LinkData; settings: Settings }) => {
  const { link, url, description } = linkData
  const { addDescription, addLineBreak } = settings
  return (
    <Paragraph>
      <Span>{'[id]: '}</Span>
      <UrlText>{url}</UrlText>
      <br />
      <Span>[</Span>
      <LinkText>{escapeLink(link)}</LinkText>
      <Span>]</Span>
      <Span>[id]</Span>
      {addDescription && description && (
        <>
          <Break />
          <Break />
          <DescriptionText>{description}</DescriptionText>
        </>
      )}
      {addLineBreak && <Break />}
    </Paragraph>
  )
}
