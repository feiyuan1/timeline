import { FC, PropsWithChildren } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import '../index.css'

/**
 * support:
 * 1. fixed height(100vh)
 * 2. scroll
 * 3. relative
 */
const PageContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <Container sx={{ overflow: 'auto', height: '100%' }}>
        {children}
      </Container>
    </Box>
  )
}

export default PageContainer
