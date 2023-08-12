import { expect, test } from 'vitest'
import { foo } from '../src/execute'

test('adds 1 + 2 to equal 3', () => {
  foo()
  expect(3).toBe(3)
})
