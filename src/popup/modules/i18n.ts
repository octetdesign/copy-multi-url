/**
 * ローカライズされたメッセージを取得する
 *
 * @param key メッセージのキー
 * @param defaultMessage メッセージが取得できなかった場合に返すメッセージ
 * */
export const getLocalizeMessage = (key: string, defaultMessage: string) => {
  const message = chrome.i18n.getMessage(key)
  return message ? message : defaultMessage
}
