let A = "0";
let flag = [0, 0, 0, 0, 0, 0, 0, 0];
let B = "0";
let C = "0";
let D = "0";
let E = "0";
let H = "FF";
let L = "FF";
let M = "0";
let reg_list = ["A", "flag", "B", "C", "D", "E", "H", "L", "M"];
let address_list = [];
let address_location_list = [];
let address_value_list = [];
let machine_code_list = [];
let machine_code_list_1 = [];
let reg_value = [A, flag, B, C, D, E, H, L, M];
let M_address = reg_value[6] + reg_value[7];
let program = [];
let stack = ["0FFF"];
let stack_value = [];
let stack_pointer = "0FFF";

let n = 0;
let memory_location_list = [];
for (let i = 0; i < 65535; i++) {
    n = parseInt(n, 16) + 1;
    n = n.toString(16);
    memory_location_list.push(n.toUpperCase());
}

let memory_location_value = [];
n = 0;
for (let i = 0; i < 65535; i++) {
    n = Math.floor(Math.random() * 256).toString(16);
    if (parseInt(n, 16) < 16) {
        n = n.padStart(2, '0');
    }
    memory_location_value.push(n.toUpperCase());
}

function ADD(mnemonic) {
    console.log("\n-----ADD-----");
    let mnemonicParts = mnemonic.split();
    let reg_1 = mnemonicParts[1];
    reg_1 = reg_list.indexOf(reg_1);
    
    if (reg_1 === "M") {
        memory_address_M(1);
    }

    reg_value[0] = (parseInt(reg_value[0], 16) + parseInt(reg_value[reg_1], 16)).toString(16);
    
    if (parseInt(reg_value[0], 16) > 255) {
        check_accumulator();
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt("100", 16)).toString(16);
    }

    reg_value[0] = fill_zero(reg_value[0]);
    console.log(`[A] = ${reg_value[0]}`);
}

function ADI(mnemonic) {
    console.log("\n-----ADI-----");
    let mnemonicParts = mnemonic.split();
    let immediate_value = mnemonicParts[1];

    if (immediate_value.length === 2) {
        reg_value[0] = (parseInt(reg_value[0], 16) + parseInt(immediate_value, 16)).toString(16);

        if (parseInt(reg_value[0], 16) > 255) {
            check_accumulator();
            reg_value[0] = (parseInt(reg_value[0], 16) - parseInt("100", 16)).toString(16);
        }
    } else {
        console.log("Invalid value: Expected value is one byte hexadecimal value");
    }

    reg_value[0] = fill_zero(reg_value[0]);
    console.log(`[A] = ${reg_value[0]}`);
}

function ANA(mnemonic) {
    console.log("\n-----ANA-----");
    let mnemonicParts = mnemonic.split();
    let reg_1 = mnemonicParts[1];
    reg_1 = reg_list.indexOf(reg_1);

    if (reg_1 === "M") {
        memory_address_M(1);
    }

    reg_value[0] = (parseInt(reg_value[0], 16) & parseInt(reg_value[reg_1], 16)).toString(16);
    check_accumulator();
    reg_value[0] = fill_zero(reg_value[0]);

    console.log(`[A] = ${reg_value[0]}`);
}

function ANI(mnemonic) {
    console.log("\n-----ANI-----");
    let mnemonicParts = mnemonic.split();
    let immediate_value = mnemonicParts[1];

    if (immediate_value.length === 2) {
        reg_value[0] = (parseInt(reg_value[0], 16) & parseInt(immediate_value, 16)).toString(16);
        check_accumulator();
    } else {
        console.log("Invalid value: Expected value is one byte hexadecimal value");
    }

    reg_value[0] = fill_zero(reg_value[0]);
    console.log(`[A] = ${reg_value[0]}`);
}



function check_accumulator() {
    console.log("-----Check Accumulator-----");
    if (parseInt(reg_value[0], 16) === 0) {
        flag[1] = 1;
    } else if (parseInt(reg_value[0], 16) !== 0) {
        flag[1] = 0;
    }
    if (parseInt(reg_value[0], 16) > 255) {
        flag[7] = 1;
    } else if (parseInt(reg_value[0], 16) <= 255) {
        flag[7] = 0;
    }
    console.log(`Flag = ${flag}`);
}

