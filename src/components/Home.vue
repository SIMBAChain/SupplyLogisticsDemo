<template>
  <div>
    <br>
    <md-card class="md-primary">
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">
            Customer List
            <md-button v-if="!getAllCustomersBar" class="md-icon-button md-dense md-raised md-primary" @click="getAllCustomers">
              <md-icon>cached</md-icon>
              <md-tooltip md-direction="top">Refresh List</md-tooltip>
            </md-button>
          </div>
        </md-card-header-text>
      </md-card-header>

      <md-card-content>
        You can check out all the customers, add new or act as a customer and make a shipment here.
        <br>
        You need to have at least 2 customers to make a shipment.
        <br>
        <br>
        <small>Please notice that a customer will be set to inactive and you cannot interactive with, if the transaction of adding the customer failed to be confirmed by the blockchain network. </small>
      </md-card-content>
      <md-progress-bar v-if="getAllCustomersBar" class="md-accent" md-mode="indeterminate"></md-progress-bar>
      <md-progress-bar v-if="!getAllCustomersBar" class="md-primary" md-mode="determinate" :md-value="100"></md-progress-bar>
    </md-card>
    <br>
    <div v-if="!getAllCustomersBar">
      <div v-if="!customers.length">
        <br>
        <md-card class="md-primary">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">Nothing Found : (</div>
            </md-card-header-text>
          </md-card-header>
          <md-card-content>
            Looks like you have not added any customer yet...
            <br>
            <br>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <div v-for="customer in customers" v-bind:key="customer.payload.inputs.customerId" v-bind:value="customer.payload.inputs.customerName">
      <md-card class="md-primary">
        <md-card-media-actions>
            <md-card-header>
              <md-card-header-text>
                <div class="md-title">
                  <span v-if="customer.status == 'DEPLOYED'">
                    <md-icon class="md-accent">assignment_ind</md-icon>
                    <md-tooltip md-direction="top">Confirmed</md-tooltip>
                  </span>
                  <span v-if="customer.status == 'SUBMITTED'">
                    <md-icon>assignment_ind</md-icon>
                    <md-tooltip md-direction="top">Pending</md-tooltip>
                  </span>
                   {{customer.payload.inputs.customerName}}</div>
                <div class="md-subhead">Customer ID: {{customer.payload.inputs.customerId}}</div>
              </md-card-header-text>
            </md-card-header>

          <md-card-actions>
            <md-button class="md-icon-button" @click="openInfoDialog(customer)">
              <md-icon>info</md-icon>
              <md-tooltip md-direction="left">Transaction Info</md-tooltip>
            </md-button>

            <md-button v-if="customer.status == 'DEPLOYED'" class="md-icon-button" :to="{ name: 'Shipment', params: { customerId: customer.id } }">
              <md-icon>local_shipping</md-icon>
              <md-tooltip md-direction="left">Shipments</md-tooltip>
            </md-button>

            <md-button v-if="customer.status != 'DEPLOYED'" class="md-icon-button">
              <md-icon>access_time</md-icon>
              <md-tooltip md-direction="left">Inactivated</md-tooltip>
            </md-button>

          </md-card-actions>
        </md-card-media-actions>
      </md-card>
      <br>

    </div>

    <br>
    <br>

    <md-button v-if="addingCustomer" class="md-fab md-raised md-accent add-button">
      <md-icon>access_time</md-icon>
      <md-tooltip md-direction="left">Please Wait</md-tooltip>
    </md-button>

    <md-button v-if="!addingCustomer" class="md-fab md-raised md-accent add-button" @click="showDialog = true">
      <md-icon>add</md-icon>
      <md-tooltip md-direction="left">Add Customer</md-tooltip>
    </md-button>

    <md-dialog :md-active.sync="showInfoDialog">
      <md-toolbar class="md-accent md-dense">
        <h3 class="md-title" style="flex: 1">Transaction Details</h3>
      </md-toolbar>
      <md-dialog-content>
        <br>
        <tree-view :data="infoData" :options="{maxDepth: 1}"></tree-view>
        <br>
      </md-dialog-content>
      <div>
        <md-button class="md-accent" @click="showInfoDialog = false">OK</md-button>
      </div>
    </md-dialog>

    <md-dialog :md-active.sync="showDialog">
      <md-toolbar class="md-accent md-dense">
        <h3 class="md-title" style="flex: 1">Add new customer</h3>
          <md-button class="md-icon-button" @click="showDialog = false">
            <md-icon>close</md-icon>
          </md-button>
      </md-toolbar>

      <md-dialog-content>
        <br>
        <br>
        Companys consider as cusomters in this demo, you can start to add a new customer by typing the company name below. A unique ID is assigned to each customer every time you add it even with the same company name.
        <md-field>
          <label>Company Name</label>
          <md-input v-model="customerName"></md-input>
          <span class="md-helper-text">Type your company name above</span>
        </md-field>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button v-if="customerName" class="md-accent" @click="addCustomer"><md-icon>assignment_ind</md-icon> Add</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-snackbar :md-active.sync="recordSigned">The transaction was Signed, Congratulations!!!</md-snackbar>
    <md-snackbar :md-active.sync="noWalletLogged">Please click the wallet button on the top right corner to login!!!</md-snackbar>

  </div>
