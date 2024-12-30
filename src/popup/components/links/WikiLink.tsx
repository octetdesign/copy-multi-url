import { orange } from '@mui/material/colors'
import { LinkData, LinkInfo } from '../../hooks/useLinkItem'
import { Break, DescriptionText, LinkText, Paragraph, Span, TitleText, UrlText } from '../Text'
import { Settings } from '../../hooks/useSettings'
import { GroupInfo } from '../../hooks/useGroupInfo'
import { getLocalizeMessage } from '../../modules/i18n'

export const groupInfo: GroupInfo = {
  id: 'Wiki',
  type: 'Wiki',
  label: getLocalizeMessage('group_label_wiki', 'Wiki'),
  color: orange[200],
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

const escapeLink = (link: string) => link.replaceAll('[', '&#91;').replaceAll(']', '&#93;')

/** リンクテキスト（クリップボードにコピーするテキスト）の取得 */
const getLinkText = ({ linkData, settings }: { linkData: LinkData; settings: Settings }) => {
  const { link, url, description } = linkData
  // format: '[%URL% %LINK%]\n%DESCRIPTION%',
  let text = `[${url} ${escapeLink(link)}]`
  if (settings.addDescription && description) {
    text += `\n${description}`
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
      <Span>[</Span>
      <UrlText>{url}</UrlText>
      &nbsp;
      <LinkText>{escapeLink(link)}</LinkText>
      <Span>]</Span>
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
