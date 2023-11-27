let textTop = document.getElementById('lcdTop')
let textBottom = document.getElementById('lcdBottom')

let buttons = document.querySelectorAll('.btn')
let hexButtons = document.querySelectorAll('.hex')
let spclButtons = document.querySelectorAll('.spclbtn')

let reset = document.querySelector('#reset')
let escapeBtn = document.querySelector('#escape')
let backSpace = document.querySelector('#backspace')
let enter = document.querySelector('#enter')
let space = document.querySelector('#space')

console.log("Hola!")
let string = ''
let hexValue = '0000'
let hexAddress = '0000'
let address1 = '0000'
let modeMemory = 1
let modeAddress = 1
let addressList, machineCodeList, machineCodeList1, programAddressList, byte, machineCode, ivMl, retValue, program, nextAddress1, nextAddress2
let memoryActiveStatus = 'inactive'
let addressActiveStaus = 'inactive'
let initialMode, addressLocationList, addressValueList, addressValueListBefore
let one_byte
let two_byte
let three_byte
let memoryLocationList, memoryLocationValue

let initialMod = (function () {
    let done = false
    return function () {
        setTimeout(() => {
            textTop.innerHTML = "8085 SCIENTIFIC"
            textBottom.value = "KIT"
            setTimeout(() => {
                textTop.innerHTML = "MENU: A,D,M,F,"
                textBottom.value = "C,G,R,S,I,E,P"
            }, 1000)
        }, 500)
        done = true
        initialMode = true
        modeMemory = 0
        modeAddress = 0
        addressList = []
        machineCodeList = []
        machineCodeList1 = []
        let n = 0
        memoryLocationList = []
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
        console.log(memoryLocationList)

        memoryLocationValue = []
        n = 0;
        for (let i = 0; i < 65535; i++) {
            n = Math.floor(Math.random() * 256).toString(16)
            if (parseInt(n, 16) < 16) {
                n = n.padStart(2, '0')
            }
            memoryLocationValue.push(n.toUpperCase())
        }
        console.log(memoryLocationValue)

    }
})()

initialMod()

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
let memoryLocationIndex = 0
let memoryLocation

let address_list = []
let address_location_list = []
let address_value_list = []
let machine_code_list = []
let machine_code_list_1 = []
let reg_value = [A, flag, B, C, D, E, H, L, M]
let M_address = reg_value[6] + reg_value[7]
let stack = ["0FFF"]
let stack_value = []
let stack_pointer = "0FFF"
let addressLocation = "0000"

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

function splitAddress(address) {
    console.log("-----Split Address-----")
    console.log(address)
    let higherByte = address.substring(0, 2);
    let lowerByte = address.substring(2);
    console.log(`${higherByte}, ${lowerByte}`)
    return [higherByte.toUpperCase(), lowerByte.toUpperCase()];
}

function byte8085(mnemonic) {
    let t = 0
    console.log(mnemonic)
    let opcode = mnemonic.split(" ")[0]
    console.log(`opcode = ${opcode}`)

    one_byte = ["MOV", "ADD", "CMP", "CMA", "INR", "INX", "DCR", "DCX", "DAD", "LDAX", "STAX", "HLT", "SUB", "XCHG", "ANA", "ORA", "XRA", "RRC", "RLC", "RET", "RC", "RNC", "RP", "RM", "RPE", "RPO", "RZ", "RNZ", "PUSH", "POP"];
    two_byte = ["MVI", "ADI", "ANI", "ORI", "XRI", "ACI", "SUI", "CPI"];
    three_byte = ["LDA", "LXI", "STA", "JMP", "CALL", "CC", "CNC", "CP", "CM", "CPE", "CPO", "CZ", "CNZ", "LHLD", "SHLD", "JC", "JNC", "JZ", "JNZ", "JP", "JM", "JPE", "JPO"];

    if (one_byte.includes(opcode)) {
        t = 1;
        return t;
    } else if (two_byte.includes(opcode)) {
        t = 2;
        return t;
    } else if (three_byte.includes(opcode)) {
        t = 3;
        return t;
    } else {
        console.log("Syntax Error");
        t = "error";
        return t;
    }
}

