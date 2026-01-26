/**
 * 生成一个随机整数
 * @param {number} [min=1] 最小值（包含）
 * @param {number} [max=100] 最大值（包含）
 * @returns {number} 随机整数
 */
export function random(min = 1, max = 100) {
  if (min > max) [min, max] = [max, min]; // 如果 min > max 自动交换
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成某一年的 1~12 月份对象数组
 * @param {number} year - 年份（如 2025）
 * @param {function} [appends] - 可选函数，参数是当前索引（0~11）和当前对象，返回要合并的对象
 * @returns {Array<{current: string, previous: string, next: string}>}
 */
export function generateYearMonths(year, appends) {
  const months = [];
  for (let i = 1; i <= 12; i++) {
    const current = `${year}-${String(i).padStart(2, '0')}`;
    const previous = `${year - 1}-${String(i).padStart(2, '0')}`;
    const next = `${year + 1}-${String(i).padStart(2, '0')}`;

    let obj = { current, previous, next };

    if (typeof appends === 'function') {
      Object.assign(obj, appends(i - 1, obj) || {});
    }

    months.push(obj);
  }
  return months;
}

/**
 * 生成某一个月的所有天数对象数组
 * @param {string} month - 格式 "YYYY-MM"（如 "2025-02"）
 * @param {function} [appends] - 可选函数，参数是当前索引（0~天数-1）和当前对象，返回要合并的对象
 * @returns {Array<{current: string, previous: string, next: string}>}
 */
export function generateMonthDays(month, appends) {
  const [year, monthNum] = month.split('-').map(Number);
  const daysInMonth = new Date(year, monthNum, 0).getDate();

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const current = `${year}-${String(monthNum).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const previous = `${year - 1}-${String(monthNum).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const next = `${year + 1}-${String(monthNum).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

    let obj = { current, previous, next };

    if (typeof appends === 'function') {
      Object.assign(obj, appends(i - 1, obj) || {});
    }

    days.push(obj);
  }
  return days;
}
