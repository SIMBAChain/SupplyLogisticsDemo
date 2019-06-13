<template>
  <div class="page-container unselectable">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary" md-elevation="0">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <span class="md-title">Supply Logistics Demo</span>
          </div>

          <div class="md-toolbar-section-end">
            <span>
              <md-button class="md-icon-button" @click="showWallet(true)">
                <span v-if="hasWallet">
                  <md-icon style="color: #00c853;">account_balance_wallet</md-icon>
                </span>
                <span v-else>
                  <md-icon>account_balance_wallet</md-icon>
                </span>
              </md-button>
              <md-tooltip md-delay="500" md-direction="left">Wallet</md-tooltip>
            </span>
          </div>

          <md-dialog class="wallet" :md-click-outside-to-close=false :md-active.sync="isWallet">
            <md-toolbar class="md-accent md-dense">
              <h3 class="md-title" style="flex: 1">Ethereum Wallet</h3>
                <md-button class="md-icon-button" @click="setWalletStatus('close')">
                  <md-icon>close</md-icon>
                </md-button>
            </md-toolbar>

            <div v-if="isCreate">
              <div class="wallet-content">
                <div class="md-subheading">
                  Create a new Ethereum Account
                </div>
                <br>
                <br>
                <br>
              </div>
              <md-dialog-actions class="md-layout md-alignment-center-space-between">
                <md-button class="md-accent" @click="setWalletStatus('restore')">Restore</md-button>
                <md-button class="md-accent md-raised" @click="createWallet()">Create</md-button>
              </md-dialog-actions>
            </div>

            <div v-if="isRestore">
              <div class="wallet-content">
                <div class="md-subheading">
                  Restore your Ethereum Account with Seed
                </div>
                <br>
                <div class="md-caption">
                  Please type your seed (12 mnemonic words) to restore
                </div>
                <div class="md-layout-item md-size-70">
                  <md-field>
                    <label>Wallet Seed</label>
                    <md-textarea md-autogrow v-model="restoreSeed"></md-textarea>
                  </md-field>
                </div>
                <br>
                <br>
                <br>
              </div>
              <md-dialog-actions class="md-layout md-alignment-center-space-between">
                <md-button class="md-accent" @click="setWalletStatus('create')">Create</md-button>
                <md-button class="md-accent md-raised" @click="restoreWallet()">Restore</md-button>
              </md-dialog-actions>
              <md-snackbar :md-active.sync="invalidSeed">The seed is invalid, please check again!!!</md-snackbar>
            </div>

            <div v-if="isUnlock">
              <div class="wallet-content">
                <div class="md-subheading">
                  Unlock Your Account
                </div>
                <br>
                <br>
                <br>
              </div>
              <md-dialog-actions class="md-layout md-alignment-center-space-between">
                <md-button @click="logoutWallet">Logout</md-button>
                <md-button class="md-accent md-raised" @click="unlockWallet">Unlock</md-button>
              </md-dialog-actions>
            </div>

            <div v-if="isCheck">
              <div class="wallet-content">
                <div class="md-subheading">
                  Ethereum Account Information
                </div>
                <br>
                <div class="md-layout-item md-size-90">
                  <md-field>
                    <label>Account Address</label>
                    <md-textarea md-autogrow v-model="accountAddress" readonly></md-textarea>
                  </md-field>
                </div>
                <div v-if="isRevealed">
                  <div class="md-layout-item md-size-90">
                    <md-field>
                      <label>Private Key</label>
                      <md-textarea md-autogrow v-model="accountPk" readonly></md-textarea>
                    </md-field>
                  </div>
                  <div class="md-layout-item md-size-90">
                    <md-field>
                      <label>Seed</label>
                      <md-textarea md-autogrow v-model="accountSeed" readonly></md-textarea>
                    </md-field>
                  </div>
                </div>
              </div>
              <md-dialog-actions class="md-layout md-alignment-center-space-between">
                <md-button @click="logoutWallet">Logout</md-button>
                <md-button class="md-accent md-raised" @click="isRevealed = true">Reveal</md-button>
              </md-dialog-actions>
            </div>
          </md-dialog>
        </div>
      </md-app-toolbar>

      <md-app-content>
        <router-view class="conent">
        </router-view>
      </md-app-content>
    </md-app>
      <md-snackbar :md-active.sync="createdWallet">We just created a wallet for you, check it out at the right-top corner : )</md-snackbar>
      <md-snackbar :md-active.sync="depositedWallet">We deposited enough Ethers on this private network for you, please wait a while</md-snackbar>
  </div>
