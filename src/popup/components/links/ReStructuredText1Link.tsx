import { deepPurple } from '@mui/material/colors'
import { LinkData, LinkInfo } from '../../hooks/useLinkItem'
import { Break, DescriptionText, LinkText, Paragraph, Span, UrlText } from '../Text'
import { Settings } from '../../hooks/useSettings'
import { GroupInfo } from '../../hooks/useGroupInfo'
import { getLocalizeMessage } from '../../modules/i18n'

export const groupInfo: GroupInfo = {
  id: 'ReStructuredText1',
  type: 'ReStructuredText1',
  label: getLocalizeMessage('group_label_rest_1', 'reST 1'),
  color: deepPurple[200],
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

const escapeLink = (link: string) => link.replaceAll('`', '\\`')

/** リンクテキスト（クリップボードにコピーするテキスト）の取得 */
const getLinkText = ({ linkData, settings }: { linkData: LinkData; settings: Settings }) => {
  const { link, url, description } = linkData
  // format: '`%LINK% <%URL%>`__',
  let text = `\`${escapeLink(link)} <${url}>\`__`
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
      <Span>`</Span>
      <LinkText>{escapeLink(link)}</LinkText>
      <Span>&nbsp;&lt;</Span>
      <UrlText>{url}</UrlText>
      <Span>&gt;`__</Span>
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
