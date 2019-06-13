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
            <strong v-if="currentShipment">{{currentShipment.payload.inputs.sourceCustomerName}}</strong> to <strong v-if="currentShipment">{{currentShipment.payload.inputs.destinationCustomerName}}</strong> Shipment Logs
            <md-button v-if="!loadingBar" class="md-icon-button md-dense md-raised md-primary" @click="getAllLogs">
              <md-icon>cached</md-icon>
              <md-tooltip md-direction="top">Refresh List</md-tooltip>
            </md-button>
          </div>
        </md-card-header-text>
      </md-card-header>

      <md-card-content>
        <div v-if="currentShipment">
          <div class="md-subhead"><h3>Original Copy:</h3></div>
          <strong>Shipment ID:</strong> {{currentShipment.payload.inputs.shipmentId}}<br>
          <strong>Transaction Time:</strong> {{(new Date(currentShipment.payload.inputs.transactionDate)).toLocaleString()}}<br>
          <strong>Source Location:</strong> {{currentShipment.payload.inputs.sourceLocation}}<br>
          <strong>Destination Location:</strong> {{currentShipment.payload.inputs.destinationLocation}}<br>
          <strong>Goods Issue Plan:</strong> {{(new Date(currentShipment.payload.inputs.goodsIssuePlan)).toLocaleString()}}<br>
          <strong>Customer Request Del:</strong> {{(new Date(currentShipment.payload.inputs.customerRequestDel)).toLocaleString()}}<br>
          <strong>Estimated Duration:</strong> {{Math.ceil(currentShipment.payload.inputs.estimatedDuration / (1000 * 60 * 60 * 24))}} Days<br>
          <strong>Status:</strong> {{currentShipment.payload.inputs.status}}<br>
        </div>
        <br>
        <small>Please notice that an update will be considered as invalid, if the transaction of making the shipment failed to be confirmed by the blockchain network. </small>
      </md-card-content>
      <md-progress-bar v-if="loadingBar" class="md-accent" md-mode="indeterminate"></md-progress-bar>
      <md-progress-bar v-if="!loadingBar" class="md-primary" md-mode="determinate" :md-value="100"></md-progress-bar>
    </md-card>
    <br>
    <div v-if="!loadingBar">
      <div v-if="!logs.length">
        <br>
        <md-card class="md-primary">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">Nothing Found : (</div>
            </md-card-header-text>
          </md-card-header>
          <md-card-content>
            Looks like you have not added any log yet...
            <br>
            <br>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <div v-if="logs" v-for="log in logs" v-bind:key="log.payload.inputs.updateId" v-bind:value="log.payload.inputs.updateId">
      <md-card class="md-primary">
        <md-card-media-actions>
            <md-card-header>
              <md-card-header-text>
                <div class="md-title">
                  <span v-if="log.status == 'DEPLOYED'">
                    <md-icon class="md-accent">insert_drive_file</md-icon>
                    <md-tooltip md-direction="top">Confirmed</md-tooltip>
                  </span>
                  <span v-if="log.status == 'SUBMITTED'">
                    <md-icon>insert_drive_file</md-icon>
                    <md-tooltip md-direction="top">Pending</md-tooltip>
                  </span>
                   Update: {{(new Date(log.timestamp)).toLocaleString()}}</div>
                <div class="md-subhead">Update ID: {{log.payload.inputs.updateId}}</div>
                <strong>Source Location:</strong> {{log.payload.inputs.sourceLocation}}<br>
                <strong>Destination Location:</strong> {{log.payload.inputs.destinationLocation}}<br>
                <strong>Goods Issue Plan:</strong> {{(new Date(log.payload.inputs.goodsIssuePlan)).toLocaleString()}}<br>
                <strong>Customer Request Del:</strong> {{(new Date(log.payload.inputs.customerRequestDel)).toLocaleString()}}<br>
                <strong>Estimated Duration:</strong> {{Math.ceil(log.payload.inputs.estimatedDuration / (1000 * 60 * 60 * 24))}} Days<br>
                <strong>Status:</strong> {{log.payload.inputs.status}}<br>
              </md-card-header-text>
            </md-card-header>
          <md-card-actions>
            <md-button class="md-icon-button" @click="openInfoDialog(log)">
              <md-icon>info</md-icon>
              <md-tooltip md-direction="left">Transaction Info</md-tooltip>
            </md-button>
          </md-card-actions>
        </md-card-media-actions>
      </md-card>
      <br>
    </div>

    <br>
    <br>
    <md-button v-if="updatingShipment" class="md-fab md-raised md-accent add-button">
      <md-icon>access_time</md-icon>
      <md-tooltip md-direction="left">Please Wait</md-tooltip>
    </md-button>

    <md-button v-if="!updatingShipment" class="md-fab md-raised md-accent add-button" @click="showDialog = true">
      <md-icon>note_add</md-icon>
      <md-tooltip md-direction="left">Update Shipment</md-tooltip>
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
        <h3 class="md-title" style="flex: 1">Update current shipment</h3>
          <md-button class="md-icon-button" @click="showDialog = false">
            <md-icon>close</md-icon>
          </md-button>
      </md-toolbar>

      <md-dialog-content v-if="currentShipment">
        <br>
        <br>

        <md-field>
          <label>Shipment Sender</label>
          <md-input v-model="currentShipment.payload.inputs.sourceCustomerName" readonly></md-input>
        </md-field>

        <md-field>
          <label>Shipment Receiver</label>
          <md-input v-model="currentShipment.payload.inputs.destinationCustomerName" readonly></md-input>
        </md-field>

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
        <md-button v-if="sourceLocation && destinationLocation && goodsIssuePlan && customerRequestDel && status" class="md-accent" @click="updateShipment"><md-icon>insert_drive_file</md-icon> Update</md-button>
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
  name: 'Log',

  mounted () {
    if (!this.$route.params.customerId && !this.$route.params.shipmentId) {
      return
    }

    if (this.$route.params.shipmentId) {
      this.getCurrentShipment(this.$route.params.shipmentId)
    }
  },
  data: () => ({
    loadingBar: null,
    showInfoDialog: false,
    showDialog: false,
    updatingShipment: false,
    noWalletLogged: false,
    recordSigned: false,
    currentShipment: null,
    sourceLocation: null,
    destinationLocation: null,
    goodsIssuePlan: null,
    customerRequestDel: null,
    estimatedDuration: null,
    status: null,
    infoData: null,
    logs: []
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
    }
  },
  mixins: [localstorage],
  methods: {
    openInfoDialog (infoData) {
      this.showInfoDialog = true
      this.infoData = infoData
    },
    clearForm () {
      this.sourceLocation = null
      this.destinationLocation = null
      this.goodsIssuePlan = null
      this.customerRequestDel = null
      this.estimatedDuration = null
      this.status = null
    },
    updateShipment () {
      if (!this.getWallet()) {
        this.noWalletLogged = true
        return
      }
      this.updatingShipment = true
      let bodyFormData = new FormData()
      bodyFormData.append('from', this.getAddress())

      bodyFormData.append('updateId', uuidv1())
      bodyFormData.append('shipmentId', this.currentShipment.payload.inputs.shipmentId)
      bodyFormData.append('sourceCustomerId', this.currentShipment.payload.inputs.sourceCustomerId)
      bodyFormData.append('sourceCustomerName', this.currentShipment.payload.inputs.sourceCustomerName)
      bodyFormData.append('destinationCustomerId', this.currentShipment.payload.inputs.destinationCustomerId)
      bodyFormData.append('destinationCustomerName', this.currentShipment.payload.inputs.destinationCustomerName)
      bodyFormData.append('sourceLocation', this.sourceLocation)
      bodyFormData.append('destinationLocation', this.destinationLocation)
      bodyFormData.append('transactionDate', this.currentShipment.payload.inputs.transactionDate)
      bodyFormData.append('goodsIssuePlan', (new Date(this.goodsIssuePlan).getTime()))
      bodyFormData.append('customerRequestDel', (new Date(this.customerRequestDel).getTime()))
      bodyFormData.append('estimatedDuration', this.estimatedDuration * (1000 * 60 * 60 * 24))
      bodyFormData.append('status', this.status)
      bodyFormData.append('assetId', '')

      this.showDialog = false
      this.clearForm()
      let self = this
      try {
        simbaApi.postData('updateShipment/', bodyFormData).then(function (res) {
          self.unlockWallet(res.data.id, res.data.payload.raw)
        })
      } catch (e) {
        self.updatingShipment = false
        console.log(e)
      }
    },
    getAllLogs () {
      this.loadingBar = true
      let self = this
      try {
        simbaApi.getData('updateShipment/?shipmentId_exact=' + this.currentShipment.payload.inputs.shipmentId)
          .then(function (response) {
            self.logs = response.data.results
            self.loadingBar = false
          })
      } catch (e) {
        console.log(e)
        self.loadingBar = false
      }
    },
    getCurrentShipment (id) {
      this.loadingBar = true
      let self = this
      try {
        simbaApi.getData('transaction/' + id + '/')
          .then(function (response) {
            self.currentShipment = response.data
            self.getAllLogs()
          })
      } catch (e) {
        console.log(e)
        self.loadingBar = false
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
          self.updatingShipment = false
        })
      } catch (e) {
        self.updatingShipment = false
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
