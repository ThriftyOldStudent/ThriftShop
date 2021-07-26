import { create } from 'ipfs-http-client'
import { encrypt } from 'eth-sig-util'
import { ethers } from 'ethers'
import MetaMaskOnboarding from '@metamask/onboarding'

const TOSS_ABI = [{
  'inputs': [
    { 'internalType': 'uint256[]', 'name': 'tokenIds', 'type': 'uint256[]' },
    { 'internalType': 'string[]', 'name': 'newURI', 'type': 'string[]' },
  ],
  'name': 'buyItem',
  'outputs': [],
  'stateMutability': 'payable',
  'type': 'function',
}, {
  'inputs': [],
  'name': 'getLastID',
  'outputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }],
  'stateMutability': 'view',
  'type': 'function',
}, {
  'inputs': [{ 'internalType': 'uint256', 'name': 'tokenId', 'type': 'uint256' }],
  'name': 'ownerOf',
  'outputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }],
  'stateMutability': 'view',
  'type': 'function',
}]

const Web3 = require('web3')

const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545')
const getAccountsResults = document.getElementById('getAccountsResult')
const contractAdds = '0x5faf7565A930d14657a17605C6E5675b57a6D246'
const TOSadd = '0x8ff4E23dB50407Bf97Eb5acDC4b8E395E6a4dbf9'
const TOSScontract = new web3.eth.Contract(TOSS_ABI, contractAdds)

const currentUrl = new URL(window.location.href)
const forwarderOrigin =
  currentUrl.hostname === 'localhost' ? 'http://localhost:9010' : undefined

const client = create('https://ipfs.infura.io:5001/api/v0')

const rmv1 = document.getElementById('rmv1')
const rmv2 = document.getElementById('rmv2')
const Overlay = document.getElementById('overlay')
const Modal = document.getElementById('modal')
const shopCartBtn = document.getElementById('shopCart')
const listItemPrice1 = document.getElementById('list-items1')
const listItemPrice2 = document.getElementById('list-items2')
const totalPricedisplay = document.getElementById('list-total')
const submitOrder = document.getElementById('order')
const BaseURL = 'https://ipfs.io/ipfs/'
let invoiceURI = ''
let totalPrice
let strID
let strURL
let ItemStatus1 = true
let ItemStatus2 = true

const addCartButton1 = document.getElementById('AddCartButton1')
const addCartButton2 = document.getElementById('AddCartButton2')
const cartItemNumber = document.getElementById('ItemNumber')
let startNumItem = 0

const item1priceSGD = document.getElementById('item1priceSGD')
const item2priceSGD = document.getElementById('item2priceSGD')
const item1priceBNB = document.getElementById('item1priceBNB')
const item2priceBNB = document.getElementById('item2priceBNB')
let item1valBNB
let item2valBNB
let curBNBprice
const BNBws = new WebSocket('wss://stream.binance.com:9443/ws/bnbbusd@kline_15m')

const convertImageToBase64 = (img, outputFormat) => {
  const originalWidth = img.style.width
  const originalHeight = img.style.height

  img.style.width = 'auto'
  img.style.height = 'auto'
  img.crossOrigin = 'Anonymous'

  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height

  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)

  img.style.width = originalWidth
  img.style.height = originalHeight

  ctx.font = '60px Arial'
  ctx.textAlign = 'center'
  ctx.fillStyle = 'blue'
  ctx.fillText('Item Paid!', 160, 80)

  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth() + 1
  const year = today.getFullYear()

  const datestr = `${day} / ${month} / ${year}`
  ctx.fillText(datestr, 160, 160)
  const dataUrl = canvas.toDataURL(outputFormat)

  return dataUrl
}

const convertImageUrlToBase64 = (url, callback, outputFormat) => {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = function () {
    callback(convertImageToBase64(this, outputFormat))
  }
  img.src = url
}

const makeSoldStamp = (stampItemUrl) => {
  convertImageUrlToBase64(stampItemUrl, function (url) {
    const image = new Image()
    image.src = url

    const imageData64 = url.split(',')[1]
    const binary = fixBinary(atob(imageData64))
    const blob = new Blob([binary], { type: 'image/png' })
    console.log('Submitting File to IPFS...')

    try {
      const postresponse = client.add(blob)
      invoiceURI = `${BaseURL}${postresponse.path}`
      console.log('invoiceURI...')
      console.log(invoiceURI)
    } catch (error) {
      console.log('error...')
      console.log(error)
    }
  })
}

