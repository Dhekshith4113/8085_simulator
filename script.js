const textTop = document.getElementById('lcdTop')
const textBottom = document.getElementById('lcdBottom')

const buttons = document.querySelectorAll('.btn')
const hexButtons = document.querySelectorAll('.hex')
const spclButtons = document.querySelectorAll('.spclbtn')

const escapeBtn = document.querySelector('#escape')
const backSpace = document.querySelector('#backspace')
const enter = document.querySelector('#enter')
const space = document.querySelector('#space')

textTop.innerHTML = "MENU: A,D,M,F,"
textBottom.value = "C,G,R,S,I,E,P"

let string = ''
let hexValue = '0000'
let hexAddress = "0000"
let mode = 0

let A = "0"
let flag = [0, 0, 0, 0, 0, 0, 0, 0]
let B = "0"
let C = "0"
let D = "0"
let E = "0"
let H = "FF"
let L = "FF"
let M = "0"
let reg_list = ["A", "flag", "B", "C", "D", "E", "H", "L", "M"]

let addressValue = 0
let addressLocationList = []
let addressValueList = []
let addressValueListBefore = []
let memoryLocationIndex = 0

let address_list = []
let address_location_list = []
let address_value_list = []
let machine_code_list = []
let machine_code_list_1 = []
let reg_value = [A, flag, B, C, D, E, H, L, M]
let M_address = reg_value[6] + reg_value[7]
let program = []
let stack = ["0FFF"]
let stack_value = []
let stack_pointer = "0FFF"
let addressLocation = "0000"
let programAddressList = []

let n = 0
const memoryLocationList = []
for (let i = 0; i < 65535; i++) {
    if (parseInt(n, 16) < 16) {
        n = n.toString(16).padStart(4, '0')
    } else if (parseInt(n, 16) < 255) {
        n = n.toString(16).padStart(4, '0')
    } else if (parseInt(n, 16) < 4095) {
        n = n.toString(16).padStart(4, '0')
    }
    n = n.toString(16)
    memoryLocationList.push(n.toUpperCase())
    n = parseInt(n, 16) + 1
}
// console.log(`Memory Location List = ${memoryLocationList}`)
console.log(memoryLocationList)

let memoryLocationValue = []
n = 0;
for (let i = 0; i < 65535; i++) {
    n = Math.floor(Math.random() * 256).toString(16)
    if (parseInt(n, 16) < 16) {
        n = n.padStart(2, '0')
    }
    memoryLocationValue.push(n.toUpperCase())
}
// console.log(`Memory Location Value = ${memoryLocationValue}`)
console.log(memoryLocationValue)

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

function fillZero(regName) {
    if (regName === null) {
        return regName;
    } else {
        if (regName.length === 1) {
            regName = regName.toString().padStart(2, '0');
            return regName.toUpperCase();
        } else if (regName.length === 3) {
            regName = regName.toString().padStart(4, '0');
            return regName.toUpperCase();
        } else {
            return regName.toUpperCase();
        }
    }
}

