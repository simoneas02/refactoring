import { Province, sampleProvinceData } from './province.js'

describe('province', () => {
  it('shortfall ', () => {
    const asia = new Province(sampleProvinceData())

    expect(asia.shortfall).toBe(5)
  })
})
