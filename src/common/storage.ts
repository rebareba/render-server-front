import nattyStorage from 'natty-storage'

const storage = nattyStorage({
  type: 'localStorage', // 缓存方式, 默认为'localStorage'
  key: 'render-server', // !!! 唯一必选的参数, 用于内部存储 !!!
  tag: 'v1.0', // 缓存的标记, 用于判断是否有效
  duration: 1000 * 60 * 60 * 24 * 7, // 缓存的有效期长, 以毫秒数指定
})

export default storage