function memory8085() {
    spclButtons.forEach(spclbtn => { spclbtn.removeEventListener('click', spclFunc) })
    buttons.forEach(btn => { btn.removeEventListener('click', buttonFunc) })

    console.log("-----MEMORY/EDIT-----")
    console.log("If you want to change the value, type the desired value. Otherwise hit enter.")

    let addressLocationList = []
    let addressValueList = []
    let addressValueListBefore = []

    mode = 0
    textBottom.value = "Address: " + hexValue
    let address = textBottom.value
    addressLocation = address.split(": ")[1]
    addressLocation = (parseInt(addressLocation, 16)).toString(16).padStart(4, '0')
    memoryLocationIndex = memoryLocationList.indexOf(addressLocation)
    addressValue = memoryLocationValue[memoryLocationIndex]

    enter.addEventListener('click', () => {
        mode = 1
        addressLocation = hexValue
        memoryLocationIndex = memoryLocationList.indexOf(addressLocation)
        addressValueListBefore.push(memoryLocationValue[memoryLocationIndex])
        let currentValue = memoryLocationValue[memoryLocationIndex]
        let newValue = currentValue
        let l = string.length
        if (string !== '') {
            newValue = string.slice(l-2)
            string = ''
        }
        console.log(`currentValue = ${currentValue}`)
        console.log(`newValue = ${newValue}`)
        console.log("///////////////////////////////////")

        if (currentValue === newValue) {
            addressValue = currentValue
            addressValue = memoryLocationValue[memoryLocationIndex]
            console.log(`Same Value: ${addressValue}`)
        } else {
            addressValue = newValue
            // memoryLocationValue[memoryLocationIndex] = addressValue
            console.log(`New Value: ${addressValue}`)
            // newValue = currentValue
            // addressValue = currentValue
        }
    
        addressValue = (parseInt(addressValue, 16)).toString(16)
        addressValue = fillZero(addressValue)

        if (addressLocationList.includes(addressLocation)) {
            let addressLocationIndex = addressLocationList.indexOf(addressLocation)
            addressValueList[addressLocationIndex] = addressValue
            console.log("If Activated!")
        } else {
            addressValueList.push(addressValue)
            addressLocationList.push(addressLocation)
            console.log("Else Activated!")
        }

        textBottom.value = `${addressLocation}: ${addressValue}`
        console.log(`Address location list = [${addressLocationList}]`)
        console.log(`Address value list before = [${addressValueListBefore}]`)
        console.log(`Address value list after = [${addressValueList}]`)

        hexValue = (parseInt(hexValue, 16) + 1).toString(16).toUpperCase().padStart(4, '0')
    })
    escapeBtn.addEventListener('click', () => {
        textTop.innerHTML = "MENU: A,D,M,F,"
        textBottom.value = "C,G,R,S,I,E,P"
        console.log(`Address location list = [${addressLocationList}]`)
        console.log(`Address value list before = [${addressValueListBefore}]`)
        console.log(`Address value list after = [${addressValueList}]`)
        spclButtons.forEach(spclbtn => { spclbtn.addEventListener('click', spclFunc) })
        buttons.forEach(btn => { btn.addEventListener('click', buttonFunc) })

        for (const address of addressLocationList) {
            let m = addressLocationList.indexOf(address)
            let addressValue = addressValueList[m]
            addressValue = fillZero(addressValue)
            memoryLocationIndex = memoryLocationList.indexOf(address)
            memoryLocationValue[memoryLocationIndex] = addressValue
            console.log("Done!")
        }
    })
}

function address8085() {
    spclButtons.forEach(spclbtn => { spclbtn.removeEventListener('click', spclFunc) })
    hexButtons.forEach(hex => { hex.removeEventListener('click', hexFunc) })
    textTop.innerHTML = "ENTER STARTING"
    textBottom.value = "ADDRESS: 0000"
}

function execute8085() {

}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

buttons.forEach(btn => {
    btn.addEventListener('click', buttonFunc = () => {
        if (btn.innerHTML === 'Backspace') {
            string = string.substring(0, string.length - 1)
            textBottom.value = string
        } else if (btn.innerHTML === 'Space') {
            string += ' '
            textBottom.value = string
        } else if (btn.innerHTML === 'Enter') {
            console.log(string)
        } else {
            string += btn.innerHTML
            textBottom.value = string
        }
    })
})

hexButtons.forEach(hex => {
    hex.addEventListener('click', hexFunc = () => {
        if (mode === 0) {
            if (hexValue.length >= 3 && hex.innerHTML !== 'Enter' && buttons.innerHTML !== 'Esc') {
                hexValue += hex.innerHTML
                hexValue = hexValue.slice(1)
                textBottom.value = `ADDRESS: ${hexValue}`
            } else if (hex.innerHTML === 'Enter') {
                textBottom.value = `ADDRESS: ${hexValue}`
            } else if (hex.innerHTML !== 'Enter' && buttons.innerHTML !== 'Esc') {
                hexValue += hex.innerHTML
                hexValue = hexValue.padStart(4, '0')
                textBottom.value = `ADDRESS: ${hexValue}`
            }
        } else if (mode === 1) {
            if (addressValue.length > 1 && hex.innerHTML !== 'Enter' && buttons.innerHTML !== 'Esc') {
                addressValue += hex.innerHTML
                addressValue = addressValue.slice(1)
                textBottom.value = `${addressLocation}: ${addressValue}`
            } else if (hex.innerHTML === 'Enter') {
                textBottom.value = `${addressLocation}: ${addressValue}`
            } else {
                addressValue += hex.innerHTML
                addressValue = addressValue.padStart(4, '0')
                textBottom.value = `ADDRESS: ${addressValue}`
            }
        }
    })
})

spclButtons.forEach(spclbtn => {
    spclbtn.addEventListener('click', spclFunc = () => {
        if (spclbtn.innerHTML === 'M') {
            string = ''
            hexValue = '0000'
            textTop.innerHTML = "  MEMORY/EDIT  "
            textBottom.value = "Address: 0000"
            memory8085()
        } else if (spclbtn.innerHTML === 'A') {
            string = ''
            address8085()
        } else if (spclbtn.innerHTML === 'G') {
            string = ''
            execute8085()
        }
    })
})