// not completed... need to add instructions...
function instructionDecoder(mnemonic) {
    console.log("Decoding instruction...");
    let instruction = mnemonic.split(" ")[0];
    console.log(`Mnemonic = ${mnemonic}, Instruction = ${instruction}`);

    let oneByteList = ["MOV", "ADD", "CMP", "CMA", "INR", "INX", "DCR", "DCX", "DAD", "LDAX", "STAX", "HLT", "SUB", "XCHG", "ANA", "ORA", "XRA", "RRC", "RLC", "RET", "RC", "RNC", "RP", "RM", "RPE", "RPO", "RZ", "RNZ", "PUSH", "POP"];
    let twoByteList1 = ["ADI", "ORI", "ACI", "SUI", "CPI", "ANI", "ORI", "XRI"];
    let twoByteList2 = ["MVI"];
    let threeByteList1 = ["LDA", "STA", "JMP", "CALL", "CC", "CNC", "CP", "CM", "CPE", "CPO", "CZ", "CNZ", "LHLD", "SHLD", "JC", "JNC", "JZ", "JNZ", "JP", "JM", "JPE", "JPO"];
    let threeByteList2 = ["LXI"];

    if (oneByteList.includes(instruction)) {
        let byte = "ONE";
        let machineCode;

        // Handle different one-byte instructions
        switch (mnemonic) {
            case "ADD A":
                machineCode = "87";
                break;
            case "ADD B":
                machineCode = "80";
                break;
            // Add more cases for other instructions...

            default:
                console.log("Unknown instruction...");
                return { byte: "Error", machineCode: null, immediateValue: null };
        }

        console.log(`Byte = ${byte}, Machine code = ${machineCode}`);
        retValue = [byte, machineCode, immediateValue = null]
        console.log(retValue)
        return retValue
    } else if (twoByteList1.includes(instruction)) {
        let byte = "TWO";
        let mnemonicParts = mnemonic.split(" ");
        let opcode = mnemonicParts[0];
        let immediateValue = mnemonicParts[1];

        // Handle different two-byte instructions
        let machineCode;
        switch (opcode) {
            case "ADI":
                machineCode = "C6";
                break;
            // Add more cases for other instructions...

            default:
                console.log("Unknown instruction...");
                return { byte: "Error", machineCode: null, immediateValue: null };
        }

        console.log(`Byte = ${byte}, Machine code = ${machineCode}, Immediate value = ${immediateValue}`)
        retValue = [byte, machineCode, immediateValue]
        console.log(retValue)
        return retValue
    } else if (twoByteList2.includes(instruction)) {
        let byte = "TWO";
        let mnemonicParts = mnemonic.split(",");
        let opcode = mnemonicParts[0];
        let immediateValue = mnemonicParts[1];

        // Handle different two-byte instructions
        let machineCode;
        switch (opcode) {
            case "MVI A":
                machineCode = "3E";
                break;
            // Add more cases for other instructions...

            default:
                console.log("Unknown instruction...");
                return { byte: "Error", machineCode: null, immediateValue: null };
        }

        console.log(`Byte = ${byte}, Machine code = ${machineCode}, Immediate value = ${immediateValue}`);
        retValue = [byte, machineCode, immediateValue]
        console.log(retValue)
        return retValue
    } else if (threeByteList1.includes(instruction)) {
        let byte = "THREE";
        let mnemonicParts = mnemonic.split(" ");
        let opcode = mnemonicParts[0];
        let memoryLocation = mnemonicParts[1];

        // Handle different three-byte instructions
        let machineCode;
        switch (opcode) {
            case "CALL":
                machineCode = "CD";
                break;
            // Add more cases for other instructions...

            default:
                console.log("Unknown instruction...");
                return { byte: "Error", machineCode: null, immediateValue: null };
        }

        console.log(`Byte = ${byte}, Machine code = ${machineCode}, Memory location = ${memoryLocation}`)
        retValue = [byte, machineCode, memoryLocation]
        console.log(retValue)
        return retValue
    } else if (threeByteList2.includes(instruction)) {
        let byte = "THREE";
        let mnemonicParts = mnemonic.split(",");
        let opcode = mnemonicParts[0];
        let memoryLocation = mnemonicParts[1];

        // Handle different three-byte instructions
        let machineCode;
        switch (opcode) {
            case "LXI B":
                machineCode = "01";
                break;
            // Add more cases for other instructions...

            default:
                console.log("Unknown instruction...");
                return { byte: "Error", machineCode: null, immediateValue: null };
        }

        console.log(`Byte = ${byte}, Machine code = ${machineCode}, Memory location = ${memoryLocation}`)
        retValue = [byte, machineCode, memoryLocation]
        console.log(retValue)
        return retValue
    } else {
        console.log("Unknown instruction...");
        return { byte: "Error", machineCode: null, immediateValue: null };
    }
}

