import { purple } from '@mui/material/colors'
import { LinkData, LinkInfo } from '../../hooks/useLinkItem'
import { Break, DescriptionText, LinkText, Paragraph, Span, UrlText } from '../Text'
import { Settings } from '../../hooks/useSettings'
import { GroupInfo } from '../../hooks/useGroupInfo'
import { getLocalizeMessage } from '../../modules/i18n'

export const groupInfo: GroupInfo = {
  id: 'ReStructuredText2',
  type: 'ReStructuredText2',
  label: getLocalizeMessage('group_label_rest_2', 'reST 2'),
  color: purple[200],
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
  // format: '%LINK%_\n\n.. _%LINK%: %URL%',
  let text = `\`${escapeLink(link)}\`_\n\n.. _\`${escapeLink(link)}\`: ${url}`
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
      <Span>`_</Span>
      <Break />
      <Break />
      <Span>.. _`</Span>
      <LinkText>{escapeLink(link)}</LinkText>
      <Span>`:&nbsp;</Span>
      <UrlText>{url}</UrlText>
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
