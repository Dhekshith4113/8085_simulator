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
let addressList, machineCodeList, machineCodeList1, programAddressList, byte, machineCode, ivMl, retValue, nextAddress1, nextAddress2
let memoryActiveStatus = 'inactive'
let addressActiveStaus = 'inactive'
let executeActiveStatus = 'inactive'
let initialMode, addressLocationList, addressValueList, addressValueListBefore, p_c, ret_address, program_1, startAddress
let program = []
let one_byte, mnemonic
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
        modeExecute = 0
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

let A = "3"
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

function ADD(mnemonic) {
    console.log("\n-----ADD-----");
    console.log(mnemonic)
    let mnemonicParts = mnemonic.split(" ");
    let reg_1 = mnemonicParts[1];
    console.log(reg_1)
    reg_1 = reg_list.indexOf(reg_1);
    
    if (reg_1 === "M") {
        memory_address_M(1);
    }

    reg_value[0] = (parseInt(reg_value[0], 16) + parseInt(reg_value[reg_1], 16)).toString(16).toUpperCase().padStart(2, '0')
    console.log(reg_value[0])
    if (parseInt(reg_value[0], 16) > 255) {
        check_accumulator();
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt("100", 16)).toString(16).toUpperCase().padStart(2, '0')
    }

    reg_value[0] = fillZero(reg_value[0]);
    console.log(`[A] = ${reg_value[0]}`);
}

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
            case "HLT":
                machineCode = "76";
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
                let addressLocationIndex = addressLocationList.indexOf(addressLocation);
                if (addressLocationIndex !== -1) {
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
                let addressLocationIndex = addressLocationList.indexOf(addressLocation);
                if (addressLocationIndex !== -1) {
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

            // for (let address of addressLocationList) {
            //     let m = addressLocationList.indexOf(address)
            //     let addressValue = addressValueList[m]
            //     addressValue = fillZero(addressValue)
            //     memoryLocationIndex = memoryLocationList.indexOf(address)
            //     memoryLocationValue[memoryLocationIndex] = addressValue
            // }

            for (let i = 0; i < addressLocationList.length; i++) {
                let address = addressLocationList[i]
                let m = addressLocationList.indexOf(address)
                let addressValue = addressValueList[m]
                addressValue = fillZero(addressValue)

                let memoryLocationIndex = memoryLocationList.indexOf(address)
                memoryLocationValue[memoryLocationIndex] = addressValue
            }
            console.log("Done!")
            initialMode = true
            modeMemory = 0
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
    modeAddress = 0
    textBottom.value = "Address: " + hexValue
    let addressPlace = textBottom.value
    addressLocation = addressPlace.split(": ")[1]
    addressLocation = (parseInt(addressLocation, 16)).toString(16).padStart(4, '0')

    enter.addEventListener('click', enterAddress = () => {
        if (initialMode === false && memoryActiveStatus !== 'active' && executeActiveStatus !== 'active') {
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
            modeAddress = 0
            addressActiveStaus = 'inactive'
        }
    })
}

// Not complete...
function instructionEncoder(machineCode) {
    console.log("Encoding Instruction...");
    console.log(`Machine code = ${machineCode}`);
    
    const oneByteList = ["00", "80", "81", "82", "83", "84", "85", "86", "87", "AO", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "2F", "B8", "B9", "BA", "BB", "BC", "BD", "BE", "BF", "09", "19", "29", "39", "05", "0D", "15", "1D", "25", "2D", "35", "3D", "0B", "1B", "2B", "3B", "76", "04", "0C", "14", "1C", "24", "2C", "34", "3C", "03", "13", "23", "33", "0A", "1A", "78", "79", "7A", "7B", "7C", "7D", "7E", "7F", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4A", "4B", "4C", "4D", "4E", "4F", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5A", "5B" ,"5C", "5D", "5E", "5F", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6A", "6B", "6C", "6D", "6E", "6F", "70", "71", "72", "73", "74", "75", "76", "77", "07", "0F", "B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "02", "12", "90", "91", "92", "93", "94", "95", "96", "97", "EB", "A8", "A9", "AA", "AB", "AC", "AD", "AE", "AF", "C9", "D8", "F8", "C0", "D0", "F0", "E8", "E0", "C8", "C1", "C5", "D1", "D5", "E1", "E5", "F1", "F5"];
    const twoByteList1 = ["C6", "D6", "E6", "F6", "EE", "FE"];
    const twoByteList2 = ["06", "0E", "16", "1E", "26", "2E", "36", "3E"];
    const threeByteList1 = ["22", "2A", "32", "3A", "C2", "C3", "CA", "CD", "DC", "FC", "D4", "C4", "CC" ,"F4", "EC", "FE", "E4", "D2", "DA", "E2", "EA", "F2", "FA"];
    const threeByteList2 = ["01", "11", "21", "31"];

    if (oneByteList.includes(machineCode)) {
        const byte = "ONE";
        let opcode;

        switch (machineCode) {
            case "87": opcode = "ADD A"; break;
            case "80": opcode = "ADD B"; break;
            case "81": opcode = "ADD C"; break;
            case "76": opcode = "HLT"; break;
            // ... (similar switch cases for other opcodes)
            default: break;
        }

        return [byte, opcode];
    } else if (twoByteList1.includes(machineCode)) {
        const byte = "TWO_1";
        let opcode;

        switch (machineCode) {
            case "C6": opcode = "ADI"; break;
            case "E6": opcode = "ANI"; break;
            // ... (similar switch cases for other opcodes)
            default: break;
        }

        return [byte, opcode];
    } else if (twoByteList2.includes(machineCode)) {
        const byte = "TWO_2";
        let opcode;

        switch (machineCode) {
            case "3E": opcode = "MVI A"; break;
            case "06": opcode = "MVI B"; break;
            // ... (similar switch cases for other opcodes)
            default: break;
        }

        return [byte, opcode];
    } else if (threeByteList1.includes(machineCode)) {
        const byte = "THREE_1";
        let opcode;

        switch (machineCode) {
            case "CD": opcode = "CALL"; break;
            case "22": opcode = "LHLD"; break;
            // ... (similar switch cases for other opcodes)
            default: break;
        }

        return [byte, opcode];
    } else if (threeByteList2.includes(machineCode)) {
        const byte = "THREE_2";
        let opcode;

        switch (machineCode) {
            case "01": opcode = "LXI B"; break;
            case "11": opcode = "LXI D"; break;
            // ... (similar switch cases for other opcodes)
            default: break;
        }

        return [byte, opcode];
    } else {
        const byte = null;
        const opcode = null;
        return [byte, opcode];
    }
}

function MC_to_MN(startAddress) {
    console.log("Converting to Mnemonic...");
    let addressList = []
    let programCount = 0
    let address = parseInt(startAddress, 16).toString(16).toUpperCase().padStart(4, '0')
    console.log(address)

    while (programCount < program_1.length) {
        programCount += 1;
        address = parseInt(address, 16).toString(16).toUpperCase().padStart(4, '0')
        let addressIndex = memoryLocationList.indexOf(address);
        let machineCode = memoryLocationValue[addressIndex]
        console.log(machineCode)
        let machineCodeHex = fillZero(machineCode).toUpperCase();
        console.log(`Machine code = ${machineCodeHex}`);
        
        let [byte, mnemonicOpcode] = instructionEncoder(machineCodeHex);

        if (byte === "ONE") {
            addressList.push(address);
            console.log(`${address}:${mnemonicOpcode}`);
            program.push(`${address}:${mnemonicOpcode}`);
            address = (parseInt(address, 16) + 1).toString(16).toUpperCase().padStart(4, '0')
        } else if (byte === "TWO_1") {
            addressList.push(address);
            let machineCodeValue = memoryLocationValue[parseInt(address, 16)];
            let mnemonic = `${mnemonicOpcode} ${machineCodeValue.toString().padStart(2, '0')}`;
            console.log(`${address}:${mnemonic}`);
            program.push(`${address}:${mnemonic}`);
            address = (parseInt(address, 16) + 1).toString(16).toUpperCase().padStart(4, '0');
            addressList.push(address.slice(2));
            address = (parseInt(address, 16) + 1).toString(16).toUpperCase().padStart(4, '0')
        } else if (byte === "TWO_2") {
            addressList.push(address);
            let machineCodeValue = memoryLocationValue[parseInt(address, 16)];
            let mnemonic = `${mnemonicOpcode},${machineCodeValue.toString().padStart(2, '0')}`;
            console.log(`${address}:${mnemonic}`);
            program.push(`${address}:${mnemonic}`);
            address = (parseInt(address, 16) + 1).toString(16).toUpperCase().padStart(4, '0')
            addressList.push(address.slice(2));
            address = (parseInt(address, 16) + 1).toString(16).toUpperCase().padStart(4, '0')
        } else if (byte === "THREE_1") {
            let address1 = address;
            addressList.push(address);
            address = (parseInt(address, 16) + 2).toString(16).toUpperCase().padStart(4, '0')
            let machineCode1 = memoryLocationValue[parseInt(address, 16) - 1];
            let machineCodeHex1 = fillZero(machineCode1).toUpperCase();
            let mnemonic1 = machineCodeHex1.padStart(2, '0');
            addressList.push(address);
            address = (parseInt(address, 16) - 1).toString(16).toUpperCase().padStart(4, '0')
            let machineCode2 = memoryLocationValue[parseInt(address, 16) - 1];
            let machineCodeHex2 = fillZero(machineCode2).toUpperCase();
            let mnemonic2 = machineCodeHex2.padStart(2, '0');
            let combinedMnemonic = (parseInt(`${mnemonic1}${mnemonic2}`, 16)).toString(16).toUpperCase().padStart(4, '0')
            let mnemonic = `${mnemonicOpcode} ${combinedMnemonic}`;
            console.log(`${address1}:${mnemonic}`);
            program.push(`${address1}:${mnemonic}`);
            address = (parseInt(address, 16) + 2).toString(16).toUpperCase().padStart(4, '0')
        } else if (byte === "THREE_2") {
            let address1 = address;
            addressList.push(address);
            address = (parseInt(address, 16) + 2).toString(16).toUpperCase().padStart(4, '0')
            let machineCode1 = memoryLocationValue[parseInt(address, 16) - 1];
            let machineCodeHex1 = fillZero(machineCode1).toUpperCase();
            let mnemonic1 = machineCodeHex1.padStart(2, '0');
            addressList.push(address);
            address = (parseInt(address, 16) - 1).toString(16);
            let machineCode2 = memoryLocationValue[parseInt(address, 16) - 1];
            let machineCodeHex2 = fillZero(machineCode2).toUpperCase();
            let mnemonic2 = machineCodeHex2.padStart(2, '0');
            let combinedMnemonic = (parseInt(`${mnemonic1}${mnemonic2}`, 16)).toString(16).toUpperCase().padStart(4, '0')
            let mnemonic = `${mnemonicOpcode},${combinedMnemonic}`;
            console.log(`${address1}:${mnemonic}`);
            program.push(`${address1}:${mnemonic}`);
            address = (parseInt(address, 16) + 2).toString(16).toUpperCase().padStart(4, '0');
        } else if (byte === null) {
            addressList.push(address);
            address = (parseInt(address, 16) + 1).toString(16).toUpperCase().padStart(4, '0')
        }
    }

    console.log(`Address List = [${addressList.join(', ')}]`);
    console.log(`Program = [${program.join(', ')}]`);
}

function execute8085() {
    let ret_address
    console.log("-----EXECUTE-----")
    let p_c = 0

    textTop.innerHTML = "GO EXECUTE"
    executeActiveStatus = 'active'
    
    modeExecute = 0
    textBottom.value = "Address: " + hexValue

    enter.addEventListener('click', enterAddress = () => {
        if (initialMode === false && memoryActiveStatus !== 'active' && addressActiveStaus !== 'active') {
            let startAddress = textBottom.value.split(": ")[1]
            console.log(startAddress)
            let addressPlace = textBottom.value
            addressLocation = addressPlace.split(": ")[1]
            addressLocation = (parseInt(addressLocation, 16)).toString(16).padStart(4, '0')
            console.log(program)
            program_1 = program.slice() // Assuming `program` is a global variable
            MC_to_MN(startAddress);
            textTop.innerHTML = "EXECUTING..."
            textBottom.value = ''
            while (true) {
                let machine_code = program[p_c];
                let mnemonic = machine_code.split(":");
                let address_code = mnemonic[0];
                let instruction = mnemonic[1];
                let opcode = instruction.split(" ")[0];

                if (opcode === "ADD") {
                    ADD(instruction);
                } else if (opcode === "ADI") {
                    ADI(instruction);
                } else if (opcode === "ANA") {
                    ANA(instruction);
                } else if (opcode === "ANI") {
                    ANI(instruction);
                } else if (opcode === "CALL") {
                    p_c = CALL(instruction);
                } else if (opcode === "CC") {
                    p_c = CC(instruction);
                } else if (opcode === "CNC") {
                    p_c = CNC(instruction);
                } else if (opcode === "CP") {
                    p_c = CP(instruction);
                } else if (opcode === "CM") {
                    p_c = CM(instruction);
                } else if (opcode === "CPE") {
                    p_c = CPE(instruction);
                } else if (opcode === "CPO") {
                    p_c = CPO(instruction);
                } else if (opcode === "CZ") {
                    p_c = CZ(instruction);
                } else if (opcode === "CNZ") {
                    p_c = CNZ(instruction);
                } else if (opcode === "CMA") {
                    CMA(instruction);
                } else if (opcode === "CMP") {
                    CMP(instruction);
                } else if (opcode === "CPI") {
                    CPI(instruction);
                } else if (opcode === "DCR") {
                    DCR(instruction);
                } else if (opcode === "DCX") {
                    DCX(instruction);
                } else if (opcode === "DAD") {
                    DAD(instruction);
                } else if (opcode === "INR") {
                    INR(instruction);
                } else if (opcode === "INX") {
                    INX(instruction);
                } else if (opcode === "JMP") {
                    p_c = JMP(instruction);
                } else if (opcode === "JP") {
                    p_c = JC(instruction);
                    if (p_c === "A") {
                        p_c = program_address_list.indexOf(address_code);
                        p_c = p_c + 1;
                    }
                } else if (opcode === "JM") {
                    p_c = JC(instruction);
                    if (p_c === "A") {
                        p_c = program_address_list.indexOf(address_code);
                        p_c = p_c + 1;
                    }
                } else if (opcode === "JPE") {
                    p_c = JC(instruction);
                    if (p_c === "A") {
                        p_c = program_address_list.indexOf(address_code);
                        p_c = p_c + 1;
                    }
                } else if (opcode === "JPO") {
                    p_c = JC(instruction);
                    if (p_c === "A") {
                        p_c = program_address_list.indexOf(address_code);
                        p_c = p_c + 1;
                    }
                } else if (opcode === "JC") {
                    p_c = JC(instruction);
                    if (p_c === "A") {
                        p_c = program_address_list.indexOf(address_code);
                        p_c = p_c + 1;
                    }
                } else if (opcode === "JNC") {
                    p_c = JNC(instruction);
                    if (p_c === "A") {
                        p_c = program_address_list.indexOf(address_code);
                        p_c = p_c + 1;
                    }
                } else if (opcode === "JZ") {
                    p_c = JZ(instruction);
                    if (p_c === "A") {
                        p_c = program_address_list.indexOf(address_code);
                        p_c = p_c + 1;
                    }
                } else if (opcode === "JNZ") {
                    p_c = JNZ(instruction);
                    if (p_c === "A") {
                        p_c = program_address_list.indexOf(address_code);
                        p_c = p_c + 1;
                    }
                } else if (opcode === "LDA") {
                    LDA(instruction);
                } else if (opcode === "LDAX") {
                    LDAX(instruction);
                } else if (opcode === "LXI") {
                    LXI(instruction);
                } else if (opcode === "LHLD") {
                    LHLD(instruction);
                } else if (opcode === "SHLD") {
                    SHLD(instruction);
                } else if (opcode === "MOV") {
                    MOV(instruction);
                } else if (opcode === "MVI") {
                    MVI(instruction);
                } else if (opcode === "ORA") {
                    ORA(instruction);
                } else if (opcode === "ORI") {
                    ORI(instruction);
                } else if (opcode === "PUSH") {
                    PUSH(instruction);
                } else if (opcode === "POP") {
                    POP(instruction);
                } else if (opcode === "RET") {
                    RET(instruction);
                    p_c = program_address_list.indexOf(ret_address);
                } else if (opcode === "RC") {
                    let returnValue = RC(instruction);
                    if (returnValue) {
                        p_c = program_address_list.indexOf(ret_address);
                    } else {
                        p_c = p_c + 1;
                    }
                } else if (opcode === "RNC") {
                    let returnValue = RNC(instruction);
                    if (returnValue) {
                        p_c = program_address_list.indexOf(ret_address);
                    } else {
                        p_c = p_c + 1;
                    }
                } else if (opcode === "RP") {
                    let returnValue = RP(instruction);
                    if (returnValue) {
                        p_c = program_address_list.indexOf(ret_address);
                    } else {
                        p_c = p_c + 1;
                    }
                } else if (opcode === "RM") {
                    let returnValue = RM(instruction);
                    if (returnValue) {
                        p_c = program_address_list.indexOf(ret_address);
                    } else {
                        p_c = p_c + 1;
                    }
                } else if (opcode === "RPE") {
                    let returnValue = RPE(instruction);
                    if (returnValue) {
                        p_c = program_address_list.indexOf(ret_address);
                    } else {
                        p_c = p_c + 1;
                    }
                } else if (opcode === "RPO") {
                    let returnValue = RPO(instruction);
                    if (returnValue) {
                        p_c = program_address_list.indexOf(ret_address);
                    } else {
                        p_c = p_c + 1;
                    }
                } else if (opcode === "RZ") {
                    let returnValue = RZ(instruction);
                    if (returnValue) {
                        p_c = program_address_list.indexOf(ret_address);
                    } else {
                        p_c = p_c + 1;
                    }
                } else if (opcode === "RNZ") {
                    let returnValue = RNZ(instruction);
                    if (returnValue) { 
                    p_c = program_address_list.indexOf(ret_address);
                    } else {
                    p_c = p_c + 1;
                    }
                } else if (opcode === "RLC") { 
                    RLC(instruction);
                } else if (opcode === "RRC") {
                    RRC(instruction);
                } else if (opcode === "STA") {
                    STA(instruction);
                } else if (opcode === "STAX") {
                    STAX(instruction);
                } else if (opcode === "SUB") {
                    SUB(instruction);
                } else if (opcode === "SUI") {
                    SUI(instruction);
                } else if (opcode === "XCHG") {
                    XCHG(instruction);
                } else if (opcode === "XRA") {
                    XRA(instruction);
                } else if (opcode === "XRI") {
                    XRI(instruction);
                } else if (opcode === "HLT") {
                    console.log("-----HLT-----");
                    break;
                } if (
                opcode !== "CALL" &&
                opcode !== "CC" &&
                opcode !== "CNC" &&
                opcode !== "CP" &&
                opcode !== "CM" &&
                opcode !== "CPE" &&
                opcode !== "CPO" &&
                opcode !== "CZ" &&
                opcode !== "CNZ" &&
                opcode !== "JMP" &&
                opcode !== "JC" &&
                opcode !== "JNC" &&
                opcode !== "JZ" &&
                opcode !== "JNZ" &&
                opcode !== "RET" &&
                opcode !== "RC" &&
                opcode !== "RNC" &&
                opcode !== "RP" &&
                opcode !== "RM" &&
                opcode !== "RPE" &&
                opcode !== "RPO" &&
                opcode !== "RZ" &&
                opcode !== "RNZ") {
                p_c = p_c + 1;
                }
            }
        }
    })
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
            textTop.innerHTML = "GO EXECUTE"
            textBottom.value = "ADDRESS: 0000"
            execute8085()
        } else if (spclbtn.innerHTML === 'R' && initialMode === true) {
            initialMode = false
            textTop.innerHTML = "REGISTERS"
            textBottom.value = ''
            console.log(`A = ${fillZero(reg_value[0])} flag = ${reg_value[1]}`);
            console.log(`B = ${fillZero(reg_value[2])} C = ${fillZero(reg_value[3])}`);
            console.log(`D = ${fillZero(reg_value[4])} E = ${fillZero(reg_value[5])}`);
            console.log(`H = ${fillZero(reg_value[6])} L = ${fillZero(reg_value[7])}`);
        }
    })
})
