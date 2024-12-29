import { green } from '@mui/material/colors'
import { GroupInfo, LinkData, LinkInfo } from '../getLink'
import { DescriptionText, LinkText, Paragraph, UrlText, Tab, Break } from './Text'
import { Settings } from '../Popup'

export const groupInfo: GroupInfo = {
  type: 'Tab',
  label: 'Tab Delimited',
  color: green[200],
}

const escapeChars = (str: string) => str.replaceAll('\t', '\\t').replaceAll('\n', '\\n')

export const linkInfoList: LinkInfo[] = [
  {
    groupInfo,
    description: false,
    getLinkText: (props) => getLinkText(props),
    template: (props) => TabTextTemplate(props),
  },
  {
    groupInfo,
    description: true,
    getLinkText: (props) => getLinkText(props),
    template: (props) => TabTextTemplate(props),
  },
]

/** リンクテキスト（クリップボードにコピーするテキスト）の取得 */
const getLinkText = ({ linkData, settings }: { linkData: LinkData; settings: Settings }) => {
  const { link, url, description } = linkData
  // format: '%LINK%\t%URL%\t%DESCRIPTION%',
  let text = `${escapeChars(link)}\t${escapeChars(url)}`
  if (settings.addDescription && description) {
    text += `\t${escapeChars(description)}`
  }
  if (settings.addLineBreak) {
    text += '\n'
  }
  return text
}

const TabTextTemplate = ({ linkData, settings }: { linkData: LinkData; settings: Settings }) => {
  const { link, url, description } = linkData
  const { addDescription, addLineBreak } = settings
  return (
    <Paragraph>
      <LinkText>{escapeChars(link)}</LinkText>
      <Tab />
      <UrlText>{url}</UrlText>
      {addDescription && description && (
        <>
          <Tab />
          <DescriptionText>{escapeChars(description)}</DescriptionText>
        </>
      )}
      {addLineBreak && <Break />}
    </Paragraph>
  )
}
