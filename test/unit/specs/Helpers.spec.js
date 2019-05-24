import * as helpers from '@/services/Helpers'

describe('Helpers.js', () => {
  it('between', () => {
    expect(helpers.between(5, 10, 20)).toBeFalsy()
    expect(helpers.between(15, 10, 20)).toBeTruthy()
  })
})
