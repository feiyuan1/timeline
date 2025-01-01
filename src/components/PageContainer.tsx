import { FC, PropsWithChildren } from 'react'
import Container, { ContainerProps } from '@mui/material/Container'
import Box from '@mui/material/Box'
import '../index.css'

interface CustomContainerProps {
  container?: ContainerProps['sx']
}
/**
 * support:
 * 1. fixed height(100vh)
 * 2. scroll
 * 3. relative
 * 4. custom container style
 */
const PageContainer: FC<PropsWithChildren<CustomContainerProps>> = ({
  children,
  container
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <Container sx={{ overflow: 'auto', height: '100%', ...container }}>
        {children}
      </Container>
    </Box>
  )
}

export default PageContainer
