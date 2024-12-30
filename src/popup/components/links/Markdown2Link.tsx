import { blue } from '@mui/material/colors'
import { LinkData, LinkInfo } from '../../hooks/useLinkItem'
import { Break, DescriptionText, LinkText, Paragraph, Span, TitleText, UrlText } from '../Text'
import { Settings } from '../../hooks/useSettings'
import { GroupInfo } from '../../hooks/useGroupInfo'

export const groupInfo: GroupInfo = {
  id: 'Markdown2',
  type: 'Markdown2',
  label: 'Markdown2',
  color: blue[200],
}

export const linkInfoList: LinkInfo[] = [
  {
    groupInfo,
    description: false,
    getLinkText: (props) => getLinkText(props),
    buttonText: (props) => ButtonText(props),
  },
  {
    groupInfo,
    description: true,
    getLinkText: (props) => getLinkText(props),
    buttonText: (props) => ButtonText(props),
  },
]

const escapeLink = (link: string) => link.replaceAll('[', '\\[').replaceAll(']', '\\]')

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

/** リンクアイテムボタンに表示するテキストのコンポーネント */
const ButtonText = ({ linkData, settings }: { linkData: LinkData; settings: Settings }) => {
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