</template>

<script>
import { localstorage } from './mixins/localstorage'
import uuidv1 from 'uuid/v1'
import ethers from 'ethers'
import simbaApi from './gateways/simba-api'

export default {
  name: 'Home',
  mounted () {
    this.getAllCustomers()
  },
  data: () => ({
    showDialog: false,
    showInfoDialog: false,
    customerName: null,
    addingCustomer: false,
    noWalletLogged: false,
    recordSigned: false,
    getAllCustomersBar: false,
    infoData: null,
    customers: []
  }),
  mixins: [localstorage],
  methods: {
    openInfoDialog (infoData) {
      this.showInfoDialog = true
      this.infoData = infoData
    },
    clearForm () {
      this.customerName = null
    },
    addCustomer () {
      if (!this.getWallet()) {
        this.noWalletLogged = true
        return
      }
      this.addingCustomer = true

      let bodyFormData = new FormData()
      bodyFormData.append('from', this.getAddress())
      bodyFormData.append('customerId', uuidv1())
      bodyFormData.append('customerName', this.customerName)
      bodyFormData.append('assetId', '')

      this.showDialog = false
      this.clearForm()
      let self = this
      try {
        simbaApi.postData('addCustomer/', bodyFormData).then(function (res) {
          self.unlockWallet(res.data.id, res.data.payload.raw)
        })
      } catch (e) {
        self.addingCustomer = false
        console.log(e)
      }
    },
    getAllCustomers () {
      this.getAllCustomersBar = true
      let self = this
      try {
        simbaApi.getData('addCustomer')
          .then(function (response) {
            self.getAllCustomersBar = false
            self.customers = response.data.results
          })
      } catch (e) {
        console.log(e)
      }
    },
    unlockWallet (txnId, unsignedTxn) {
      try {
        this.sendTxn(this.getWallet(), txnId, unsignedTxn)
      } catch (e) {
        console.log(e)
      }
    },
    sendTxn (mnemonic, txnId, unsignedTxn) {
      let wallet = ethers.Wallet.fromMnemonic(mnemonic)
      let signedTxn = wallet.sign(unsignedTxn)
      let self = this
      let payload = {
        'payload': signedTxn
      }
      try {
        simbaApi.signTxn('transaction/' + txnId + '/', payload).then(function () {
          self.recordSigned = true
          self.addingCustomer = false
        })
      } catch (e) {
        self.addingCustomer = false
        console.log(e)
      }
    }
  }
}
</script>

<style lang="css">
  .add-button {
    position: fixed !important;
    bottom: 20px !important;
    right: 15px !important;
  }
  .tree-view-item-key {
    color: #ffd600;
  }
  .tree-view-item-value-string {
    color: #90caf9;
  }
  .tree-view-item-value-null {
    color: #f50057;
  }
  .tree-view-item-value-number {
    color: #00c853;
  }
</style>