</template>

<style lang="scss" scoped>
  .md-app {
    height: 100vh;
  }
  .unselectable {
    user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
  .wallet {
    min-width: 320px;
  }
  .wallet-content {
    margin: 20px;
  }

</style>

<script>
import { localstorage } from './components/mixins/localstorage'
import manageApi from './components/gateways/manage-api'
import ethers from 'ethers'

export default {
  name: 'App',
  mixins: [localstorage],
  data: () => ({
    restoreSeed: null,
    invalidSeed: null,
    accountAddress: null,
    accountPk: null,
    accountSeed: null,
    menuVisible: false,
    isRevealed: false,
    isWallet: false,
    isCreate: false,
    isRestore: false,
    isUnlock: false,
    isCheck: false,
    hasWallet: false,
    createdWallet: false,
    depositedWallet: false
  }),
  methods: {
    setWalletStatus (status) {
      switch (status) {
        case 'create':
          this.isCreate = true
          this.isRestore = false
          this.isUnlock = false
          this.isCheck = false
          break
        case 'restore':
          this.isCreate = false
          this.isRestore = true
          this.isUnlock = false
          this.isCheck = false
          break
        case 'unlock':
          this.isCreate = false
          this.isRestore = false
          this.isUnlock = true
          this.isCheck = false
          break
        case 'check':
          this.isCreate = false
          this.isRestore = false
          this.isUnlock = false
          this.isCheck = true
          break
        case 'close':
          this.isCreate = false
          this.isRestore = false
          this.isUnlock = false
          this.isCheck = false
          this.isWallet = false
          this.cleanUp()
          break
      }
    },
    showWallet (status) {
      this.setWalletStatus('close')
      if (status) {
        this.isWallet = true
        this.getCurrentWallet()
      }
    },
    getCurrentWallet () {
      if (localStorage.getItem('keystore')) {
        this.isUnlock = true
        this.hasWallet = true
      } else {
        this.isCreate = true
        this.hasWallet = false
      }
    },
    createWallet () {
      const mnemonic = ethers.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16))
      this.setWallet(mnemonic)
      this.checkWallet(mnemonic)
      this.setWalletStatus('check')
      this.hasWallet = true
      this.cleanUp()
      this.depositAccount(mnemonic)
    },
    depositAccount (mnemonic) {
      let wallet = ethers.Wallet.fromMnemonic(mnemonic)
      let address = wallet.address
      let payload = {
        account: address,
        value: '100',
        currency: 'ether'
      }
      let self = this
      try {
        manageApi.requestFund('requestFunds/', payload).then(function () {
          self.depositedWallet = true
        })
      } catch (e) {
        console.log(e)
      }
    },
    restoreWallet () {
      const mnemonic = this.restoreSeed
      if (!ethers.HDNode.isValidMnemonic(mnemonic)) {
        this.invalidSeed = true
        this.cleanUp()
        return
      }
      this.invalidSeed = false
      this.setWallet(mnemonic)
      this.checkWallet(mnemonic)
      this.depositAccount(mnemonic)
      this.setWalletStatus('check')
      this.hasWallet = true
      this.cleanUp()
    },
    cleanUp () {
      this.restoreSeed = null
      this.isRevealed = false
    },
    unlockWallet () {
      if (this.getWallet()) {
        this.setWalletStatus('check')
        this.checkWallet(this.getWallet())
      } else {
        this.cleanUp()
      }
    },
    checkWallet (mnemonic) {
      let wallet = ethers.Wallet.fromMnemonic(mnemonic)
      this.setAddress(wallet.address)
      this.accountAddress = wallet.address
      this.accountPk = wallet.privateKey
      this.accountSeed = mnemonic
    },
    logoutWallet () {
      this.clean()
      this.setWalletStatus('create')
      this.hasWallet = false
    },
    toggleMenu () {
      this.menuVisible = !this.menuVisible
    }
  },
  mounted () {
    if (!localStorage.getItem('keystore')) {
      this.createWallet()
      this.createdWallet = true
    }
    this.getCurrentWallet()
  }
}
</script>
