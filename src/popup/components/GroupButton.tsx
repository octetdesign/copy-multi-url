import { Button, Stack, Typography } from '@mui/material'
import { UniqueIdentifier } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface GroupButtonProps {
  id: UniqueIdentifier
  icon: React.ReactNode
  label: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
  enabled: boolean
  foreColor: string
  backColor: string
}

export const GroupButton = (props: GroupButtonProps) => {
  const { icon, label, onClick, enabled, foreColor, backColor } = props

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Button
      ref={setNodeRef}
      {...attributes}
      onClick={onClick}
      fullWidth
      style={style}
      sx={{
        color: foreColor,
        backgroundColor: backColor,
        borderRadius: 0,
        px: 0,
        py: 0.5,
      }}
    >
      <Stack sx={{ alignItems: 'center' }} {...listeners}>
        <div style={{ opacity: enabled ? 0.5 : 0.2 }}>{icon}</div>
        <Typography
          component="p"
          sx={{
            color: foreColor,
            fontSize: '0.6rem',
            textTransform: 'none',
            ml: 0.5,
          }}
        >
          {label}
        </Typography>
      </Stack>
    </Button>
  )
}
