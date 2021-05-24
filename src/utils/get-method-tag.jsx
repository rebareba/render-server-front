import {Tag} from 'antd'

const getMethodTag = (method = 'GET') => {
  let color = ''
  switch (method) {
    case 'GET':
      color = 'blue'
      break
    case 'POST':
      color = 'green'
      break
    case 'PUT':
      color = 'orange'
      break
    case 'DELETE':
      color = 'red'
      break
    default:
      break
  }
  return <Tag color={color}>{method}</Tag>
}

export default getMethodTag
