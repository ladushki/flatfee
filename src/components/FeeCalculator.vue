<template>
  <section class='section calculator'>
      <div class='column is-one-third'>
        <h1 class="title">Membership Fee Calculator</h1>
        <form id='calculator'>
          <b-field label='My Landroad'>
              <v-select ref='select'  expanded
                placeholder='No landloard' label='name' code='name'
                :options='branches'
                v-model='branch'><span slot='no-options'>No results</span>
              </v-select>
          </b-field>
          <label class="label"  v-if='!fixedAmount'>I pay: </label>
          <b-field  v-if='!fixedAmount'>
            <b-radio-button v-model="rentPeriod" native-value="month">
              <span>Monthly</span>
            </b-radio-button>
            <b-radio-button v-model="rentPeriod" native-value="week">
              <span>Weekly</span>
            </b-radio-button>
          </b-field>
             <div class="column is-half"><b-field label="The Amount in £: " v-if='!fixedAmount'>
              <b-numberinput v-model='rentAmount'
                             id="rentAmount"
                             size='is-small'
                             :min='minRent' :max='maxRent'
                             v-bind:type="error ? 'is-danger':'is-dark'"
                             v-on:input='checkTypingForm'></b-numberinput>
              </b-field>
             </div>
          <div v-if='membershipFee>0' class="membershipFee">
            <div class="number"> My membership fee would be: £ {{ membershipFee }}</div>
          </div>
        </form>
      </div>
  </section>
</template>

<script>

import * as treeHelper from '../services/Tree'
import * as helpers from '../services/Helpers'
import VueSelect from 'vue-select'

let timeout = null

export default {
  name: 'FeeCalculator',
  components: {
    'v-select': VueSelect
  },
  data () {
    return {
      organisation: null,
      organisationalTree: {},
      branches: [],
      rentAmount: null,
      rentPeriod: 'month',
      branch: null,
      error: null,
      fixedAmount: false,
      weekRage: {min: 25, max: 2000},
      monthRage: {min: 110, max: 8660},
      minFee: 120,
      vat: 1.2
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      return import('../json/organisation.json').then((data) => {
        this.organisation = data
        this.setTree(this.organisation)
        this.setBranches(this.organisationalTree)
      })
    },
    setTree (data) {
      try {
        const tree = treeHelper.createTree(data)
        if (tree && tree.hasOwnProperty('client')) {
          this.organisationalTree = tree.client
        } else {
          throw TypeError('Organisational data is wrong')
        }
      } catch (e) {
        console.log(e.err)
      }
    },
    setBranches (tree) {
      this.branches = treeHelper.findBranches(tree)
      if (typeof this.branches !== 'object') {
        throw TypeError('There are no branches')
      }
    },
    findFixedFee (branch) {
      let fee = false
      let item = treeHelper.findNodeByName(branch, this.organisation)
      fee = this.getFixedFeeAmount(item)

      if (fee === false && item) {
        fee = this.findFixedFee(item.parent)
      }
      return fee
    },
    getFixedFeeAmount (item) {
      if (item && item.config) {
        if (item.config.has_fixed_membership_fee) {
          return item.config.fixed_membership_fee_amount
        } else {
          return 0
        }
      }
      return false
    },
    checkTypingForm (e) {
      clearTimeout(timeout)

      timeout = setTimeout(() => {
        if (this.rentAmount.length > 4) {
          this.rentAmount = this.rentAmount.slice(0, 4)
        }
        this.validateForm()
      }, 100)
    },
    validateForm () {
      this.error = false
      if (this.rentPeriod === 'week') {
        if (!helpers.between(this.rentAmount, this.weekRage.min, this.weekRage.max)) {
          this.error = true
        }
      } else {
        if (!helpers.between(this.rentAmount, this.monthRage.min, this.monthRage.max)) {
          this.error = true
        }
      }
      return !this.error
    },
    calculate () {
      let fee = 0
      this.setFixedAmount()

      if (this.fixedAmount) {
        fee = this.fixedAmount
      } else {
        fee = this.rentPeriod === 'month' ? ((this.amount * 12) / 52) : this.amount
      }
      return (fee < this.minFee && fee > 0) ? this.minFee : fee
    },
    setFixedAmount () {
      this.fixedAmount = false
      if (this.branch) {
        this.fixedAmount = this.findFixedFee(this.branch.name, this.organisation) / 100
      }
    }
  },
  watch: {
    branch () {
      this.setFixedAmount()
    },
    rentPeriod () {
      if (this.rentAmount > 0) {
        this.validateForm()
        this.calculate()
      }
    }
  },
  computed: {
    amount () {
      if (this.rentAmount <= 0) return 0
      if (this.rentPeriod === 'week') {
        return helpers.returnLimit(this.rentAmount, this.weekRage.min, this.weekRage.max)
      } else {
        return helpers.returnLimit(this.rentAmount, this.monthRage.min, this.monthRage.max)
      }
    },
    membershipFee () {
      return Math.round(this.calculate() * this.vat)
    },
    minRent () {
      return this.rentPeriod === 'month' ? this.monthRage.min : this.weekRage.min
    },
    maxRent () {
      return this.rentPeriod === 'month' ? this.monthRage.max : this.weekRage.max
    }
  }
}
</script>

<style scoped>
  input {
    width: 90%;
  }
  input:invalid+span:after {
    content: '✖';
    padding-left: 5px;
  }

  input:valid+span:after {
    content: '✓';
    padding-left: 5px;
  }
</style>
