<template>
  <div>
    <br>
    <md-card class="md-primary">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">
              <md-button class="md-icon-button md-dense md-raised md-primary" :to="{ path: '/'}">
                <md-icon>assignment_ind</md-icon>
                <md-tooltip md-direction="top">Back to Customer List</md-tooltip>
              </md-button>
              <strong v-if="currentCustomer">{{currentCustomer.payload.inputs.customerName}}'s </strong>Shipment List
              <md-button v-if="!loadingBar" class="md-icon-button md-dense md-raised md-primary" @click="getAllShipments">
                <md-icon>cached</md-icon>
                <md-tooltip md-direction="top">Refresh Shipment List</md-tooltip>
              </md-button>
            </div>
          </md-card-header-text>
        </md-card-header>

        <md-card-content>
          You can find out all the shipments that belong to the customer you selected here, and make a new shipment or update a shipment.
          <br>
          <br>
          <small>Please notice that a shipment will be set to inactive and you cannot interactive with, if the transaction of making the shipment failed to be confirmed by the blockchain network. </small>
        </md-card-content>
        <md-progress-bar v-if="loadingBar" class="md-accent" md-mode="indeterminate"></md-progress-bar>
        <md-progress-bar v-if="!loadingBar" class="md-primary" md-mode="determinate" :md-value="100"></md-progress-bar>
    </md-card>
    <br>
    <div v-if="!loadingBar">
      <div v-if="!shipments.length">
        <br>
        <md-card class="md-primary">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">Nothing Found : (</div>
            </md-card-header-text>
          </md-card-header>
          <md-card-content>
            Looks like you have not added any shipment yet...
            <br>
            <br>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <div v-if="shipments" v-for="shipment in shipments" v-bind:key="shipment.payload.inputs.shipmentId" v-bind:value="shipment.payload.inputs.shipmentId">
      <md-card class="md-primary">
        <md-card-media-actions>
            <md-card-header>
              <md-card-header-text>
                <div class="md-title">
                  <span v-if="shipment.status == 'DEPLOYED'">
                    <md-icon class="md-accent">local_shipping</md-icon>
                    <md-tooltip md-direction="top">Confirmed</md-tooltip>
                  </span>
                  <span v-if="shipment.status == 'SUBMITTED'">
                    <md-icon>local_shipping</md-icon>
                    <md-tooltip md-direction="top">Pending</md-tooltip>
                  </span>
                   {{shipment.payload.inputs.sourceCustomerName}} to {{shipment.payload.inputs.destinationCustomerName}}</div>
                <div class="md-subhead">Transaction Date: {{(new Date(shipment.payload.inputs.transactionDate)).toLocaleString()}}</div>
                <div class="md-subhead">Shipment ID: {{shipment.payload.inputs.shipmentId}}</div>
              </md-card-header-text>
            </md-card-header>

          <md-card-actions>
            <md-button class="md-icon-button" @click="openInfoDialog(shipment)">
              <md-icon>info</md-icon>
              <md-tooltip md-direction="left">Transaction Info</md-tooltip>
            </md-button>

            <md-button v-if="shipment.status == 'DEPLOYED'" class="md-icon-button" :to="{ name: 'Log', params: { customerId: $route.params.customerId, shipmentId: shipment.id } }">
              <md-icon>description</md-icon>
              <md-tooltip md-direction="left">Logs</md-tooltip>
            </md-button>

            <md-button v-if="shipment.status != 'DEPLOYED'" class="md-icon-button">
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
    <md-button v-if="addingShipment" class="md-fab md-raised md-accent add-button">
      <md-icon>access_time</md-icon>
      <md-tooltip md-direction="left">Please Wait</md-tooltip>
    </md-button>

    <md-button v-if="!addingShipment" class="md-fab md-raised md-accent add-button" @click="showDialog = true">
      <md-icon>add</md-icon>
      <md-tooltip md-direction="left">Add Shipment</md-tooltip>
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
        <h3 class="md-title" style="flex: 1">Add new shipment</h3>
          <md-button class="md-icon-button" @click="showDialog = false">
            <md-icon>close</md-icon>
          </md-button>
      </md-toolbar>

      <md-dialog-content v-if="currentCustomer">
        <br>
        All fields are required. Estimated duration is auto calculated based on the times you select for goods issue plan and customer request del.
        <br>
        <br>
        <md-field>
          <label>Shipment Sender(You)</label>
          <md-input v-model="currentCustomer.payload.inputs.customerName" readonly></md-input>
        </md-field>

        <div class="md-layout-item">
          <md-field>
            <label for="movie">Shipment Receiver</label>
            <md-select v-model="selectedCustomerId" name="selectedCustomerId" id="selectedCustomerId" placeholder="Select a shipment recevier">
              <md-option v-if="currentCustomer.payload.inputs.customerId != customer.payload.inputs.customerId && currentCustomer.status == 'DEPLOYED'" v-for="customer in customers" v-bind:key="customer.payload.inputs.customerId" v-bind:value="customer.payload.inputs.customerId">
                {{customer.payload.inputs.customerName}}
              </md-option>
            </md-select>
          </md-field>
        </div>

        <md-field>
          <label>Source Location</label>
          <md-input v-model="sourceLocation"></md-input>
        </md-field>

        <md-field>
          <label>Destination Location</label>
          <md-input v-model="destinationLocation"></md-input>
        </md-field>

        <md-datepicker v-model="goodsIssuePlan" md-immediately>
          <label>Goods Issue Plan</label>
        </md-datepicker>

        <md-datepicker v-model="customerRequestDel" md-immediately>
          <label>Customer Request Del</label>
        </md-datepicker>

        <md-field>
          <label>Estimated Duration(Days) </label>
          <md-input v-model="estimatedDuration" readonly></md-input>
        </md-field>

        <md-field>
          <label>Status</label>
          <md-input v-model="status"></md-input>
        </md-field>

      </md-dialog-content>

      <md-dialog-actions>
        <md-button v-if="selectedCustomerId && sourceLocation && destinationLocation && goodsIssuePlan && customerRequestDel && status" class="md-accent" @click="generateShipment"><md-icon>local_shipping</md-icon> Add</md-button>
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
  name: 'Shipment',

  mounted () {
    if (this.$route.params.customerId) {
      this.getCurrentlCustomer(this.$route.params.customerId)
    }
    this.getAllCustomers()
  },
  data: () => ({
    showDialog: false,
    showInfoDialog: false,
    addingShipment: false,
    loadingBar: false,
    noWalletLogged: false,
    recordSigned: false,
    selectedCustomerId: null,
    selectedCustomerName: null,
    currentCustomer: null,
    sourceLocation: null,
    destinationLocation: null,
    goodsIssuePlan: null,
    customerRequestDel: null,
    estimatedDuration: null,
    status: null,
    infoData: null,
    customers: [],
    shipments: []
  }),
  watch: {
    goodsIssuePlan: function (val) {
      if (!this.customerRequestDel) {
        return
      }
      if ((new Date(this.customerRequestDel).getTime()) < (new Date(val).getTime())) {
        this.estimatedDuration = 0
        return
      }
      this.estimatedDuration = Math.ceil(((new Date(this.customerRequestDel).getTime()) - (new Date(val).getTime())) / (1000 * 60 * 60 * 24))
    },
    customerRequestDel: function (val) {
      if (!this.goodsIssuePlan) {
        return
      }
      if ((new Date(val).getTime()) < (new Date(this.goodsIssuePlan).getTime())) {
        this.estimatedDuration = 0
        return
      }
      this.estimatedDuration = Math.ceil(((new Date(val).getTime()) - (new Date(this.goodsIssuePlan).getTime())) / (1000 * 60 * 60 * 24))
    },
    selectedCustomerId: function (val) {
      if (!val) {
        this.selectedCustomerId = null
        return
      }
      for (let i = 0; i < this.customers.length; i++) {
        if (this.customers[i].payload.inputs.customerId === val && this.customers[i].status === 'DEPLOYED') {
          this.selectedCustomerName = this.customers[i].payload.inputs.customerName
          return
        }
      }
      this.selectedCustomerId = null
    }
  },
  mixins: [localstorage],
  methods: {
    openInfoDialog (infoData) {
      this.showInfoDialog = true
      this.infoData = infoData
    },
    clearForm () {
      this.selectedCustomerId = null
      this.selectedCustomerName = null
      this.sourceLocation = null
      this.destinationLocation = null
      this.goodsIssuePlan = null
      this.customerRequestDel = null
      this.estimatedDuration = null
      this.status = null
    },
    generateShipment () {
      if (!this.getWallet()) {
        this.noWalletLogged = true
        return
      }
      this.addingShipment = true
      let bodyFormData = new FormData()
      bodyFormData.append('from', this.getAddress())

      bodyFormData.append('shipmentId', uuidv1())
      bodyFormData.append('sourceCustomerId', this.currentCustomer.payload.inputs.customerId)
      bodyFormData.append('sourceCustomerName', this.currentCustomer.payload.inputs.customerName)
      bodyFormData.append('destinationCustomerId', this.selectedCustomerId)
      bodyFormData.append('destinationCustomerName', this.selectedCustomerName)
      bodyFormData.append('sourceLocation', this.sourceLocation)
      bodyFormData.append('destinationLocation', this.destinationLocation)
      bodyFormData.append('transactionDate', Date.now())
      bodyFormData.append('goodsIssuePlan', (new Date(this.goodsIssuePlan).getTime()))
      bodyFormData.append('customerRequestDel', (new Date(this.customerRequestDel).getTime()))

      bodyFormData.append('estimatedDuration', this.estimatedDuration * (1000 * 60 * 60 * 24))
      bodyFormData.append('status', this.status)
      bodyFormData.append('assetId', '')

      this.showDialog = false
      this.clearForm()
      let self = this
      try {
        simbaApi.postData('generateShipment/', bodyFormData).then(function (res) {
          self.unlockWallet(res.data.id, res.data.payload.raw)
        })
      } catch (e) {
        self.addingShipment = false
        console.log(e)
      }
    },
    getAllCustomers () {
      let self = this
      try {
        simbaApi.getData('addCustomer')
          .then(function (response) {
            let deployed = []
            for (let i = 0; i < response.data.results.length; i++) {
              if (response.data.results[i].status === 'DEPLOYED') {
                deployed.push(response.data.results[i])
              }
            }
            self.customers = deployed
          })
      } catch (e) {
        console.log(e)
      }
    },
    getAllShipments () {
      this.loadingBar = true
      let self = this
      try {
        simbaApi.getData('generateShipment/?sourceCustomerId_exact=' + this.currentCustomer.payload.inputs.customerId)
          .then(function (response) {
            self.shipments = response.data.results
            self.loadingBar = false
          })
      } catch (e) {
        self.loadingBar = false
        console.log(e)
      }
    },
    getCurrentlCustomer (id) {
      this.loadingBar = true
      this.currentCustomer = null
      let self = this
      try {
        simbaApi.getData('transaction/' + id + '/')
          .then(function (response) {
            self.currentCustomer = response.data
            self.getAllShipments()
          })
      } catch (e) {
        self.loadingBar = false
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
          self.addingShipment = false
        })
      } catch (e) {
        self.addingShipment = false
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
