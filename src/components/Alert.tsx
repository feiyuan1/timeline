import Alert, { AlertProps } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { createRoot, Root } from 'react-dom/client'

const once = function <T>(fn: () => T): () => T {
  let instance: T | null = null
  return () => {
    if (!instance) {
      instance = fn()
    }

    return instance
  }
}

const getRoot = once(() => {
  const domNode = document.getElementById('root') as HTMLElement
  const container = document.createElement('div')
  container.id = 'Alert-for-timeline'
  domNode.appendChild(container)
  return container
})

interface CustomAlertProps extends Partial<AlertProps> {
  text: string
}

const CustomAlert = ({
  unmount,
  severity,
  text
}: CustomAlertProps & { unmount: Root['unmount'] }) => {
  return (
    <Snackbar
      open={true}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={unmount}
    >
      <Alert severity={severity} sx={{ width: '100%' }}>
        {text}
      </Alert>
    </Snackbar>
  )
}

const getProps = (props: CustomAlertProps | string) => {
  if (typeof props === 'string') {
    return { text: props }
  }
  return props
}

const info = (props: CustomAlertProps | string) => {
  const container = getRoot()
  const root = createRoot(container)

  root.render(
    <CustomAlert
      unmount={root.unmount.bind(root)}
      severity="info"
      {...getProps(props)}
    />
  )
}

const success = (props: CustomAlertProps | string) => {
  const container = getRoot()
  const root = createRoot(container)
  root.render(
    <CustomAlert
      unmount={root.unmount.bind(root)}
      severity="success"
      {...getProps(props)}
    />
  )
}

const error = (props: CustomAlertProps | string) => {
  const container = getRoot()
  const root = createRoot(container)
  root.render(
    <CustomAlert
      unmount={root.unmount.bind(root)}
      severity="error"
      {...getProps(props)}
    />
  )
}

export default {
  info,
  success,
  error
}