const clickedBtnAddCart1 = () => {
  if (addCartButton1.innerText === 'ITEM ADDED TO CART!') {
    ItemStatus1 = true
    addCartButton1.innerText = 'Add to cart!'
    startNumItem -= 1
    cartItemNumber.innerText = startNumItem
    rmv1.classList.add('hideclass')
  } else {
    ItemStatus1 = false
    addCartButton1.innerText = 'Item added to cart!'
    startNumItem += 1
    cartItemNumber.innerText = startNumItem
    rmv1.classList.remove('hideclass')
  }
}

const clickedBtnAddCart2 = () => {
  if (addCartButton2.innerText === 'ITEM ADDED TO CART!') {
    ItemStatus2 = true
    addCartButton2.innerText = 'Add to cart!'
    startNumItem -= 1
    cartItemNumber.innerText = startNumItem
    rmv2.classList.add('hideclass')
  } else {
    ItemStatus2 = false
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
  totalPrice = Number(0.0)

  if (addCartButton1.innerText === 'ITEM ADDED TO CART!') {
    listItemPrice1.innerText = `Miniso Marvel Speaker! ${item1valBNB.toFixed(8)}BNB`
    totalPrice = Number(totalPrice) + Number(item1valBNB.toFixed(8))
    totalPricedisplay.innerText = `Total excluding gas fee = ${totalPrice.toFixed(8)}BNB`
  } else {
    listItemPrice1.innerText = '.'
  }
  if (addCartButton2.innerText === 'ITEM ADDED TO CART!') {
    listItemPrice2.innerText = `Craftholic Multipurpose Pouch! ${item2valBNB.toFixed(8)}BNB`
    totalPrice = Number(totalPrice) + Number(item2valBNB.toFixed(8))
    totalPricedisplay.innerText = `Total excluding gas fee = ${totalPrice.toFixed(8)}BNB`
  } else {
    listItemPrice2.innerText = '.'
  }
  if (((addCartButton2.innerText === 'ITEM ADDED TO CART!') || (addCartButton1.innerText === 'ITEM ADDED TO CART!'))) {
    document.getElementById('checkout').innerText = 'Items to checkout!'
    document.getElementById('buyerdetails').classList.remove('hideclass')
    document.getElementById('notes').classList.remove('hideclass')
  } else {
    document.getElementById('checkout').innerText = 'Nothing to checkout!'
    document.getElementById('buyerdetails').classList.add('hideclass')
    document.getElementById('notes').classList.add('hideclass')
    totalPricedisplay.innerText = '.'
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
  const { length: lengthx } = bin
  const buf = new ArrayBuffer(lengthx)
  const arr = new Uint8Array(buf)
  for (let i = 0; i < lengthx; i++) {
    arr[i] = bin.charCodeAt(i)
  }
  return buf
}
function stringifiableToHex (value) {
  return ethers.utils.hexlify(Buffer.from(JSON.stringify(value)))
}
const formName = document.getElementById('rcvnameid')
const formEmail = document.getElementById('emailid')
const formMail = document.getElementById('mailaddsid')
const formPhone = document.getElementById('phonenumid')

const checkform = () => {
  if ((formName.value === '') || (formEmail.value === '') || (formMail.value === '') || (formPhone.value === '')) {
    submitOrder.disabled = true
  } else {
    submitOrder.disabled = false
  }
}

const runMetamask = () => {
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

      const totalBNB = await totalPrice * (10 ** 18)
      const txHash = await TOSScontract.methods.buyItem(strID, strURL).encodeABI()
      const txO = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          to: contractAdds,
          from: _accounts[0],
          value: web3.utils.toHex(totalBNB),
          data: txHash,
        }],
      }).then((result) => {
        console.log('result')
        console.log(result)
      })
      console.log(txO)
      document.getElementById('notes').innerHTML = 'Receipt Token ID: '
      document.getElementById('notes').innerHTML += `${strID}`
      document.getElementById('notes').innerHTML += '<p>Thank you for your order!</p><p>Contract address: '
      document.getElementById('notes').innerHTML += `${contractAdds}`
      document.getElementById('notes').innerHTML += '</p>'
      submitOrder.disabled = true
      document.getElementById('buyerdetails').classList.add('hideclass')
      if (!ItemStatus1) {
        addCartButton1.innerHTML = 'Item Sold!'
        addCartButton1.disabled = true
      }
      if (!ItemStatus2) {
        addCartButton2.innerHTML = 'Item Sold!'
        addCartButton2.disabled = true
      }
    } catch (error) {
      console.error('error')
      console.error(error)
    }
  }
  const onClickInstall = () => {
    submitOrder.innerText = 'Onboarding in progress'
    submitOrder.disabled = true
    onboarding.startOnboarding()
  }

  const MetaMaskClientCheck = () => {
    if (isMetaMaskInstalled()) {
      onClickConnect()
      submitOrder.disabled = false
    } else {
      submitOrder.innerText = 'Click here to install MetaMask!'
      submitOrder.onclick = onClickInstall
      submitOrder.disabled = false
    }
  }
  MetaMaskClientCheck()
}

