import MetaMaskOnboarding from '@metamask/onboarding'
import { create } from 'ipfs-http-client'

const client = create('https://ipfs.infura.io:5001/api/v0')

const GOD_ABI = [{
  inputs: [],
  name: 'buyTokens',
  outputs: [],
  stateMutability: 'payable',
  type: 'function',
}]

const rmv1 = document.getElementById('rmv1')
const rmv2 = document.getElementById('rmv2')
const Overlay = document.getElementById('overlay')
const Modal = document.getElementById('modal')
const shopCartBtn = document.getElementById('shopCart')
const totalPricedisplay = document.getElementById('list-total')
const item1Price = 0.028
const item2Price = 0.02
let totalPrice = 0

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
  if (addCartButton1.innerText === 'ITEM ADDED TO CART!') {
    addCartButton1.innerText = 'Add item to cart!'
    startNumItem -= 1
    cartItemNumber.innerText = startNumItem
    rmv1.classList.add('hideclass')
  } else {
    addCartButton1.innerText = 'Item added to cart!'
    startNumItem += 1
    cartItemNumber.innerText = startNumItem
    rmv1.classList.remove('hideclass')
  }
}

const clickedBtnAddCart2 = () => {
  if (addCartButton2.innerText === 'ITEM ADDED TO CART!') {
    addCartButton2.innerText = 'Add item to cart!'
    startNumItem -= 1
    cartItemNumber.innerText = startNumItem
    rmv2.classList.add('hideclass')
  } else {
    addCartButton2.innerText = 'Item added to cart!'
    startNumItem += 1
    cartItemNumber.innerText = startNumItem
    rmv2.classList.remove('hideclass')
  }
}

addCartButton1.onclick = clickedBtnAddCart1
addCartButton2.onclick = clickedBtnAddCart2

const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop
  if (c > 0) {
    window.scrollTo(0, 0)
  }
}

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
    totalPricedisplay.innerText = 'Total excluding gas fee = '
    totalPricedisplay.innerText += totalPrice
    totalPricedisplay.innerText += 'BNB'
  }
  if (((addCartButton2.innerText === 'ITEM ADDED TO CART!') || (addCartButton1.innerText === 'ITEM ADDED TO CART!'))) {
    document.getElementById('checkout').innerText = 'Items to checkout!'
    document.getElementById('buyerdetails').classList.remove('hideclass')
  } else {
    document.getElementById('checkout').innerText = 'Nothing to checkout!'
    document.getElementById('buyerdetails').classList.add('hideclass')
  }
  scrollToTop()
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

function fixBinary (bin) {
  const length = bin.length
  let buf = new ArrayBuffer(length)
  let arr = new Uint8Array(buf)
  for (let i = 0; i < length; i++) {
    arr[i] = bin.charCodeAt(i)
  }
  return buf
}

window.onload = function () {
  const canvas = document.getElementById('canvas')
  const context = canvas.getContext('2d')
  context.font = '30px Arial'
  context.fillText('Hello World', 10, 50)
  const img64 = canvas.toDataURL('image/png')
  const imageData64 = img64.split(',')[1]
  const binary = fixBinary(atob(imageData64))
  const blob = new Blob([binary], { type: 'image/png' })

  const added = client.add(blob)
  console.log(added)
}
