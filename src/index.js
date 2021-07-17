import MetaMaskOnboarding from '@metamask/onboarding'

const GOD_ABI = [{
  inputs: [],
  name: 'buyTokens',
  outputs: [],
  stateMutability: 'payable',
  type: 'function',
}]

const Web3 = require('web3')

const web3 = new Web3('https://bsc-dataseed1.binance.org:443')
const textHead = document.getElementById('logo-text')
const getAccountsResults = document.getElementById('getAccountsResult')
const contractAdds = '0xC7170ab39fAA96B3861253D0874f8aA3D2A398A5'
const COVENENT = new web3.eth.Contract(GOD_ABI, contractAdds)

const currentUrl = new URL(window.location.href)
const forwarderOrigin =
  currentUrl.hostname === 'localhost' ? 'http://localhost:9010' : undefined

const onboardButton = document.getElementById('connectButton')
const addCartButton1 = document.getElementById('AddCartButton1')
const addCartButton2 = document.getElementById('AddCartButton2')
const cartItemNumber = document.getElementById('ItemNumber')
let startNumItem = 0

const initialize = () => {
  const isMetaMaskInstalled = () => {
    const { ethereum } = window
    return Boolean(ethereum && ethereum.isMetaMask)
  }
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin })
  const onClickConnect = async () => {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' })
      const _accounts = await ethereum.request({
        method: 'eth_accounts',
      })
      getAccountsResults.innerHTML = _accounts[0] || 'Not able to get accounts'
      console.log(_accounts[0])
      const txHash = COVENENT.methods.buyTokens().encodeABI()
      const txO = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          to: contractAdds,
          from: _accounts[0],
          gas: '21000',
          gasPrice: web3.utils.toHex('10000000000'),
          value: web3.utils.toHex('10000000000000000'),
          data: txHash,
        }],
      })

      console.log(txO)
      textHead.innerHTML =
      '<p>You just bought 0.000001 GOD!</p><p>And that\'s good enough!</p><p>Don\'t be greedy, you don\'t need more!</p>'
    } catch (error) {
      console.error(error)
    }
  }
  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress'
    onboardButton.disabled = true
    onboarding.startOnboarding()
  }

  const MetaMaskClientCheck = () => {
    if (isMetaMaskInstalled()) {
      onboardButton.innerText = 'Connect'
      onboardButton.onclick = onClickConnect
      onboardButton.disabled = false
    } else {
      onboardButton.innerText = 'Click here to install MetaMask!'
      onboardButton.onclick = onClickInstall
      onboardButton.disabled = false
    }
  }

  MetaMaskClientCheck()
}

window.addEventListener('DOMContentLoaded', initialize)

const clickedBtnAddCart1 = () => {
  addCartButton1.disabled = true
  addCartButton1.innerText = 'Item added to cart!'
  startNumItem += 1
  cartItemNumber.innerText = startNumItem
}

const clickedBtnAddCart2 = () => {
  addCartButton2.disabled = true
  addCartButton2.innerText = 'Item added to cart!'
  startNumItem += 1
  cartItemNumber.innerText = startNumItem
}

addCartButton1.onclick = clickedBtnAddCart1
addCartButton2.onclick = clickedBtnAddCart2

const Overlay = document.getElementById('overlay')
const Modal = document.getElementById('modal')
const shopCartBtn = document.getElementById('shopCart')
const totalPricedisplay =document.getElementById('list-total')
const item1Price = 0.028
const item2Price = 0.02
let totalPrice = 0

const checkoutCart = () => {
  Overlay.classList.add('is-visible')
  Modal.classList.add('is-visible')

  if (addCartButton1.innerText === 'ITEM ADDED TO CART!') {
    document.getElementById('list-items1').innerText += 'Miniso Marvel Speaker! 0.028BNB'
    totalPrice += item1Price
    totalPricedisplay.innerText = 'Total excluding gas fee = ' 
    totalPricedisplay.innerText += totalPrice 
    totalPricedisplay.innerText += 'BNB'
  }
  if (addCartButton2.innerText === 'ITEM ADDED TO CART!') {
    document.getElementById('list-items2').innerText += 'Craftholic Multipurpose Pouch! 0.02BNB'
    totalPrice += item2Price
    totalPricedisplay.innerText = 'Total excluding gas fee = ' + totalPrice + 'BNB'
  }
}

shopCartBtn.onclick = checkoutCart

document.getElementById('close-btn').addEventListener('click', function () {
  Overlay.classList.remove('is-visible')
  Modal.classList.remove('is-visible')
})

document.getElementById('overlay').addEventListener('click', function () {
  Overlay.classList.remove('is-visible')
  Modal.classList.remove('is-visible')
})