const generateReceipt = () => {
  const encryptionKey = 'vfrzmqsvwN3NVqoMprHXCmmgJ1ttR7aTD1Rzvx4dNkg='
  const encryptMessageInput = `${formName.value};${formEmail.value};${formMail.value};${formPhone.value};`

  try {
    document.getElementById('entry.763798046').value = stringifiableToHex(
      encrypt(
        encryptionKey,
        { 'data': encryptMessageInput },
        'x25519-xsalsa20-poly1305',
      ),
    )
    console.log(document.getElementById('entry.763798046').value)
  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
  const form = document.getElementById('hiddenForm')
  form.submit()

  if (!ItemStatus1) {
    addCartButton1.innerText = 'ITEM SOLD!'
    addCartButton1.disabled = true
    makeSoldStamp('https://thriftyoldstudent.github.io/ThriftShop/miniso_marvel_speaker.jpg')
    if (startNumItem === 1) {
      strID = '[1]'
      strURL = `["${invoiceURI}"]`
    } else if (startNumItem > 1) {
      strID = '[1,'
      strURL = `["${invoiceURI}",`
    }
    console.log('strID...')
    console.log(strID)
    console.log('strURL...')
    console.log(strURL)
  }
  invoiceURI = ''
  if (!ItemStatus2) {
    addCartButton2.innerText = 'ITEM SOLD!'
    addCartButton2.disabled = true
    makeSoldStamp('https://thriftyoldstudent.github.io/ThriftShop/craftholic_pouch.jpeg')
    if (startNumItem === 1) {
      strID = '[2]'
      strURL = `["${invoiceURI}"]`
    } else if (startNumItem > 1) {
      strID = '2]'
      strURL = `["${invoiceURI}"]`
    }
    console.log('strID...')
    console.log(strID)
    console.log('strURL...')
    console.log(strURL)
  }
  runMetamask()
}

const textEncrypted = document.getElementById('textEncrypted')
const btnDecrypt = document.getElementById('btnDecrypt')
const textArea = document.getElementById('msg')
const btnDecryptClick = async () => {
  try {
    textArea.innerText = await ethereum.request({
      method: 'eth_decrypt',
      params: [textEncrypted.value, document.getElementById('acc').innerText],
    })
  } catch (error) {
    textArea.innerText = `Error: ${error.message}`
  }
}

const secretClick = async () => {
  await ethereum.request({ method: 'eth_requestAccounts' })
  const _accounts = await ethereum.request({ method: 'eth_accounts' })
  document.getElementById('acc').innerHTML = _accounts[0]
  if (_accounts[0] === TOSadd) {
    document.getElementById('myArea').classList.remove('hideclass')
  }
}

const updatePriceBNB = (event) => {
  console.log(event.data)

  const WSmsgObject = JSON.parse(event.data)
  curBNBprice = WSmsgObject.k.c

  fetch('https://api.exchangerate-api.com/v4/latest/SGD')
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      const newRate = data.rates.USD
      item1valBNB = (parseFloat(item1priceSGD.innerText) * newRate) / curBNBprice
      item2valBNB = (parseFloat(item2priceSGD.innerText) * newRate) / curBNBprice
      item1priceBNB.innerText = item1valBNB.toFixed(8)
      item2priceBNB.innerText = item2valBNB.toFixed(8)
    })
}

const loadItems = async () => {
  const totalItems = await TOSScontract.methods.getLastID().call()
  console.log('totalItems')
  console.log(totalItems)

  for (let i = 0; i < Number(totalItems); i++) {
    const findItemsOwner = await TOSScontract.methods.ownerOf((i + 1)).call()
    console.log(`ownerOf ${i + 1}: `)
    console.log(findItemsOwner)
    if (findItemsOwner === TOSadd) {
      console.log('Item available...')
    } else {
      const addCartButton = document.getElementById(`AddCartButton${i + 1}`)
      addCartButton.innerText = 'Item SOLD!'
      addCartButton.disabled = true
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed')
  submitOrder.onclick = generateReceipt
  formName.onchange = checkform
  formEmail.onchange = checkform
  formMail.onchange = checkform
  formPhone.onchange = checkform
  document.getElementById('myArea').classList.add('hideclass')
  document.getElementById('secret').onclick = secretClick
  btnDecrypt.onclick = btnDecryptClick
  item1valBNB = parseFloat(item1priceSGD.innerText)
  item2valBNB = parseFloat(item2priceSGD.innerText)
  BNBws.onmessage = updatePriceBNB
  loadItems()
})
