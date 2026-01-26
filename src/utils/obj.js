/**
 * 根据路径字符串，从对象中安全地获取嵌套属性的值
 *
 * @param {Object} obj - 要查找的目标对象
 * @param {string} path - 属性路径，支持点号和数组下标（如 "a.b.c" 或 "a.b[0].c"）
 * @returns {*} - 返回对应的值，如果路径不存在则返回 undefined
 *
 * @example
 * const data = { user: { profile: { name: 'Alice' } } }
 * getValueByPath(data, 'user.profile.name') // 'Alice'
 *
 * const arrData = { list: [ { id: 1 }, { id: 2 } ] }
 * getValueByPath(arrData, 'list[1].id') // 2
 *
 * // 不存在的路径
 * getValueByPath(data, 'user.address.city') // undefined
 */
export function getValueByPath(obj, path) {
  // 如果目标对象不存在 或 路径不是有效字符串，直接返回 undefined
  if (!obj || !path) return undefined

  // 将数组下标形式 [0] 转换为点号形式 .0
  // 这样 "a[0].b" 会变成 "a.0.b"，方便用 split('.') 拆分
  const normalizedPath = path.replace(/\[(\w+)\]/g, '.$1')

  // 使用 reduce 逐层访问对象属性
  // 初始值为 obj，每次迭代 acc 会变成当前属性的值
  return normalizedPath.split('.').reduce((acc, key) => {
    // 如果 acc 为 null/undefined，直接返回 undefined（避免报错）
    return acc ? acc[key] : undefined
  }, obj)
}
