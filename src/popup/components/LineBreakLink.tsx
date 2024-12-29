import { lime } from '@mui/material/colors'
import { GroupInfo, LinkData, LinkInfo } from '../getLink'
import { Break, DescriptionText, LinkText, Paragraph, UrlText } from './Text'
import { Settings } from '../Popup'

export const groupInfo: GroupInfo = {
  type: 'LineBreak',
  label: 'Line Delimited',
  color: lime[200],
}

export const linkInfoList: LinkInfo[] = [
  {
    groupInfo,
    description: false,
    getLinkText: (props) => getLinkText(props),
    template: (props) => LineBreakTextTemplate(props),
  },
  {
    groupInfo,
    description: true,
    getLinkText: (props) => getLinkText(props),
    template: (props) => LineBreakTextTemplate(props),
  },
]

/** リンクテキスト（クリップボードにコピーするテキスト）の取得 */
const getLinkText = ({ linkData, settings }: { linkData: LinkData; settings: Settings }) => {
  const { link, url, description } = linkData
  // format: '%LINK%\n%URL%\n%DESCRIPTION%',
  let text = `${link}\n${url}`
  if (settings.addDescription && description) {
    text += `\n${description}`
  }
  if (settings.addLineBreak) {
    text += '\n'
  }
  return text
}

const LineBreakTextTemplate = ({
  linkData,
  settings,
}: {
  linkData: LinkData
  settings: Settings
}) => {
  const { link, url, description } = linkData
  const { addDescription, addLineBreak } = settings
  return (
    <Paragraph>
      <LinkText>{link}</LinkText>
      <Break />
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
