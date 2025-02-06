const DEBUG = process.env.NODE_ENV === 'development'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogData {
  functionName: string
  action?: string
  data?: any
  error?: any
}

export const logger = {
  debug: (data: LogData) => {
    if (DEBUG) {
      console.debug(`[${data.functionName}]${data.action ? ` - ${data.action}` : ''}`, data.data || '')
    }
  },
  
  info: (data: LogData) => {
    console.info(`[${data.functionName}]${data.action ? ` - ${data.action}` : ''}`, data.data || '')
  },
  
  warn: (data: LogData) => {
    console.warn(`[${data.functionName}]${data.action ? ` - ${data.action}` : ''}`, data.data || '')
  },
  
  error: (data: LogData) => {
    console.error(
      `[${data.functionName}]${data.action ? ` - ${data.action}` : ''} ERROR:`,
      data.error?.message || data.error || '',
      '\nStack:',
      data.error?.stack || '',
      '\nData:',
      data.data || ''
    )
  }
}

export const logOperation = async <T>(
  functionName: string,
  operation: () => Promise<T>,
  actionName?: string
): Promise<T> => {
  try {
    logger.debug({ functionName, action: `${actionName || 'Started'}` })
    const result = await operation()
    logger.debug({ 
      functionName, 
      action: `${actionName || 'Completed'}`,
      data: DEBUG ? result : undefined
    })
    return result
  } catch (error) {
    logger.error({ 
      functionName, 
      action: actionName,
      error,
    })
    throw error
  }
} 