function MNToMC(address1, mnemonic) {
    console.log("Converting to Machine Code...")
    byte, machineCode, ivMl
    retValue = instructionDecoder(mnemonic); // ivMl means immediateValue or memoryLocation
    console.log(retValue)
    byte = retValue[0]
    machineCode = retValue[1]
    ivMl = retValue[2]
    console.log(ivMl)
    if (byte === "ONE") {
        machineCode = fillZero(machineCode);
        addressList.push(`${address1}`);
        machineCodeList.push(machineCode);
        machineCodeList1.push(machineCode);
        let memoryLocationIndex = memoryLocationList.indexOf(address1);
        memoryLocationValue[memoryLocationIndex] = machineCode;
        return [machineCode, null, null];
    } else if (byte === "TWO") {
        machineCode = fillZero(machineCode);
        addressList.push(`${address1}`);
        machineCodeList.push(machineCode);
        machineCodeList1.push(machineCode);
        let memoryLocationIndex = memoryLocationList.indexOf(address1);
        memoryLocationValue[memoryLocationIndex] = machineCode;
        let immediateValue = parseInt(ivMl, 16).toString(16);
        let filledImmediateValue = fillZero(immediateValue);
        address1 = (parseInt(address1, 16) + 1).toString(16).toUpperCase().padStart(4, '0')
        addressList.push(`${address1}`);
        machineCodeList.push(filledImmediateValue);
        machineCodeList1.push(filledImmediateValue);
        let immediateMemoryLocationIndex = memoryLocationList.indexOf(address1);
        memoryLocationValue[immediateMemoryLocationIndex] = filledImmediateValue;
        return [machineCode, filledImmediateValue, null];
    } else if (byte === "THREE") {
        machineCode = fillZero(machineCode);
        addressList.push(`${address1}`);
        let memoryLocationIndex = memoryLocationList.indexOf(address1);
        memoryLocationValue[memoryLocationIndex] = machineCode;
        machineCodeList.push(machineCode);
        machineCodeList1.push(machineCode);
        let memoryLocation = ivMl
        console.log(ivMl)
        console.log(memoryLocation)
        let addressByte = splitAddress(memoryLocation);
        console.log(addressByte)
        higherByte = addressByte[0]
        lowerByte = addressByte[1]
        let filledLowerByte = fillZero(parseInt(lowerByte, 16).toString(16));
        let filledHigherByte = fillZero(parseInt(higherByte, 16).toString(16));
        machineCodeList.push(filledLowerByte);
        machineCodeList1.push(filledLowerByte);
        address1 = (parseInt(address1, 16) + 1).toString(16).toUpperCase().padStart(4, '0')
        addressList.push(`${address1}`)
        let lowerByteMemoryLocationIndex = memoryLocationList.indexOf(address1);
        memoryLocationValue[lowerByteMemoryLocationIndex] = filledLowerByte;
        address1 = (parseInt(address1, 16) + 1).toString(16).toUpperCase().padStart(4, '0')
        addressList.push(`${address1}`);
        machineCodeList.push(filledHigherByte);
        machineCodeList1.push(filledHigherByte);
        let higherByteMemoryLocationIndex = memoryLocationList.indexOf(address1);
        memoryLocationValue[higherByteMemoryLocationIndex] = filledHigherByte;
        let retValue = [machineCode, filledLowerByte, filledHigherByte];
        console.log(retValue)
        return retValue
    } else if (byte === null) {
        return [machineCode, null, null];
    }
}

