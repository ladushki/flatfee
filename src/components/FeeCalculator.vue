<template>
  <section class='section calculator'>
    <div class='container'>
      <div class='column is-one-third'>
        <h1 class="title">Membership Fee Calculator</h1>
        <form id='calculator'>
          <div class='field'>
            <div class='control'>
              <label class='label'>The Landroad:</label>
              <v-select
                ref='select'
                placeholder='No landloard'
                label='name'
                code='name'
                :options='branches'
                v-model='branch'
              >
                <span slot='no-options'>No results</span>
              </v-select>
            </div>
          </div>
          <div class='field' v-if='!fixedAmount'>
            <label class='label'>I pay:</label>
            <div class='control'>
              <label class='radio'><input type='radio' name='rentType' v-model='rentPeriod' value='month'>Monthly</label>
              <label class='radio'><input type='radio' name='rentType' v-model='rentPeriod' value='week'> Weekly</label>
            </div>
          </div>
          <div class='field' v-if='!fixedAmount'>
            <div class='control'>
              <label class='label'>The Amount in £: </label>
              <input v-model='rentAmount' type='number' ref='rent'
                     v-bind:class="[error ? 'is-danger' : '', 'input']"
                     v-on:input='checkTypingForm' min='25' max='8660'>
              <span class='validity'></span>
              <p class="help is-danger" v-if='error'>
                {{ error }}
              </p>
            </div>
          </div>
          <div v-if='membershipFee>0' class='membershipFee'>
            <div class='number'> My membership fee would be: £ {{ membershipFee }}</div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import organisation from '../json/organisation.json'
import * as treeHelper from '../modules/Tree'
import * as helpers from '../modules/Helpers'
import VueSelect from 'vue-select'

let timeout = null

export default {
  name: 'FeeCalculator',
  components: {
    'v-select': VueSelect
  },
  data () {
    return {
      organisation: organisation,
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
    this.setTree(this.organisation)
    this.setBranches(this.organisationalTree)
  },
  methods: {
    setTree (data) {
      const tree = treeHelper.createTree(data)
      if (tree.hasOwnProperty('client')) {
        this.organisationalTree = tree.client
      } else {
        throw TypeError('Organisational data is in wrong format')
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
          this.error = 'Your weekly rent has to be between ' + this.weekRage.min + ' & ' + this.weekRage.max
        }
      } else {
        if (!helpers.between(this.rentAmount, this.monthRage.min, this.monthRage.max)) {
          this.error = 'Your monthly rent has to be between ' + this.monthRage.min + ' & ' + this.monthRage.max
        }
      }
      return this.error
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
      this.validateForm()
      this.calculate()
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
