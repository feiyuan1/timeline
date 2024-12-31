import { createRoot } from 'react-dom/client'
import Alert, { AlertProps } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

interface CustomAlertProps {
  message: Message
  onClose: (key: number) => void
}

interface Message extends Partial<AlertProps> {
  key: number
  text: string
}
type CustomAlertMessage = Omit<Message, 'key'> | string

const once = function <T>(fn: () => T): () => T {
  let instance: T | null = null
  return () => {
    if (!instance) {
      instance = fn()
    }

    return instance
  }
}

const getMessageManager = once(() => {
  const domNode = document.getElementById('root') as HTMLElement
  const container = document.createElement('div')
  container.id = 'Alert-for-timeline'
  domNode.appendChild(container)
  const root = createRoot(container)
  const messages: { current: Message[] } = { current: [] }
  const update = (newMessages: Message[]) => {
    messages.current = newMessages
    render()
  }
  const addMsg = (message: Message) => {
    update(messages.current.concat(message))
  }
  const deleteMsg = (key: number) => {
    update(messages.current.filter((msg) => msg.key !== key))
  }
  const render = () =>
    root.render(
      messages.current.map((msg) => (
        <CustomAlert message={msg} onClose={deleteMsg} key={msg.key} />
      ))
    )
  return { render, update, messages, addMsg }
})

const CustomAlert = ({
  message: { severity, text, key },
  onClose
}: CustomAlertProps) => {
  return (
    <Snackbar
      open={true}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={() => {
        onClose(key)
      }}
      key={key}
    >
      <Alert severity={severity} sx={{ width: '100%' }}>
        {text}
      </Alert>
    </Snackbar>
  )
}

const getProps = (props: CustomAlertMessage) => {
  if (typeof props === 'string') {
    return { text: props }
  }
  return props
}

const generalAlert = (
  props: CustomAlertMessage,
  natural?: Partial<AlertProps>
) => {
  const { addMsg } = getMessageManager()
  addMsg({ ...getProps(props), ...natural, key: Date.now() })
}

const info = (props: CustomAlertMessage) => {
  generalAlert(props, { severity: 'info' })
}

const error = (props: CustomAlertMessage) => {
  generalAlert(props, { severity: 'error' })
}

export default {
  info,
  success: generalAlert,
  error
}