function memory8085() {
    memoryActiveStatus = 'active'

    console.log("-----MEMORY/EDIT-----")
    console.log("If you want to change the value, type the desired value. Otherwise hit enter.")
    memoryFunc = 'active'

    let addressLocationList = []
    let addressValueList = []
    let addressValueListBefore = []

    modeMemory = 0
    textBottom.value = "Address: " + hexValue
    let addressPlace = textBottom.value
    addressLocation = addressPlace.split(": ")[1]
    addressLocation = (parseInt(addressLocation, 16)).toString(16).padStart(4, '0')
    memoryLocationIndex = memoryLocationList.indexOf(addressLocation)
    addressValue = memoryLocationValue[memoryLocationIndex]

    enter.addEventListener('click', enterMemory = () => {
        modeMemory = 1
        console.log("-                  -")
        if (initialMode === false && addressActiveStaus !== 'active') {
            addressLocation = hexValue
            console.log(`hexValue = ${hexValue}`)
            memoryLocationIndex = memoryLocationList.indexOf(addressLocation)
            let addressValue = memoryLocationValue[memoryLocationIndex]
            let newValue = addressValue
            let l = string.length
            console.log(addressValue)
            console.log(string.length)
            if (l !== 0) {
                newValue = string
                string = ''
            }
            console.log(`string = ${string}`)
            console.log(`currentValue = ${addressValue}`)
            console.log(`newValue = ${newValue}`)

            if (addressValue === newValue) {
                addressValue = memoryLocationValue[memoryLocationIndex]
                console.log(`Same Value: ${addressValue}`)
                addressValue = (parseInt(addressValue, 16)).toString(16).toUpperCase().padStart(2, '0')
                addressValueListBefore.push(memoryLocationValue[memoryLocationIndex])
                if (addressLocationList.includes(addressLocation)) {
                    let addressLocationIndex = addressLocationList.indexOf(addressLocation);
                    addressValueList[addressLocationIndex] = addressValue;
                } else {
                    addressValueList.push(addressValue);
                    addressLocationList.push(addressLocation);
                }
            } else {
                addressValue = newValue
                console.log(`New Value: ${addressValue}`)
                addressValueList.pop()
                addressLocationList.pop()
                addressValueListBefore.pop()
                hexValue = (parseInt(hexValue, 16) - 1).toString(16).toUpperCase().padStart(4, '0')
                addressLocation = hexValue
                memoryLocationIndex = memoryLocationList.indexOf(addressLocation)
                addressValueListBefore.push(memoryLocationValue[memoryLocationIndex])
                if (addressLocationList.includes(addressLocation)) {
                    let addressLocationIndex = addressLocationList.indexOf(addressLocation);
                    addressValueList[addressLocationIndex] = addressValue;
                } else {
                    addressValueList.push(addressValue);
                    addressLocationList.push(addressLocation);
                }
            }

            textBottom.value = `${addressLocation}: ${addressValue}`
            console.log(`Address location list = [${addressLocationList}]`)
            console.log(`Address value list before = [${addressValueListBefore}]`)
            console.log(`Address value list after = [${addressValueList}]`)

            hexValue = (parseInt(hexValue, 16) + 1).toString(16).toUpperCase().padStart(4, '0')
        }
    })
    escapeBtn.addEventListener('click', escapeMemory = () => {
        if (initialMode === false && memoryActiveStatus === 'active') {
            textTop.innerHTML = "MENU: A,D,M,F,"
            textBottom.value = "C,G,R,S,I,E,P"
            console.log(`Address location list = [${addressLocationList}]`)
            console.log(`Address value list before = [${addressValueListBefore}]`)
            console.log(`Address value list after = [${addressValueList}]`)
            console.log(string)

            for (let address of addressLocationList) {
                let m = addressLocationList.indexOf(address)
                let addressValue = addressValueList[m]
                addressValue = fillZero(addressValue)
                memoryLocationIndex = memoryLocationList.indexOf(address)
                memoryLocationValue[memoryLocationIndex] = addressValue
            }
            console.log("Done!")
            initialMode = true
            memoryActiveStatus = 'inactive'
            hexValue = '0000'
            addressValueListBefore = []
        }
    })
}

