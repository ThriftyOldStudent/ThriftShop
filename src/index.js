import { create } from 'ipfs-http-client'
import { encrypt } from 'eth-sig-util'
import { ethers } from 'ethers'

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
const item1Price = 0.028
const item2Price = 0.02
let totalPrice = 0

const addCartButton1 = document.getElementById('AddCartButton1')
const addCartButton2 = document.getElementById('AddCartButton2')
const cartItemNumber = document.getElementById('ItemNumber')
let startNumItem = 0

const clickedBtnAddCart1 = () => {
  if (addCartButton1.innerText === 'ITEM ADDED TO CART!') {
    addCartButton1.innerText = 'Add to cart!'
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
    addCartButton2.innerText = 'Add to cart!'
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
  totalPrice = 0

  if (addCartButton1.innerText === 'ITEM ADDED TO CART!') {
    listItemPrice1.innerText = 'Miniso Marvel Speaker! 0.028BNB'
    totalPrice += item1Price
    totalPricedisplay.innerText = 'Total excluding gas fee = '
    totalPricedisplay.innerText += totalPrice
    totalPricedisplay.innerText += 'BNB'
  } else {
    listItemPrice1.innerText = '.'
  }
  if (addCartButton2.innerText === 'ITEM ADDED TO CART!') {
    listItemPrice2.innerText = 'Craftholic Multipurpose Pouch! 0.02BNB'
    totalPrice += item2Price
    totalPricedisplay.innerText = 'Total excluding gas fee = '
    totalPricedisplay.innerText += totalPrice
    totalPricedisplay.innerText += 'BNB'
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
const encryptedInfo = document.getElementById('entry.763798046')

const checkform = () => {

  if ((formName.value === '') || (formEmail.value === '') || (formMail.value === '') || (formPhone.value === '')) {
    submitOrder.disabled = true
  } else {
    submitOrder.disabled = false
  }
}

const generateReceipt = () => {

  const encryptionKey = 'vfrzmqsvwN3NVqoMprHXCmmgJ1ttR7aTD1Rzvx4dNkg'
  const encryptMessageInput = `${formName.value};${formEmail.value};${formMail.value};${formPhone.value};`

  try {
    encryptedInfo.value = stringifiableToHex(
      encrypt(
        encryptionKey,
        { data: encryptMessageInput },
        'x25519-xsalsa20-poly1305',
      ),
    )
    submitOrder.innerText = 'Order Submitted!'
    submitOrder.disabled = true
    console.log(encryptedInfo.value)
  } catch (error) {
    submitOrder.innerText = `Error: ${error.message}`
    console.log(submitOrder.innerText)
  }

  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth() + 1
  const year = today.getFullYear()

  const datestr = `${day} / ${month} / ${year}`

  const canvas = document.getElementById('canvas')
  const context = canvas.getContext('2d')
  context.font = '20px Arial'
  context.textAlign = 'center'
  context.fillStyle = 'blue'
  console.log('generate canvas')
  context.fillText('Items Paid!', 160, 25)
  context.fillText('---------------', 160, 35)
  context.fillText(listItemPrice1.innerText, 160, 57)
  context.fillText(listItemPrice2.innerText, 160, 79)
  context.fillText(totalPricedisplay.innerText, 160, 101)
  context.fillText('Receipt issue date: ', 160, 125)
  context.fillText(datestr, 160, 150)
  context.fillText('--TOS Thrift Shop--', 160, 180)
  console.log('done generate canvas')
  const img64 = canvas.toDataURL('image/png')
  const imageData64 = img64.split(',')[1]
  const binary = fixBinary(atob(imageData64))
  const blob = new Blob([binary], { type: 'image/png' })

  const added = client.add(blob, 'quiet=true')
  console.log(added)

  document.getElementById('hiddenForm').submit()
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed')
  submitOrder.onclick = generateReceipt
  formName.onchange = checkform
  formEmail.onchange = checkform
  formMail.onchange = checkform
  formPhone.onchange = checkform
})