function checkFlag(regName) {
    console.log("-----Check Flag-----");
    if (parseInt(regName, 16) === 0) {
        flag[1] = 1;
    } else if (parseInt(regName, 16) !== 0) {
        flag[1] = 0;
    }
    if (parseInt(regName, 16) > 255) {
        flag[7] = 1;
    } else if (parseInt(regName, 16) <= 255) {
        flag[7] = 0;
    }
    console.log(`Flag = ${flag}`);
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
    console.log("-----Split Address-----");
    const midIndex = Math.floor(address.length / 2);
    const higherByte = address.substring(0, midIndex);
    const lowerByte = address.substring(midIndex);
    return [higherByte.toUpperCase(), lowerByte.toUpperCase()];
}

let one_byte;
let two_byte;
let three_byte;

function byte8085(mnemonic) {
    let t = 0;
    const mnemonics = mnemonic.split();
    const opcode = mnemonics[0];

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

function memory8085() {
    console.log("-----MEMORY/EDIT-----");
    console.log("If you want to change the value, type the desired value. Otherwise hit enter.");
    
    let addressLocationList = [];
    let addressValueList = [];
    let addressValueListBefore = [];

    let addressLocation = prompt("Enter address: ");

    while (true) {
        addressLocation = (parseInt(addressLocation, 16)).toString(16);
        const memoryLocationIndex = memoryLocationList.indexOf(addressLocation);

        addressValueListBefore.push(memoryLocationValue[memoryLocationIndex]);

        let addressValue = prompt(`${addressLocation}: ${memoryLocationValue[memoryLocationIndex]} `);

        if (addressValue === "EXIT") {
            break;
        } else if (addressValue.length === 2) {
            memoryLocationValue[memoryLocationIndex] = addressValue;
        } else if (addressValue.length === 0) {
            addressValue = memoryLocationValue[memoryLocationIndex];
            console.log(addressValue);
        }

        if (addressValue.length > 2) {
            console.log("Invalid value: 2-byte hexadecimal value expected");
        } else {
            addressValue = (parseInt(addressValue, 16)).toString(16);
            addressValue = fillZero(addressValue);

            if (addressLocationList.includes(addressLocation)) {
                const addressLocationIndex = addressLocationList.indexOf(addressLocation);
                addressValueList[addressLocationIndex] = addressValue;
            } else {
                addressValueList.push(addressValue);
                addressLocationList.push(addressLocation);
            }

            addressLocation = (parseInt(addressLocation, 16) + 1).toString(16);
        }
    }

    console.log(`Address location list = ${addressLocationList}`);
    console.log(`Address value list before = ${addressValueListBefore}`);
    console.log(`Address value list after = ${addressValueList}`);

    for (const address of addressLocationList) {
        const m = addressLocationList.indexOf(address);
        let addressValue = addressValueList[m];
        addressValue = fillZero(addressValue);
        const memoryLocationIndex = memoryLocationList.indexOf(address);
        memoryLocationValue[memoryLocationIndex] = addressValue;
    }
}

// not completed... need to add instructions...
function instructionDecoder(mnemonic) {
    console.log("Decoding instruction...");
    const instruction = mnemonic.split(" ")[0];
    console.log(`Mnemonic = ${mnemonic}, Instruction = ${instruction}`);

    const oneByteList = ["MOV", "ADD", "CMP", "CMA", "INR", "INX", "DCR", "DCX", "DAD", "LDAX", "STAX", "HLT", "SUB", "XCHG", "ANA", "ORA", "XRA", "RRC", "RLC", "RET", "RC", "RNC", "RP", "RM", "RPE", "RPO", "RZ", "RNZ", "PUSH", "POP"];
    const twoByteList1 = ["ADI", "ORI", "ACI", "SUI", "CPI", "ANI", "ORI", "XRI"];
    const twoByteList2 = ["MVI"];
    const threeByteList1 = ["LDA", "STA", "JMP", "CALL", "CC", "CNC", "CP", "CM", "CPE", "CPO", "CZ", "CNZ", "LHLD", "SHLD", "JC", "JNC", "JZ", "JNZ", "JP", "JM", "JPE", "JPO"];
    const threeByteList2 = ["LXI"];

    if (oneByteList.includes(instruction)) {
        const byte = "ONE";
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
        return { byte, machineCode, immediateValue: null };
    } else if (twoByteList1.includes(instruction)) {
        const byte = "TWO";
        const mnemonicParts = mnemonic.split(" ");
        const opcode = mnemonicParts[0];
        const immediateValue = mnemonicParts[1];

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

        console.log(`Byte = ${byte}, Machine code = ${machineCode}, Immediate value = ${immediateValue}`);
        return { byte, machineCode, immediateValue };
    } else if (twoByteList2.includes(instruction)) {
        const byte = "TWO";
        const mnemonicParts = mnemonic.split(",");
        const opcode = mnemonicParts[0];
        const immediateValue = mnemonicParts[1];

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
        return { byte, machineCode, immediateValue };
    } else if (threeByteList1.includes(instruction)) {
        const byte = "THREE";
        const mnemonicParts = mnemonic.split(" ");
        const opcode = mnemonicParts[0];
        const memoryLocation = mnemonicParts[1];

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

        console.log(`Byte = ${byte}, Machine code = ${machineCode}, Memory location = ${memoryLocation}`);
        return { byte, machineCode, memoryLocation };
    } else if (threeByteList2.includes(instruction)) {
        const byte = "THREE";
        const mnemonicParts = mnemonic.split(",");
        const opcode = mnemonicParts[0];
        const memoryLocation = mnemonicParts[1];

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

        console.log(`Byte = ${byte}, Machine code = ${machineCode}, Memory location = ${memoryLocation}`);
        return { byte, machineCode, memoryLocation };
    } else {
        console.log("Unknown instruction...");
        return { byte: "Error", machineCode: null, immediateValue: null };
    }
}

function MNToMC(address, mnemonic) {
    console.log("Converting to Machine Code...");
    let byte, machineCode, ivMl;
    [byte, machineCode, ivMl] = instructionDecoder(mnemonic); // ivMl means immediateValue or memoryLocation
    if (byte === "ONE") {
        machineCode = fillZero(machineCode);
        addressList.push(`${address}`);
        machineCodeList.push(machineCode);
        machineCodeList1.push(machineCode);
        const memoryLocationIndex = memoryLocationList.indexOf(address);
        memoryLocationValue[memoryLocationIndex] = machineCode;
        return [machineCode, null, null];
    } else if (byte === "TWO") {
        machineCode = fillZero(machineCode);
        addressList.push(`${address}`);
        machineCodeList.push(machineCode);
        machineCodeList1.push(machineCode);
        const memoryLocationIndex = memoryLocationList.indexOf(address);
        memoryLocationValue[memoryLocationIndex] = machineCode;
        const immediateValue = parseInt(ivMl, 16).toString(16);
        const filledImmediateValue = fillZero(immediateValue);
        address = (parseInt(address, 16) + 1).toString(16);
        addressList.push(`${address}`);
        machineCodeList.push(filledImmediateValue);
        machineCodeList1.push(filledImmediateValue);
        const immediateMemoryLocationIndex = memoryLocationList.indexOf(address);
        memoryLocationValue[immediateMemoryLocationIndex] = filledImmediateValue;
        return [machineCode, filledImmediateValue, null];
    } else if (byte === "THREE") {
        machineCode = fillZero(machineCode);
        addressList.push(`${address}`);
        const memoryLocationIndex = memoryLocationList.indexOf(address);
        memoryLocationValue[memoryLocationIndex] = machineCode;
        machineCodeList.push(machineCode);
        machineCodeList1.push(machineCode);
        const memoryLocation = ivMl;
        const [higherByte, lowerByte] = splitAddress(memoryLocation);
        const filledLowerByte = fillZero(parseInt(lowerByte, 16).toString(16));
        const filledHigherByte = fillZero(parseInt(higherByte, 16).toString(16));
        machineCodeList.push(filledLowerByte);
        machineCodeList1.push(filledLowerByte);
        address = (parseInt(address, 16) + 1).toString(16);
        addressList.push(`${address}`);
        const lowerByteMemoryLocationIndex = memoryLocationList.indexOf(address);
        memoryLocationValue[lowerByteMemoryLocationIndex] = filledLowerByte;
        address = (parseInt(address, 16) + 1).toString(16);
        addressList.push(`${address}`);
        machineCodeList.push(filledHigherByte);
        machineCodeList1.push(filledHigherByte);
        const higherByteMemoryLocationIndex = memoryLocationList.indexOf(address);
        memoryLocationValue[higherByteMemoryLocationIndex] = filledHigherByte;
        return [machineCode, filledLowerByte, filledHigherByte];
    } else if (byte === null) {
        return [machineCode, null, null];
    }
}

function address8085() {
    console.log("-----ADDRESS-----");
    let addressList = [];
    let program = [];
    let mnemonic;
    let programAddressList = [];
    let address = (parseInt(prompt("Enter address: "), 16)).toString(16);
    while (true) {
        mnemonic = prompt(`\n${address}: `);
        if (mnemonic.toUpperCase() === "EXIT") {
            break;
        }
        const byte = byte8085(mnemonic);
        if (byte !== "error") {
            programAddressList.push(address);
            program.push(`${address}:${mnemonic}`);
            const [machineCode, nextAddress1, nextAddress2] = MNToMC(address, mnemonic);
            console.log(machineCode, nextAddress1, nextAddress2);
        }
        if (byte === 1) {
            address = (parseInt(address, 16) + parseInt("1", 16)).toString(16);
        } else if (byte === 2) {
            address = (parseInt(address, 16) + parseInt("2", 16)).toString(16);
        } else if (byte === 3) {
            address = (parseInt(address, 16) + parseInt("3", 16)).toString(16);
        }
    }
    console.log(`Program = ${program}`);
    console.log(`Address list = ${addressList}`);
    console.log(`Machine code list = ${machineCodeList1}`);
    console.log(`Program address list = ${programAddressList}`);
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
    let program = [];
    let addressList = [];
    let programCount = 0;
    let address = parseInt(startAddress, 16).toString(16);

    while (programCount < program_1.length) {
        programCount += 1;
        const addressIndex = memory_location_list.indexOf(address);
        const machineCode = memory_location_value[addressIndex];
        const machineCodeHex = fillZero(machineCode).toUpperCase();
        console.log(`Machine code = ${machineCodeHex}`);
        
        const [byte, mnemonicOpcode] = instructionEncoder(machineCodeHex);

        if (byte === "ONE") {
            addressList.push(address);
            console.log(`${address}:${mnemonicOpcode}`);
            program.push(`${address}:${mnemonicOpcode}`);
            address = (parseInt(address, 16) + 1).toString(16);
        } else if (byte === "TWO_1") {
            addressList.push(address);
            const machineCodeValue = memory_location_value[parseInt(address, 16)];
            const mnemonic = `${mnemonicOpcode} ${machineCodeValue.toString().padStart(2, '0')}`;
            console.log(`${address}:${mnemonic}`);
            program.push(`${address}:${mnemonic}`);
            address = (parseInt(address, 16) + 1).toString(16);
            addressList.push(address.slice(2));
            address = (parseInt(address, 16) + 1).toString(16);
        } else if (byte === "TWO_2") {
            addressList.push(address);
            const machineCodeValue = memory_location_value[parseInt(address, 16)];
            const mnemonic = `${mnemonicOpcode},${machineCodeValue.toString().padStart(2, '0')}`;
            console.log(`${address}:${mnemonic}`);
            program.push(`${address}:${mnemonic}`);
            address = (parseInt(address, 16) + 1).toString(16);
            addressList.push(address.slice(2));
            address = (parseInt(address, 16) + 1).toString(16);
        } else if (byte === "THREE_1") {
            const address1 = address;
            addressList.push(address);
            address = (parseInt(address, 16) + 2).toString(16);
            const machineCode1 = memory_location_value[parseInt(address, 16) - 1];
            const machineCodeHex1 = fillZero(machineCode1).toUpperCase();
            const mnemonic1 = machineCodeHex1.padStart(2, '0');
            addressList.push(address);
            address = (parseInt(address, 16) - 1).toString(16);
            const machineCode2 = memory_location_value[parseInt(address, 16) - 1];
            const machineCodeHex2 = fillZero(machineCode2).toUpperCase();
            const mnemonic2 = machineCodeHex2.padStart(2, '0');
            const combinedMnemonic = (parseInt(`${mnemonic1}${mnemonic2}`, 16)).toString(16);
            const mnemonic = `${mnemonicOpcode} ${combinedMnemonic}`;
            console.log(`${address1}:${mnemonic}`);
            program.push(`${address1}:${mnemonic}`);
            address = (parseInt(address, 16) + 2).toString(16);
        } else if (byte === "THREE_2") {
            const address1 = address;
            addressList.push(address);
            address = (parseInt(address, 16) + 2).toString(16);
            const machineCode1 = memory_location_value[parseInt(address, 16) - 1];
            const machineCodeHex1 = fillZero(machineCode1).toUpperCase();
            const mnemonic1 = machineCodeHex1.padStart(2, '0');
            addressList.push(address);
            address = (parseInt(address, 16) - 1).toString(16);
            const machineCode2 = memory_location_value[parseInt(address, 16) - 1];
            const machineCodeHex2 = fillZero(machineCode2).toUpperCase();
            const mnemonic2 = machineCodeHex2.padStart(2, '0');
            const combinedMnemonic = (parseInt(`${mnemonic1}${mnemonic2}`, 16)).toString(16);
            const mnemonic = `${mnemonicOpcode},${combinedMnemonic}`;
            console.log(`${address1}:${mnemonic}`);
            program.push(`${address1}:${mnemonic}`);
            address = (parseInt(address, 16) + 2).toString(16);
        } else if (byte === null) {
            addressList.push(address);
            address = (parseInt(address, 16) + 1).toString(16);
        }
    }

    console.log(`Address List = [${addressList.join(', ')}]`);
    console.log(`Program = [${program.join(', ')}]`);
}

function execute_8085() {
    console.log("-----EXECUTE-----");
    let p_c = 0;
    let program_1 = program.slice(); // Assuming `program` is a global variable
    let ret_address;

    let start_address = prompt("Start address: ");
    MC_to_MN(start_address);

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

function memory_address_M(mode) {
    if (mode === 0) {
        console.log("Storing the value to Memory address...");
        reg_value[6] = fill_zero(reg_value[6]);
        reg_value[7] = fill_zero(reg_value[7]);
        let M_address = reg_value[6] + reg_value[7];
        let M_index = memory_location_list.indexOf(M_address);
        memory_location_value[M_index] = reg_value[8];
        console.log(`[H] = ${reg_value[6]}, [L] = ${reg_value[7]}`);
        console.log(`[M] = [${M_address}] = ${reg_value[8]}`);
    } else if (mode === 1) {
        console.log("Retrieving the value from Memory address...");
        reg_value[6] = fill_zero(reg_value[6]);
        reg_value[7] = fill_zero(reg_value[7]);
        let M_address = reg_value[6] + reg_value[7];
        let M_index = memory_location_list.indexOf(M_address);
        reg_value[8] = memory_location_value[M_index];
        console.log(`[M] = [${M_address}] = ${reg_value[8]}`);
        console.log(`[H] = ${reg_value[6]}, [L] = ${reg_value[7]}`);
    }
}
  
let details = prompt("Do you want to see more details? [Y/N] : ");
if (details === "Y") {
    console.log(`A = ${fill_zero(reg_value[0])} flag = ${reg_value[1]}`);
    console.log(`B = ${fill_zero(reg_value[2])} C = ${fill_zero(reg_value[3])}`);
    console.log(`D = ${fill_zero(reg_value[4])} E = ${fill_zero(reg_value[5])}`);
    console.log(`H = ${fill_zero(reg_value[6])} L = ${fill_zero(reg_value[7])}`);
}}

while (true) {
    console.log("\nPress any of the given key: A - Address, G - Execute, M - Memory, R - Register");
    let keyA = 0;
    let keyG = 0;
    let keyM = 0;
    let keyR = 1;
    if (memory_location_list !== [] && memory_location_value !== []) {
        console.log("They exist!");
    }
    if (keyA === 1) {
        address8085();
    }
    if (keyG === 1) {
        execute8085();
    }
    if (keyM === 1) {
        memory8085();
    }
    if (keyR === 1) {
        console.log(`A = ${fillZero(reg_value[0])} flag = ${reg_value[1]}`);
        console.log(`B = ${fillZero(reg_value[2])} C = ${fillZero(reg_value[3])}`);
        console.log(`D = ${fillZero(reg_value[4])} E = ${fillZero(reg_value[5])}`);
        console.log(`H = ${fillZero(reg_value[6])} L = ${fillZero(reg_value[7])}`);
    }
    break;
}
