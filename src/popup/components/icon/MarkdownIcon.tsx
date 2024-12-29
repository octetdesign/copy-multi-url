import { SvgIcon, SvgIconProps } from '@mui/material'

// ファイル:Markdown-mark.svg - Wikipedia
// https://ja.m.wikipedia.org/wiki/%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB:Markdown-mark.svg
export const MarkdownIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" width="208" height="128" viewBox="0 0 208 128">
        <rect
          width="198"
          height="118"
          x="5"
          y="5"
          ry="10"
          stroke="#000"
          strokeWidth="10"
          fill="none"
        />
        <path
          d="M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39zm125 0l-30-33h20V30h20v35h20z"
          fill="#000"
        />
      </svg>
    </SvgIcon>
  )
}