function address8085() {
    addressActiveStaus = 'active'

    console.log("-----ADDRESS-----")
    addressFunc = 'active'

    let byte1
    let programAddressList = []
    let program = []
    modeAddress = 0
    textBottom.value = "Address: " + hexValue
    let addressPlace = textBottom.value
    addressLocation = addressPlace.split(": ")[1]
    addressLocation = (parseInt(addressLocation, 16)).toString(16).padStart(4, '0')

    enter.addEventListener('click', enterAddress = () => {
        if (initialMode === false && memoryActiveStatus !== 'active') {
            textBottom.value = ''
            modeAddress = 1
            textTop.innerHTML = `${address1}:`
            textBottom.value += `${string}`
            string = ''
            mnemonic = textBottom.value
            console.log(mnemonic)

            byte1 = byte8085(mnemonic)
            if (byte1 !== "error") {
                console.log(address1)
                programAddressList.push(address1);
                program.push(`${address1}:${mnemonic}`);
                let retValue = MNToMC(address1, mnemonic);
                console.log(retValue)
                machineCode = retValue[0]
                nextAddress1 = retValue[1]
                nextAddress2 = retValue[2]
                if (nextAddress1 === null && nextAddress2 === null) {
                    console.log(`Machine Code : ${machineCode}`)
                    textTop.innerHTML = `${address1}: ${machineCode}`
                    textBottom.value = ''
                } else if (nextAddress2 === null) {
                    console.log(`Machine Code : ${machineCode}:${nextAddress1}`)
                    textTop.innerHTML = `${address1}: ${machineCode}:${nextAddress1}`
                    textBottom.value = ''
                } else {
                    console.log(`Machine Code : ${machineCode}:${nextAddress1}:${nextAddress2}`)
                    textTop.innerHTML = `${address1}: ${machineCode}:${nextAddress1}:${nextAddress2}`
                    textBottom.value = ''
                }
            }
            console.log(`byte: ${byte1}, ${byte}`)
            if (byte1 === 1) {
                address1 = (parseInt(address1, 16) + parseInt("1", 16)).toString(16).toUpperCase().padStart(4, '0')
            } else if (byte1 === 2) {
                address1 = (parseInt(address1, 16) + parseInt("2", 16)).toString(16).toUpperCase().padStart(4, '0')
            } else if (byte1 === 3) {
                address1 = (parseInt(address1, 16) + parseInt("3", 16)).toString(16).toUpperCase().padStart(4, '0')
            }
            string = ''
        }
    })
    escapeBtn.addEventListener('click', escapeAddress = () => {
        if (initialMode === false && memoryActiveStatus !== 'active') {
            textTop.innerHTML = "MENU: A,D,M,F,"
            textBottom.value = "C,G,R,S,I,E,P"
            console.log(`Program = [${program}]`)
            console.log(`Address list = [${addressList}]`)
            console.log(`Machine code list = [${machineCodeList}]`)
            console.log(`Machine code list 01 = [${machineCodeList1}]`)
            console.log(`Program address list = [${programAddressList}]`)
            initialMode = true
            addressActiveStaus = 'inactive'
        }
    })

}

