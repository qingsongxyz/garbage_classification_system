import { customAlphabet } from 'nanoid';

/**
 * 生成指定位数的纯数字id
 * @param size 位数
 * @returns id
 */
export function getNumberNanoid(size: number = 12) {
    const nanoid = customAlphabet('1234567890', size);
    return nanoid();
}