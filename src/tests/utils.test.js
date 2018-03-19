import { base64Decode } from '../utils'

test('base64Decode', () => {
  expect(base64Decode('SGVsbG8gV29ybGQ=')).toBe('Hello World')
  expect(base64Decode(null)).toBe(null)
  expect(base64Decode(undefined)).toBe(null)
  expect(base64Decode('')).toBe('')
  expect(base64Decode(121)).toBe(null)
})
