import { createLocalVue } from '@vue/test-utils'
import FeeCalculator from '@/components/FeeCalculator'
import * as treeHelper from '@/modules/Tree'

describe('FeeCalculator.vue', () => {
  let localVue, Constructor, vm

  beforeEach(() => {
    localVue = createLocalVue()
    Constructor = localVue.extend(FeeCalculator)
    vm = new Constructor().$mount()
  })

  it('check form for month', () => {
    vm.rentAmount = 50000
    vm.rentPeriod = 'month'
    vm.validateForm()
    expect(vm.error).toBeTruthy()
  })
  it('check rent amount range', () => {
    vm.rentPeriod = 'month'
    vm.rentAmount = 5000
    expect(vm.amount).toBe(5000)
    vm.rentAmount = 9000
    expect(vm.amount).toBe(8660)
    vm.rentAmount = 0
    expect(vm.amount).toBe(0)
    vm.rentAmount = 5
    vm.rentPeriod = 'week'
    expect(vm.amount).toBe(25)
    vm.rentAmount = 120
    expect(vm.amount).toBe(120)
    vm.rentAmount = 2001
    expect(vm.amount).toBe(2000)
  })

  it('check form for month', () => {
    vm.rentAmount = 5
    vm.rentPeriod = 'month'
    vm.validateForm()
    expect(vm.error).not.toBeFalsy()
    expect(vm.error).toBe('Your monthly rent has to be between ' + vm.monthRage.min + ' & ' + vm.monthRage.max)
  })

  it('check form for week', () => {
    vm.rentAmount = 100
    vm.rentPeriod = 'week'
    vm.validateForm()
    expect(vm.error).toBeFalsy()
    expect(vm.error).not.toBe('Your weekly rent has to be between ' + vm.weekRage.min + ' & ' + vm.weekRage.max)
  })

  it('check fixed amount', () => {
    expect(vm.findFixedFee('branch_a')).toBe(45000)
    expect(vm.findFixedFee('branch_e')).toBe(0)
    expect(vm.findFixedFee('branch_k')).toBe(25000)
  })
  it('check week amount', () => {
    vm.weekRage = {min: 5, max: 10}
    vm.rentPeriod = 'week'
    vm.rentAmount = 0
    expect(vm.amount).toBe(0)
    vm.rentAmount = 10000
    expect(vm.amount).toBe(10)
    vm.rentAmount = 3
    expect(vm.amount).toBe(5)
    vm.rentAmount = 7
    expect(vm.amount).toBe(7)
  })
  it('check month amount', () => {
    vm.monthRage = {min: 10, max: 100}
    vm.rentPeriod = 'month'
    vm.rentAmount = 0
    expect(vm.amount).toBe(0)
    vm.rentAmount = 10000
    expect(vm.amount).toBe(100)
    vm.rentAmount = 3
    expect(vm.amount).toBe(10)
    vm.rentAmount = 17
    expect(vm.amount).toBe(17)
  })

  it('check rent', () => {
    const vat = 1.2
    vm.rentPeriod = 'month'
    vm.rentAmount = 800
    vm.branch = null
    expect(vm.membershipFee).toBe(222)
    vm.branch = treeHelper.findNodeByName('branch_e', vm.organisation)
    expect(vm.membershipFee).toBe(222)
    vm.branch = treeHelper.findNodeByName('branch_a', vm.organisation)
    expect(vm.membershipFee).toBe(450 * vat)
    vm.branch = treeHelper.findNodeByName('branch_k', vm.organisation)
    expect(vm.membershipFee).toBe(250 * vat)
  })
})
