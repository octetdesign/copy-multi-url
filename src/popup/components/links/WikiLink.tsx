import { orange } from '@mui/material/colors'
import { LinkData, LinkInfo } from '../../hooks/useLinkItem'
import { Break, DescriptionText, LinkText, Paragraph, Span, TitleText, UrlText } from '../Text'
import { Settings } from '../../hooks/useSettings'
import { GroupInfo } from '../../hooks/useGroupInfo'

export const groupInfo: GroupInfo = {
  id: 'Wiki',
  type: 'Wiki',
  label: 'Wiki',
  color: orange[200],
}

const escapeLink = (link: string) => link.replaceAll('[', '&#91;').replaceAll(']', '&#93;')

export const linkInfoList: LinkInfo[] = [
  {
    groupInfo,
    description: false,
    getLinkText: (props) => getLinkText(props),
    template: (props) => WikiTemplate(props),
  },
  {
    groupInfo,
    description: true,
    getLinkText: (props) => getLinkText(props),
    template: (props) => WikiTemplate(props),
  },
]

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

const WikiTemplate = ({ linkData, settings }: { linkData: LinkData; settings: Settings }) => {
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
