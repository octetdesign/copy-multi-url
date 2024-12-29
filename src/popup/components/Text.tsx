import { ReactNode } from 'react'
import { SxProps, Typography } from '@mui/material'
import BreakIcon from '@mui/icons-material/SubdirectoryArrowLeft'
// import TabIcon from '@mui/icons-material/KeyboardTab'
import TabIcon from '@mui/icons-material/East'

const TextSx: SxProps = {
  color: 'rgba(0, 0, 0, 0.33)',
  fontSize: 'inherit',
  fontFamily: 'inherit',
}

export const Paragraph = ({ children, sx }: { children: ReactNode; sx?: SxProps }) => (
  <Typography
    component="p"
    sx={{
      fontSize: '0.8rem',
      fontFamily: 'system-ui',
      wordBreak: 'break-all',
      lineHeight: '1.1',
      ...sx,
    }}
  >
    {children}
  </Typography>
)

export const Span = ({ children, sx }: { children: ReactNode; sx?: SxProps }) => (
  <Typography component="span" sx={{ ...TextSx, ...sx }}>
    {children}
  </Typography>
)

export const LinkText = ({ children }: { children: ReactNode }) => (
  <Span sx={{ color: 'rgba(0, 0, 0, 1)' }}>{children}</Span>
)
export const UrlText = ({ children }: { children: ReactNode }) => (
  <Span sx={{ color: '#1976e1' }}>{children}</Span>
)
export const DescriptionText = ({ children }: { children: ReactNode }) => (
  <Span sx={{ color: 'rgba(0, 0, 0, 0.66)' }}>{children}</Span>
)
export const TitleText = ({ children }: { children: ReactNode }) => (
  <Span sx={{ color: 'rgba(0, 0, 0, 0.66)' }}>{children}</Span>
)

const IconSx: SxProps = {
  color: 'rgba(0, 0, 0, 0.33)',
  fontSize: 'inherit',
  verticalAlign: 'middle',
  mx: 0.1,
  mt: -0.3,
}

export const Break = () => (
  <>
    <BreakIcon sx={IconSx} />
    <Span>{'\n'}</Span>
  </>
)
export const Tab = () => (
  <>
    <TabIcon sx={IconSx} />
    <Span>{'\t'}</Span>
  </>
)
