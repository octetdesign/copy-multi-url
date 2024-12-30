import { green } from '@mui/material/colors'
import { LinkData, LinkInfo } from '../../hooks/useLinkItem'
import { DescriptionText, LinkText, Paragraph, UrlText, Tab, Break } from '../Text'
import { Settings } from '../../hooks/useSettings'
import { GroupInfo } from '../../hooks/useGroupInfo'
import { getLocalizeMessage } from '../../modules/i18n'

export const groupInfo: GroupInfo = {
  id: 'Tab',
  type: 'Tab',
  label: getLocalizeMessage('group_label_tab', 'Tab Delimited'),
  color: green[200],
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

const escapeChars = (str: string) => str.replaceAll('\t', '\\t').replaceAll('\n', '\\n')

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

/** リンクアイテムボタンに表示するテキストのコンポーネント */
const ButtonText = ({ linkData, settings }: { linkData: LinkData; settings: Settings }) => {
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