function execute8085() {

}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

reset.addEventListener('click', () => {
    setTimeout(() => {
        initialMode = true
        textTop.innerHTML = "8085 SCIENTIFIC"
        textBottom.value = "KIT"
        setTimeout(() => {
            textTop.innerHTML = "MENU: A,D,M,F,"
            textBottom.value = "C,G,R,S,I,E,P"
        }, 1000)
    }, 500)
})

buttons.forEach(btn => {
    btn.addEventListener('click', buttonFunc = () => {
        if (modeAddress === 0 && initialMode === false && memoryActiveStatus !== 'active') {
            if (hexValue.length >= 3 && btn.innerHTML !== 'Enter') {
                hexValue += btn.innerHTML
                hexValue = hexValue.slice(1)
                textBottom.value = `ADDRESS: ${hexValue}`
            } else if (btn.innerHTML === 'Enter') {
                textBottom.value = `ADDRESS: ${hexValue}`
            } else {
                hexValue += btn.innerHTML
                hexValue = hexValue.padStart(4, '0')
                textBottom.value = `ADDRESS: ${hexValue}`
            }
        }
        else if (modeAddress === 1 && initialMode === false) {
            if (btn.innerHTML === 'Backspace') {
                string = string.substring(0, string.length - 1)
                textBottom.value = `${string}`
            } else if (btn.innerHTML === 'Space') {
                string += ' '
                textBottom.value = `${string}`
            } else if (btn.innerHTML === 'Enter') {
                console.log(`string: ${string}`)
            } else {
                string += btn.innerHTML
                textTop.innerHTML = `${address1}:`
                textBottom.value = `${string}`
            }
        }
    })
})

hexButtons.forEach(hex => {
    hex.addEventListener('click', hexFunc = () => {
        if (modeMemory === 0 && initialMode === false && memoryActiveStatus === 'active') {
            if (hexValue.length > 3 && hex.innerHTML !== 'Enter') {
                hexValue += hex.innerHTML
                hexValue = hexValue.slice(1)
                textBottom.value = `M_ADDRESS: ${hexValue}`
            } else if (hex.innerHTML === 'Enter') {
                textBottom.value = `M_ADDRESS: ${hexValue}`
            } else {
                hexValue += hex.innerHTML
                hexValue = hexValue.padStart(4, '0')
                textBottom.value = `M_ADDRESS: ${hexValue}`
            }
        } else if (modeMemory === 1 && initialMode === false && memoryActiveStatus === 'active') {
            if (string.length > 1 && hex.innerHTML !== 'Enter') {
                string += hex.innerHTML
                string = string.slice(1)
                addressValue = string
                textBottom.value = `${addressLocation}: ${addressValue}`
            } else if (hex.innerHTML === 'Enter') {
                if (string !== '') {
                    addressValue = string
                    console.log(`${addressLocation}: ${addressValue}`)
                    textBottom.value = `${addressLocation}: ${addressValue}`
                } else {
                    console.log(`${addressLocation}: ${addressValue}`)
                    textBottom.value = `${addressLocation}: ${addressValue}`
                }
            } else {
                string += hex.innerHTML
                string = string.padStart(2, '0')
                addressValue = string
                textBottom.value = `${addressLocation}: ${addressValue}`
            }
        }
    })
})

spclButtons.forEach(spclbtn => {
    spclbtn.addEventListener('click', spclFunc = () => {
        if (spclbtn.innerHTML === 'M' && initialMode === true) {
            initialMode = false
            textTop.innerHTML = "MEMORY/EDIT"
            textBottom.value = "ADDRESS: 0000"
            memory8085()
        } else if (spclbtn.innerHTML === 'A' && initialMode === true) {
            initialMode = false
            textTop.innerHTML = "ASSEMBLER"
            textBottom.value = "ADDRESS: 0000"
            address8085()
        } else if (spclbtn.innerHTML === 'G' && initialMode === true) {
            initialMode = false
            execute8085()
        }
    })
})
