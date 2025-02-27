import { cyan } from '@mui/material/colors'
import { LinkData, LinkInfo } from '../../hooks/useLinkItem'
import { Break, DescriptionText, LinkText, Paragraph, Span, UrlText } from '../Text'
import { Settings } from '../../hooks/useSettings'
import { GroupInfo } from '../../hooks/useGroupInfo'
import { getLocalizeMessage } from '../../modules/i18n'

export const groupInfo: GroupInfo = {
  id: 'Markdown1',
  type: 'Markdown1',
  label: getLocalizeMessage('group_label_markdown_1', 'Markdown 1'),
  color: cyan[200],
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
const escapeUrl = (url: string) => url.replaceAll('(', '\\(').replaceAll(')', '\\)')

/** リンクテキスト（クリップボードにコピーするテキスト）の取得 */
const getLinkText = ({ linkData, settings }: { linkData: LinkData; settings: Settings }) => {
  const { link, url, description } = linkData
  // format: '[%LINK%](%URL%)\n\n%DESCRIPTION%',
  let text = `[${escapeLink(link)}](${escapeUrl(url)})`
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
      <Span>[</Span>
      <LinkText>{escapeLink(link)}</LinkText>
      <Span>]</Span>
      <Span>(</Span>
      <UrlText>{escapeUrl(url)}</UrlText>
      <Span>)</Span>
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
