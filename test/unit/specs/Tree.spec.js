import * as treeHelper from '@/services/Tree'

describe('TreeHelper.js', () => {
  it('check tree', () => {
    expect(() => {
      treeHelper.createTree(null)
    }).toThrow()
  })
  it('find branch', () => {
    const client = [
      {
        'name': 'client',
        'parent': null,
        'config': {
          'has_fixed_membership_fee': false,
          'fixed_membership_fee_amount': 0
        }
      },
      {
        'name': 'division_a',
        'parent': 'client',
        'config': {
          'has_fixed_membership_fee': false,
          'fixed_membership_fee_amount': 0
        }
      },
      {
        'name': 'division_b',
        'parent': 'client',
        'config': {
          'has_fixed_membership_fee': true,
          'fixed_membership_fee_amount': 35000
        }
      }
    ]

    const a = {
      'name': 'division_b',
      'parent': 'client',
      'config': {
        'has_fixed_membership_fee': true,
        'fixed_membership_fee_amount': 35000
      }
    }
    expect(treeHelper.findNodeByName('division_b', client)).toEqual(a)
    expect(treeHelper.findNodeByName('division_cb', client)).toBeNull()
  })
  it('get branches', () => {
    const organisation = [
      {
        'name': 'client',
        'parent': null,
        'config': {
          'has_fixed_membership_fee': false,
          'fixed_membership_fee_amount': 0
        }
      },
      {
        'name': 'division_a',
        'parent': 'client',
        'config': {
          'has_fixed_membership_fee': false,
          'fixed_membership_fee_amount': 0
        }
      }
    ]
    let tree = treeHelper.createTree(organisation)
    expect(tree.hasOwnProperty('client')).toBeTruthy()

    let branches = treeHelper.findBranches(tree.client)

    expect(branches).toEqual([{
      'name': 'division_a',
      'parent': 'client',
      'config': {
        'has_fixed_membership_fee': false,
        'fixed_membership_fee_amount': 0
      }
    }])
  })
})
