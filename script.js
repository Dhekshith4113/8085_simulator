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
let hexValue = '8000'
let hexAddress = '0000'
let addressList, machineCodeList, machineCodeList1, byte, machineCode, ivMl, retValue, nextAddress1, nextAddress2
let memoryActiveStatus = 'inactive'
let addressActiveStatus = 'inactive'
let executeActiveStatus = 'inactive'
let initialMode, p_c, ret_address, program_1, startAddress
let programAddressList = []
let program = []
let addressLocationList = []
let addressValueList = []
let addressValueListBefore = []
let one_byte, mnemonic, modeAddress, modeExecute, modeMemory
let two_byte
let three_byte
let memoryLocationList, memoryLocationValue

let initialMod = (function () {
    let done = false
    return function () {
        setTimeout(() => {
            textTop.innerHTML = "SCIENTIFIC TECH"
            textBottom.value = "8085 TRAINER KIT"
            setTimeout(() => {
                textTop.innerHTML = "MENU:   A,D,M,F, "
                textBottom.value = "C,G,S,R,I,E,P"
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
let H = "0"
let L = "0"
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
let M_index
let stack = ["0FFF"]
let stack_value = []
let stack_pointer = "0FFF"

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

function ADD(mnemonic) {
    console.log("\n-----ADD-----");
    let mnemonicParts = mnemonic.split(" ");
    let reg_1 = mnemonicParts[1];

    if (reg_1 === "M") {
        memory_address_M(1);
    }

    reg_1 = reg_list.indexOf(reg_1);
    console.log(`[A] = [${reg_value[0]} + ${reg_value[reg_1]}]`)
    reg_value[0] = (parseInt(reg_value[0], 16) + parseInt(reg_value[reg_1], 16)).toString(16).toUpperCase().padStart(2, '0')
    if (parseInt(reg_value[0], 16) > 255) {
        checkAccumulator();
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt("100", 16)).toString(16).toUpperCase().padStart(2, '0')
    }
    reg_value[0] = fillZero(reg_value[0]);
    console.log(`[A] = ${reg_value[0]}`);
}

function ADI(mnemonic) {
    console.log("\n-----ADI-----");
    let mnemonicParts = mnemonic.split(" ");
    let immediate_value = mnemonicParts[1];

    if (immediate_value.length === 2) {
        console.log(`[A] = [${reg_value[0]} + ${immediate_value}]`)
        reg_value[0] = (parseInt(reg_value[0], 16) + parseInt(immediate_value, 16)).toString(16);

        if (parseInt(reg_value[0], 16) > 255) {
            checkAccumulator();
            reg_value[0] = (parseInt(reg_value[0], 16) - parseInt("100", 16)).toString(16);
        }
    } else {
        console.log("Invalid value: Expected value is one byte hexadecimal value");
    }

    reg_value[0] = fillZero(reg_value[0]);
    console.log(`[A] = ${reg_value[0]}`);
}

function ANA(mnemonic) {
    console.log("\n-----ANA-----");
    let mnemonicParts = mnemonic.split(" ");
    let reg_1 = mnemonicParts[1];

    if (reg_1 === "M") {
        memory_address_M(1);
    }

    reg_1 = reg_list.indexOf(reg_1);
    console.log(`[A] = [${reg_value[0]} & ${reg_value[reg_1]}]`)
    reg_value[0] = (parseInt(reg_value[0], 16) & parseInt(reg_value[reg_1], 16)).toString(16);
    checkAccumulator();
    reg_value[0] = fillZero(reg_value[0]);

    console.log(`[A] = ${reg_value[0]}`);
}

function ANI(mnemonic) {
    console.log("\n-----ANI-----");
    let mnemonicParts = mnemonic.split(" ");
    let immediate_value = mnemonicParts[1];

    if (immediate_value.length === 2) {
        console.log(`[A] = [${reg_value[0]} & ${immediate_value}]`)
        reg_value[0] = (parseInt(reg_value[0], 16) & parseInt(immediate_value, 16)).toString(16);
        checkAccumulator();
    } else {
        console.log("Invalid value: Expected value is one byte hexadecimal value");
    }

    reg_value[0] = fillZero(reg_value[0]);
    console.log(`[A] = ${reg_value[0]}`);
}

function CALL(mnemonic) {
    console.log("\n-----CALL-----");
    let splitMnemonic = mnemonic.split(" ");
    let call_address = splitMnemonic[1];
    ret_address = programAddressList[p_c + 1];
    let [higher_byte, lower_byte] = splitAddress(ret_address);
    stack_value.push(higher_byte);
    stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16);
    stack_pointer = fillZero(stack_pointer);
    stack_value.push(lower_byte);
    call_address = parseInt(call_address, 16).toString(16);
    p_c = programAddressList.indexOf(call_address);
    console.log(`Going to ${call_address}`);
    console.log(`Stack pointer = ${stack_pointer}`);
    console.log(`Stack = ${stack}`);
    console.log(`Stack value = ${stack_value}`);
    return p_c;
}

function CC(mnemonic) {
    console.log("\n-----CC-----");
    if (flag[7] === 1) {
        let splitMnemonic = mnemonic.split(" ");
        let call_address = splitMnemonic[1];
        ret_address = programAddressList[p_c + 1];
        let [higher_byte, lower_byte] = splitAddress(ret_address);

        if (stack.length === 0) {
            stack_pointer = "0FFF";
            stack.push(stack_pointer);
            stack_value.push(higher_byte);
            stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16);
            stack_pointer = fillZero(stack_pointer);
            stack_value.push(lower_byte);
        } else if (stack.length !== 0) {
            stack.push(stack_pointer);
            stack_value.push(higher_byte);
            stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16);
            stack_pointer = fillZero(stack_pointer);
            stack_value.push(lower_byte);
        } else {
            console.log("Stack error: Stack not initialized");
        }

        call_address = parseInt(call_address, 16).toString(16);
        p_c = programAddressList.indexOf(call_address);
        console.log(`Going to ${call_address}`);
        console.log(`Stack pointer = ${stack_pointer}`);
        console.log(`Stack = ${stack}`);
        console.log(`Stack value = ${stack_value}`);
        return p_c;
    } else {
        return p_c + 1;
    }
}

function CNC(mnemonic) {
    console.log("\n-----CNC-----");
    if (flag[7] === 0) {
        let splitMnemonic = mnemonic.split(" ");
        let call_address = splitMnemonic[1];
        ret_address = programAddressList[p_c + 1];
        let [higher_byte, lower_byte] = splitAddress(ret_address);

        if (stack.length === 0) {
            stack_pointer = "0FFF";
            stack.push(stack_pointer);
            stack_value.push(higher_byte);
            stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16);
            stack_pointer = fillZero(stack_pointer);
            stack_value.push(lower_byte);
        } else if (stack.length !== 0) {
            stack.push(stack_pointer);
            stack_value.push(higher_byte);
            stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16);
            stack_pointer = fillZero(stack_pointer);
            stack_value.push(lower_byte);
        } else {
            console.log("Stack error: Stack not initialized");
        }

        call_address = parseInt(call_address, 16).toString(16);
        p_c = programAddressList.indexOf(call_address);
        console.log(`Going to ${call_address}`);
        console.log(`Stack pointer = ${stack_pointer}`);
        console.log(`Stack = ${stack}`);
        console.log(`Stack value = ${stack_value}`);
        return p_c;
    } else {
        return p_c + 1;
    }
}

function CP(mnemonic) {
    console.log("\n-----CP-----");
    if (flag[0] === 0) {
        let splitMnemonic = mnemonic.split(" ");
        let call_address = splitMnemonic[1];
        ret_address = programAddressList[p_c + 1];
        let [higher_byte, lower_byte] = splitAddress(ret_address);

        if (stack.length === 0) {
            stack_pointer = "0FFF";
            stack.push(stack_pointer);
            stack_value.push(higher_byte);
            stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16);
            stack_pointer = fillZero(stack_pointer);
            stack_value.push(lower_byte);
        } else if (stack.length !== 0) {
            stack.push(stack_pointer);
            stack_value.push(higher_byte);
            stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16);
            stack_pointer = fillZero(stack_pointer);
            stack_value.push(lower_byte);
        } else {
            console.log("Stack error: Stack not initialized");
        }

        call_address = parseInt(call_address, 16).toString(16);
        p_c = programAddressList.indexOf(call_address);
        console.log(`Going to ${call_address}`);
        console.log(`Stack pointer = ${stack_pointer}`);
        console.log(`Stack = ${stack}`);
        console.log(`Stack value = ${stack_value}`);
        return p_c;
    } else {
        return p_c + 1;
    }
}

function CM(mnemonic) {
    console.log("\n-----CM-----");
    if (flag[0] === 1) {
        let splitMnemonic = mnemonic.split(" ");
        let call_address = splitMnemonic[1];
        ret_address = programAddressList[p_c + 1];
        let [higher_byte, lower_byte] = splitAddress(ret_address);

        if (stack.length === 0) {
            stack_pointer = "0FFF";
            stack.push(stack_pointer);
            stack_value.push(higher_byte);
            stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16);
            stack_pointer = fillZero(stack_pointer);
            stack_value.push(lower_byte);
        } else if (stack.length !== 0) {
            stack.push(stack_pointer);
            stack_value.push(higher_byte);
            stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16);
            stack_pointer = fillZero(stack_pointer);
            stack_value.push(lower_byte);
        } else {
            console.log("Stack error: Stack not initialized");
        }

        call_address = parseInt(call_address, 16).toString(16);
        p_c = programAddressList.indexOf(call_address);
        console.log(`Going to ${call_address}`);
        console.log(`Stack pointer = ${stack_pointer}`);
        console.log(`Stack = ${stack}`);
        console.log(`Stack value = ${stack_value}`);
        return p_c;
    } else {
        return p_c + 1;
    }
}

function CPE(mnemonic) {
    console.log("\n-----CPE-----");
    if (flag[5] === 1) {
        let splitMnemonic = mnemonic.split();
        let call_address = splitMnemonic[1];
        ret_address = programAddressList[p_c + 1];
        let [higher_byte, lower_byte] = splitAddress(ret_address);

        if (stack.length === 0) {
            stack_pointer = "0FFF";
            stack.push(stack_pointer);
            stack_value.push(higher_byte);
            stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16);
            stack_pointer = fillZero(stack_pointer);
            stack_value.push(lower_byte);
        } else if (stack.length !== 0) {
            stack.push(stack_pointer);
            stack_value.push(higher_byte);
            stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16);
            stack_pointer = fillZero(stack_pointer);
            stack_value.push(lower_byte);
        } else {
            console.log("Stack error: Stack not initialized");
        }

        call_address = parseInt(call_address, 16).toString(16);
        p_c = programAddressList.indexOf(call_address);
        console.log(`Going to ${call_address}`);
        console.log(`Stack pointer = ${stack_pointer}`);
        console.log(`Stack = ${stack}`);
        console.log(`Stack value = ${stack_value}`);
        return p_c;
    } else {
        return p_c + 1;
    }
}

function CPO(mnemonic) {
    console.log("\n-----CPO-----");
    if (flag[5] === 0) {
        let splitMnemonic = mnemonic.split();
        let call_address = splitMnemonic[1];
        ret_address = programAddressList[p_c + 1];
        let [higher_byte, lower_byte] = splitAddress(ret_address);

        if (stack.length === 0) {
            stack_pointer = "0FFF";
            stack.push(stack_pointer);
            stack_value.push(higher_byte);
            stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16);
            stack_pointer = fillZero(stack_pointer);
            stack_value.push(lower_byte);
        } else if (stack.length !== 0) {
            stack.push(stack_pointer);
            stack_value.push(higher_byte);
            stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16);
            stack_pointer = fillZero(stack_pointer);
            stack_value.push(lower_byte);
        } else {
            console.log("Stack error: Stack not initialized");
        }

        call_address = parseInt(call_address, 16).toString(16);
        p_c = programAddressList.indexOf(call_address);
        console.log(`Going to ${call_address}`);
        console.log(`Stack pointer = ${stack_pointer}`);
        console.log(`Stack = ${stack}`);
        console.log(`Stack value = ${stack_value}`);
        return p_c;
    } else {
        return p_c + 1;
    }
}

function CMA() {
    console.log("\n-----CMA-----");
    reg_value[0] = (0 - parseInt(reg_value[0], 16)).toString(16);
    reg_value[0] = (parseInt(reg_value[0], 16) + parseInt("FF", 16)).toString(16).slice(-2);
    flag[0] = 1;
    flag[7] = 1;
    reg_value[0] = fillZero(reg_value[0]);
    console.log(`[A] = ${reg_value[0]}`);
}

function CMP(mnemonic) {
    console.log("\n-----CMP-----");
    mnemonic = mnemonic.split(" ");
    let reg_1 = mnemonic[1];

    if (reg_1 === "M") {
        memory_address_M(1);
    }

    reg_1 = reg_list.indexOf(reg_1);
    if (parseInt(reg_value[0], 16) < parseInt(reg_value[reg_1], 16)) {
        flag[1] = 0;
        flag[7] = 1;
        console.log(`[A] < [${reg_list[reg_1]}]`);
    } else if (parseInt(reg_value[0], 16) === parseInt(reg_value[reg_1], 16)) {
        flag[1] = 1;
        flag[7] = 0;
        console.log(`[A] = [${reg_list[reg_1]}]`);
    } else if (parseInt(reg_value[0], 16) > parseInt(reg_value[reg_1], 16)) {
        flag[1] = 0;
        flag[7] = 0;
        console.log(`[A] > [${reg_list[reg_1]}]`);
    }
    console.log(flag);
}

function CPI(mnemonic) {
    console.log("\n-----CPI-----");
    mnemonic = mnemonic.split(" ");
    let immediate_value = mnemonic[1];
    if (parseInt(reg_value[0], 16) < parseInt(immediate_value, 16)) {
        flag[1] = 0;
        flag[7] = 1;
        console.log(`[A] < ${immediate_value}`);
    } else if (parseInt(reg_value[0], 16) === parseInt(immediate_value, 16)) {
        flag[1] = 1;
        flag[7] = 0;
        console.log(`[A] = ${immediate_value}`);
    } else if (parseInt(reg_value[0], 16) > parseInt(immediate_value, 16)) {
        flag[1] = 0;
        flag[7] = 0;
        console.log(`[A] > ${immediate_value}`);
    }
    console.log(flag);
}

function DAD(mnemonic) {
    console.log("\n-----DAD-----");
    mnemonic = mnemonic.split(" ");
    let reg_1 = mnemonic[1];
    let reg_1_index = reg_list.indexOf(reg_1);
    let reg_2_index = reg_1_index + 1;

    reg_value[7] = (parseInt(reg_value[7], 16) + parseInt(reg_value[reg_2_index], 16)).toString(16);
    if (parseInt(reg_value[7], 16) > 255) {
        checkFlag(reg_value[7]);
        reg_value[7] = (parseInt(reg_value[7], 16) - parseInt("100", 16)).toString(16);
        reg_value[6] = (parseInt(reg_value[6], 16) + parseInt(reg_value[reg_1_index], 16) + 1).toString(16);
        if (parseInt(reg_value[6], 16) > 255) {
            checkFlag(reg_value[6]);
            reg_value[6] = (parseInt(reg_value[6], 16) - parseInt("100", 16)).toString(16);
        }
    } else {
        reg_value[6] = (parseInt(reg_value[6], 16) + parseInt(reg_value[reg_1_index], 16)).toString(16);
        if (parseInt(reg_value[6], 16) > 255) {
            checkFlag(reg_value[6]);
            reg_value[6] = (parseInt(reg_value[6], 16) - parseInt("100", 16)).toString(16);
        }
    }

    reg_value[6] = fillZero(reg_value[6]);
    reg_value[7] = fillZero(reg_value[7]);

    console.log(`[H] = ${reg_value[6]}`);
    console.log(`[L] = ${reg_value[7]}`);
}

function DCR(mnemonic) {
    console.log("\n-----DCR-----");
    mnemonic = mnemonic.split(" ");
    let reg_1 = mnemonic[1];
    let reg_index = reg_list.indexOf(reg_1);

    if (reg_1 === "M") {
        memory_address_M(1);
    }

    reg_value[reg_index] = (parseInt(reg_value[reg_index], 16) - 1).toString(16);
    if (reg_1 === "M") {
        memory_address_M(0);
    }

    console.log(`[${reg_list[reg_index]}] = ${reg_value[reg_index]}`);
    checkFlag(reg_value[reg_index]);
    reg_value[reg_index] = fillZero(reg_value[reg_index]);
}

function DCX(mnemonic) {
    console.log("\n-----DCX-----");
    mnemonic = mnemonic.split(" ");
    let reg_1 = mnemonic[1];
    let reg_1_index = reg_list.indexOf(reg_1);

    console.log(reg_value[reg_1_index]);
    let reg_2_index = reg_1_index + 1;
    console.log(reg_value[reg_2_index]);

    if (parseInt(reg_value[reg_2_index], 16) === 0) {
        reg_value[reg_1_index] = (parseInt(reg_value[reg_1_index], 16) - 1).toString(16);
        reg_value[reg_2_index] = (255).toString(16);
    } else {
        reg_value[reg_2_index] = (parseInt(reg_value[reg_2_index], 16) - 1).toString(16);
    }

    reg_value[reg_1_index] = fillZero(reg_value[reg_1_index]);
    reg_value[reg_2_index] = fillZero(reg_value[reg_2_index]);

    console.log(`[${reg_list[reg_1_index]}] = ${reg_value[reg_1_index]}`);
    console.log(`[${reg_list[reg_2_index]}] = ${reg_value[reg_2_index]}`);
}

function INR(mnemonic) {
    console.log("\n-----INR-----");
    mnemonic = mnemonic.split(" ");
    let reg_1 = mnemonic[1];
    let reg_index = reg_list.indexOf(reg_1);

    if (reg_1 === "M") {
        memory_address_M(1);
    }

    reg_value[reg_index] = (parseInt(reg_value[reg_index], 16) + 1).toString(16);
    if (reg_1 === "M") {
        memory_address_M(0);
    }

    console.log(`[${reg_list[reg_index]}] = ${reg_value[reg_index]}`);
    checkFlag(reg_value[reg_index]);
    reg_value[reg_index] = fillZero(reg_value[reg_index]);
}

function INX(mnemonic) {
    console.log("\n-----INX-----");
    mnemonic = mnemonic.split(" ");
    let reg_1 = mnemonic[1];
    let reg_1_index = reg_list.indexOf(reg_1);

    console.log(reg_value[reg_1_index]);
    let reg_2_index = reg_1_index + 1;
    console.log(reg_value[reg_2_index]);

    if (parseInt(reg_value[reg_2_index], 16) === 255) {
        reg_value[reg_1_index] = (parseInt(reg_value[reg_1_index], 16) + 1).toString(16);
        reg_value[reg_2_index] = "00";
    } else {
        reg_value[reg_2_index] = (parseInt(reg_value[reg_2_index], 16) + 1).toString(16);
    }

    reg_value[reg_1_index] = fillZero(reg_value[reg_1_index]);
    reg_value[reg_2_index] = fillZero(reg_value[reg_2_index]);

    if (reg_1 === "H") {
        if (address_location_list.length !== 0) {
            let M = reg_value[6] + reg_value[7];
            let M_index = memoryLocationList.indexOf(M);
            reg_value[8] = memoryLocationValue[M_index];
            reg_value[8] = fillZero(reg_value[8]);
        }
    }

    console.log(`[${reg_list[reg_1_index]}] = ${reg_value[reg_1_index]}`);
    console.log(`[${reg_list[reg_2_index]}] = ${reg_value[reg_2_index]}`);
}

function JMP(mnemonic) {
    console.log("\n-----JMP-----");
    mnemonic = mnemonic.split(" ");
    let jmp_address = mnemonic[1];
    jmp_address = parseInt(jmp_address, 16).toString(16).toUpperCase().padStart(4, '0')
    let p_c = programAddressList.indexOf(jmp_address);
    console.log(`Jump to ${jmp_address}`);
    return p_c;
}

function JP(mnemonic) {
    console.log("\n-----JP-----");
    mnemonic = mnemonic.split(" ");
    let jmp_address = mnemonic[1];
    jmp_address = parseInt(jmp_address, 16).toString(16).toUpperCase().padStart(4, '0')
    if (flag[0] === 0) {
        let p_c = programAddressList.indexOf(jmp_address);
        console.log(`Jump to ${jmp_address}`);
        return p_c;
    } else if (flag[0] === 1) {
        console.log("Jump completed...");
        return "A";
    }
}

function JM(mnemonic) {
    console.log("\n-----JM-----");
    mnemonic = mnemonic.split(" ");
    let jmp_address = mnemonic[1];
    jmp_address = parseInt(jmp_address, 16).toString(16).toUpperCase().padStart(4, '0')
    if (flag[0] === 1) {
        let p_c = programAddressList.indexOf(jmp_address);
        console.log(`Jump to ${jmp_address}`);
        return p_c;
    } else if (flag[0] === 0) {
        console.log("Jump completed...");
        return "A";
    }
}

function JPE(mnemonic) {
    console.log("\n-----JPE-----");
    mnemonic = mnemonic.split(" ");
    let jmp_address = mnemonic[1];
    jmp_address = parseInt(jmp_address, 16).toString(16).toUpperCase().padStart(4, '0')
    if (flag[5] === 1) {
        let p_c = programAddressList.indexOf(jmp_address);
        console.log(`Jump to ${jmp_address}`);
        return p_c;
    } else if (flag[5] === 0) {
        console.log("Jump completed...");
        return "A";
    }
}

function JPO(mnemonic) {
    console.log("\n-----JPO-----");
    mnemonic = mnemonic.split(" ");
    let jmp_address = mnemonic[1];
    jmp_address = parseInt(jmp_address, 16).toString(16).toUpperCase().padStart(4, '0')
    if (flag[5] === 0) {
        let p_c = programAddressList.indexOf(jmp_address);
        console.log(`Jump to ${jmp_address}`);
        return p_c;
    } else if (flag[5] === 1) {
        console.log("Jump completed...");
        return "A";
    }
}

function JC(mnemonic) {
    console.log("\n-----JC-----");
    mnemonic = mnemonic.split(" ");
    let jmp_address = mnemonic[1];
    jmp_address = parseInt(jmp_address, 16).toString(16).toUpperCase().padStart(4, '0')
    if (flag[7] === 1) {
        let p_c = programAddressList.indexOf(jmp_address);
        console.log(`Jump to ${jmp_address}`);
        return p_c;
    } else if (flag[7] === 0) {
        console.log("Jump completed...");
        return "A";
    }
}

function JNC(mnemonic) {
    console.log("\n-----JNC-----");
    mnemonic = mnemonic.split(" ");
    let jmp_address = mnemonic[1];
    console.log(jmp_address)
    jmp_address = parseInt(jmp_address, 16).toString(16).toUpperCase().padStart(4, '0')
    if (flag[7] === 0) {
        let p_c = programAddressList.indexOf(jmp_address);
        console.log(`Jump to ${jmp_address}`);
        return p_c;
    } else if (flag[7] === 1) {
        console.log("Jump completed...");
        return "A";
    }
}

function JZ(mnemonic) {
    console.log("\n-----JZ-----");
    mnemonic = mnemonic.split(" ");
    let jmp_address = mnemonic[1];
    jmp_address = parseInt(jmp_address, 16).toString(16).toUpperCase().padStart(4, '0')
    if (flag[1] === 1) {
        let p_c = programAddressList.indexOf(jmp_address);
        console.log(`Jump to ${jmp_address}`);
        return p_c;
    } else if (flag[1] === 0) {
        console.log("Jump completed...");
        return "A";
    }
}

function JNZ(mnemonic) {
    console.log("\n-----JNZ-----");
    mnemonic = mnemonic.split(" ");
    let jmp_address = mnemonic[1];
    jmp_address = parseInt(jmp_address, 16).toString(16).toUpperCase().padStart(4, '0')
    if (flag[1] === 0) {
        let p_c = programAddressList.indexOf(jmp_address);
        console.log(`Jump to ${jmp_address}`);
        return p_c;
    } else if (flag[1] === 1) {
        console.log("\nJump completed...");
        return "A";
    }
}

function LDA(mnemonic) {
    console.log("\n-----LDA-----");
    mnemonic = mnemonic.split(" ");
    let address = mnemonic[1];
    let address_index = memoryLocationList.indexOf(address);
    reg_value[0] = parseInt(memoryLocationValue[address_index], 16).toString(16);
    reg_value[0] = fillZero(reg_value[0]);
    console.log(`[${address}] = ${memoryLocationValue[address_index]}`);
    console.log(`[A] = ${reg_value[0]}`);
}

function LDAX(mnemonic) {
    console.log("\n-----LDAX-----");
    mnemonic = mnemonic.split(" ");
    let reg_1 = mnemonic[1];
    reg_1 = reg_list.indexOf(reg_1);
    let higher_byte = reg_value[reg_1];
    higher_byte = fillZero(higher_byte);
    let reg_2 = reg_1 + 1;
    let lower_byte = reg_value[reg_2];
    lower_byte = fillZero(lower_byte);
    let address = `${higher_byte}${lower_byte}`;
    let address_index = memoryLocationList.indexOf(address);
    reg_value[0] = memoryLocationValue[address_index];
    reg_value[0] = fillZero(reg_value[0]);
    console.log(`[${reg_list[reg_1]}] = ${reg_value[reg_1]}`);
    console.log(`[${reg_list[reg_2]}] = ${reg_value[reg_2]}`);
    console.log(`[${address}] = ${memoryLocationValue[address_index]}`);
    console.log(`[A] = ${reg_value[0]}`);
}

function LXI(mnemonic) {
    console.log("\n-----LXI-----");
    mnemonic = mnemonic.split(" ");
    let operand = mnemonic[1].split(",");
    let [higher_byte, lower_byte] = splitAddress(operand[1]);
    if (operand[0] === "B" || operand[0] === "D" || operand[0] === "H") {
        let reg_1 = reg_list.indexOf(operand[0]);
        reg_value[reg_1] = parseInt(higher_byte, 16).toString(16);
        reg_value[reg_1] = fillZero(reg_value[reg_1]);
        let reg_2 = reg_1 + 1;
        reg_value[reg_2] = parseInt(lower_byte, 16).toString(16);
        reg_value[reg_2] = fillZero(reg_value[reg_2]);
        console.log(`Address = ${operand[1]}`);
        console.log(`[${reg_list[reg_1]}] = ${reg_value[reg_1]}`);
        console.log(`[${reg_list[reg_2]}] = ${reg_value[reg_2]}`);
    } else if (operand[0] === "SP") {
        stack_pointer = operand[1];
        stack_pointer = fillZero(stack_pointer);
        stack[0] = stack_pointer;
    } else {
        console.log("Register invalid");
    }
    if (operand[0] === "H") {
        if (address_location_list.length !== 0) {
            let M = `${reg_value[6]}${reg_value[7]}`;
            let M_index = memoryLocationList.indexOf(M);
            reg_value[8] = memoryLocationValue[M_index];
            reg_value[8] = fillZero(reg_value[8]);
            console.log(`[M] = [${operand[1]}] = ${reg_value[8]}`);
        }
    }
}

function LHLD(mnemonic) {
    console.log("\n-----LHLD-----");
    mnemonic = mnemonic.split(" ");
    let address = mnemonic[1];
    let address_index = memoryLocationList.indexOf(address);
    reg_value[7] = memoryLocationValue[address_index];
    reg_value[7] = fillZero(reg_value[7]);
    address_index += 1;
    reg_value[6] = memoryLocationValue[address_index];
    reg_value[6] = fillZero(reg_value[6]);
    console.log(`[${address}] = ${memoryLocationValue[address_index]}`);
    console.log(`[H] = ${reg_value[6]}`);
    console.log(`[L] = ${reg_value[7]}`);
}

function SHLD(mnemonic) {
    console.log("\n-----SHLD-----");
    mnemonic = mnemonic.split(" ");
    let address = mnemonic[1];
    let address_index = memoryLocationList.indexOf(address);
    memoryLocationValue[address_index] = reg_value[7];
    memoryLocationValue[address_index] = fillZero(memoryLocationValue[address_index]);
    address_index += 1;
    memoryLocationValue[address_index] = reg_value[6];
    memoryLocationValue[address_index] = fillZero(memoryLocationValue[address_index]);
    console.log(`[H] = ${reg_value[6]}`);
    console.log(`[L] = ${reg_value[7]}`);
    console.log(`[${address}] = ${memoryLocationValue[address_index]}`);
}

function MOV(mnemonic) {
    console.log("\n-----MOV-----");
    mnemonic = mnemonic.split(" ");
    mnemonic = mnemonic[1].split(",");
    let reg_1 = mnemonic[0];
    let reg_2 = mnemonic[1];
    if (reg_2 === "M") {
        memory_address_M(1);
    }
    let reg_1_index = reg_list.indexOf(reg_1);
    let reg_2_index = reg_list.indexOf(reg_2);
    reg_value[reg_1_index] = reg_value[reg_2_index];
    if (reg_1 === "M") {
        memory_address_M(0);
    }
    console.log(`[${reg_list[reg_2_index]}] = ${reg_value[reg_2_index]}`);
    console.log(`[${reg_list[reg_1_index]}] = ${reg_value[reg_1_index]}`);
}

function MVI(mnemonic, addressLocationList = null, addressValueList = null) {
    console.log("\n-----MVI-----");
    mnemonic = mnemonic.split(" ");
    let operand = mnemonic[1].split(",");
    let reg_1 = reg_list.indexOf(operand[0]);
    if (operand[0] === "M") {
        memory_address_M(0);
    }
    if (operand[1].length === 2) {
        operand[1] = parseInt(operand[1], 16).toString(16);
        reg_value[reg_1] = operand[1];
    } else if (operand[1].length === 4) {
        let reg_temp = memoryLocationList.indexOf(operand[1]);
        reg_value[reg_1] = memoryLocationValue[reg_temp];
        console.log(`[${operand[1]}] = ${addressValueList[reg_temp]}`);
    }
    reg_value[reg_1] = fillZero(reg_value[reg_1]);
    console.log(`[${reg_list[reg_1]}] = ${reg_value[reg_1]}`);
}

function ORA(mnemonic) {
    console.log("\n-----ORA-----");
    mnemonic = mnemonic.split(" ");
    let reg_1 = mnemonic[1];
    let reg_1_index = reg_list.indexOf(reg_1);
    if (reg_1 === "M") {
        memory_address_M(1);
    }
    reg_value[0] = (parseInt(reg_value[0], 16) | parseInt(reg_value[reg_1_index], 16)).toString(16);
    console.log(`[A] = ${reg_value[0]}`);
    checkAccumulator();
    reg_value[0] = fillZero(reg_value[0]);
}

function ORI(mnemonic) {
    console.log("\n-----ORI-----");
    mnemonic = mnemonic.split(" ");
    let immediate_value = mnemonic[1];
    if (immediate_value.length === 2) {
        reg_value[0] = (parseInt(reg_value[0], 16) | parseInt(immediate_value, 16)).toString(16);
    } else {
        console.log("Invalid value: Expected value is one byte hexadecimal value");
    }
    console.log(`[A] = ${reg_value[0]}`);
    checkAccumulator();
    reg_value[0] = fillZero(reg_value[0]);
}

function PUSH(mnemonic) {
    console.log("\n-----PUSH-----");
    mnemonic = mnemonic.split(" ");
    let reg_1 = mnemonic[1];
    if (reg_1 === "PSW") {
        let higher_byte = fillZero(reg_value[0]);
        stack_value.push(higher_byte);
        let lower_byte = fillZero(parseInt(reg_value[1].join(''), 2).toString(16));
        stack_pointer = fillZero((parseInt(stack_pointer, 16) - 1).toString(16));
        stack.push(stack_pointer);
        stack_value.push(lower_byte);
        stack_pointer = fillZero((parseInt(stack_pointer, 16) - 1).toString(16));
        console.log(`Higher byte = [A] = ${higher_byte}`);
        console.log(`Lower byte = flag = ${lower_byte}`);
    } else {
        reg_1 = reg_list.indexOf(reg_1);
        let higher_byte = fillZero(reg_value[reg_1]);
        let reg_2 = reg_1 + 1;
        let lower_byte = fillZero(reg_value[reg_2]);
        stack_value.push(higher_byte);
        stack_pointer = fillZero((parseInt(stack_pointer, 16) - 1).toString(16));
        stack.push(stack_pointer);
        stack_value.push(lower_byte);
        stack_pointer = fillZero((parseInt(stack_pointer, 16) - 1).toString(16));
        console.log(`Higher byte = [${reg_list[reg_1]}] = ${higher_byte}`);
        console.log(`Lower byte = [${reg_list[reg_2]}] = ${lower_byte}`);
    }
    console.log(`Stack pointer = ${stack_pointer}`);
    console.log(`Stack = ${stack}`);
    console.log(`Stack value = ${stack_value}`);
}

function POP(mnemonic) {
    console.log("\n-----POP-----");
    mnemonic = mnemonic.split(" ");
    let reg_1 = mnemonic[1];
    if (reg_1 === "PSW") {
        let lower_byte = fillZero(stack_value.pop());
        let flag = (parseInt(lower_byte, 16)).toString(2).padStart(8, '0');
        stack.pop();
        reg_value[1] = flag.split('');
        stack_pointer = fillZero((parseInt(stack_pointer, 16) + 1).toString(16));
        let higher_byte = fillZero(stack_value.pop());
        reg_value[0] = higher_byte;
        stack_pointer = fillZero((parseInt(stack_pointer, 16) + 1).toString(16));
        console.log(`Flag_binary = ${flag}`);
        console.log(`Flag = ${reg_value[1]}`);
        console.log(`Higher byte = [A] = ${higher_byte}`);
        console.log(`Lower byte = flag = ${lower_byte}`);
    } else {
        reg_1 = reg_list.indexOf(reg_1);
        let reg_2 = reg_1 + 1;
        let lower_byte = fillZero(stack_value.pop());
        reg_value[reg_2] = lower_byte;
        stack.pop();
        stack_pointer = fillZero((parseInt(stack_pointer, 16) + 1).toString(16));
        let higher_byte = fillZero(stack_value.pop());
        reg_value[reg_1] = higher_byte;
        stack_pointer = fillZero((parseInt(stack_pointer, 16) + 1).toString(16));
        console.log(`Higher byte = [${reg_list[reg_1]}] = ${higher_byte}`);
        console.log(`Lower byte = [${reg_list[reg_2]}] = ${lower_byte}`);
    }
    console.log(`Stack pointer = ${stack_pointer}`);
    console.log(`Stack = ${stack}`);
    console.log(`Stack value = ${stack_value}`);
}

function RET() {
    console.log("\n-----RET-----");
    let lower_byte = fillZero(stack_value.pop());
    stack_pointer = fillZero((parseInt(stack_pointer, 16) + 1).toString(16));
    let higher_byte = fillZero(stack_value.pop());
    ret_address = fillZero(higher_byte + lower_byte);
    console.log(`Returning to ${ret_address}`);
}

function RC() {
    console.log("\n-----RC-----");
    if (flag[7] === 1) {
        let lower_byte = fillZero(stack_value.pop());
        stack_pointer = fillZero((parseInt(stack_pointer, 16) + 1).toString(16));
        let higher_byte = fillZero(stack_value.pop());
        ret_address = fillZero(higher_byte + lower_byte);
        console.log(`Returning to ${ret_address}`);
        return true;
    } else {
        return false;
    }
}

function RNC() {
    console.log("\n-----RNC-----");
    if (flag[7] === 0) {
        let lower_byte = fillZero(stack_value.pop());
        stack_pointer = fillZero((parseInt(stack_pointer, 16) + 1).toString(16));
        let higher_byte = fillZero(stack_value.pop());
        ret_address = fillZero(higher_byte + lower_byte);
        console.log(`Returning to ${ret_address}`);
        return true;
    } else {
        return false;
    }
}

function RP() {
    console.log("\n-----RP-----");
    if (flag[0] === 0) {
        let lower_byte = fillZero(stack_value.pop());
        stack_pointer = fillZero((parseInt(stack_pointer, 16) + 1).toString(16));
        let higher_byte = fillZero(stack_value.pop());
        ret_address = fillZero(higher_byte + lower_byte);
        console.log(`Returning to ${ret_address}`);
        return true;
    } else {
        return false;
    }
}

function RM() {
    console.log("\n-----RM-----");
    if (flag[0] === 1) {
        let lower_byte = fillZero(stack_value.pop());
        stack_pointer = fillZero((parseInt(stack_pointer, 16) + 1).toString(16));
        let higher_byte = fillZero(stack_value.pop());
        ret_address = fillZero(higher_byte + lower_byte);
        console.log(`Returning to ${ret_address}`);
        return true;
    } else {
        return false;
    }
}

function RPE() {
    console.log("\n-----RPE-----");
    if (flag[5] === 1) {
        let lower_byte = fillZero(stack_value.pop());
        stack_pointer = fillZero((parseInt(stack_pointer, 16) + 1).toString(16));
        let higher_byte = fillZero(stack_value.pop());
        ret_address = fillZero(higher_byte + lower_byte);
        console.log(`Returning to ${ret_address}`);
        return true;
    } else {
        return false;
    }
}

function RPO() {
    console.log("\n-----RPO-----");
    if (flag[5] === 0) {
        let lower_byte = fillZero(stack_value.pop());
        stack_pointer = fillZero((parseInt(stack_pointer, 16) + 1).toString(16));
        let higher_byte = fillZero(stack_value.pop());
        ret_address = fillZero(higher_byte + lower_byte);
        console.log(`Returning to ${ret_address}`);
        return true;
    } else {
        return false;
    }
}

function RZ() {
    console.log("\n-----RZ-----");
    if (flag[1] === 1) {
        let lower_byte = fillZero(stack_value.pop());
        stack_pointer = fillZero((parseInt(stack_pointer, 16) + 1).toString(16));
        let higher_byte = fillZero(stack_value.pop());
        ret_address = fillZero(higher_byte + lower_byte);
        console.log(`Returning to ${ret_address}`);
        return true;
    } else {
        return false;
    }
}

function RNZ() {
    console.log("\n-----RNZ-----");
    if (flag[1] === 0) {
        let lower_byte = fillZero(stack_value.pop());
        stack_pointer = fillZero((parseInt(stack_pointer, 16) + 1).toString(16));
        let higher_byte = fillZero(stack_value.pop());
        ret_address = fillZero(higher_byte + lower_byte);
        console.log(`Returning to ${ret_address}`);
        return true;
    } else {
        return false;
    }
}

function RLC() {
    console.log("\n-----RLC-----");
    reg_value[0] = parseInt(reg_value[0], 16) << 1;
    reg_value[0] = reg_value[0].toString(16);
    reg_value[0] = fillZero(reg_value[0]);
    console.log(`[A] = ${reg_value[0]}`);
}

function RRC() {
    console.log("\n-----RRC-----");
    reg_value[0] = parseInt(reg_value[0], 16) >> 1;
    reg_value[0] = reg_value[0].toString(16);
    reg_value[0] = fillZero(reg_value[0]);
    console.log(`[A] = ${reg_value[0]}`);
}

function STA(mnemonic) {
    console.log("\n-----STA-----");
    mnemonic = mnemonic.split(" ");
    let address = mnemonic[1];
    let address_index = memoryLocationList.indexOf(address);
    memoryLocationValue[address_index] = reg_value[0];
    memoryLocationValue[address_index] = fillZero(memoryLocationValue[address_index]);
    console.log(`[A] = ${reg_value[0]}`);
    console.log(`[${address}] = ${memoryLocationValue[address_index]}`);
}

function STAX(mnemonic) {
    console.log("\n-----STAX-----");
    mnemonic = mnemonic.split(" ");
    let reg_1 = mnemonic[1];
    reg_1 = reg_list.indexOf(reg_1);
    let higher_byte = reg_value[reg_1];
    higher_byte = fillZero(higher_byte);
    let reg_2 = reg_1 + 1;
    let lower_byte = reg_value[reg_2];
    lower_byte = fillZero(lower_byte);
    let address = `${higher_byte}${lower_byte}`;
    let address_index = memoryLocationList.indexOf(address);
    reg_value[0] = fillZero(reg_value[0]);
    memoryLocationValue[address_index] = reg_value[0];
    console.log(`[A] = ${reg_value[0]}`);
    console.log(`[${reg_list[reg_1]}] = ${reg_value[reg_1]}`);
    console.log(`[${reg_list[reg_2]}] = ${reg_value[reg_2]}`);
    console.log(`[${address}] = ${memoryLocationValue[address_index]}`);
}

function SUB(mnemonic) {
    console.log("\n-----SUB-----");
    mnemonic = mnemonic.split(" ");
    let reg_1 = mnemonic[1];
    let reg_1_index = reg_list.indexOf(reg_1);
    if (reg_1 === "M") {
        memory_address_M(1);
    }
    if (parseInt(reg_value[0], 16) > parseInt(reg_value[reg_1_index], 16)) {
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt(reg_value[reg_1_index], 16)).toString(16);
    } else if (parseInt(reg_value[0], 16) === parseInt(reg_value[reg_1_index], 16)) {
        reg_value[0] = "0";
    } else if (parseInt(reg_value[0], 16) < parseInt(reg_value[reg_1_index], 16)) {
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt(reg_value[reg_1_index], 16)).toString(16);
        reg_value[0] = (parseInt(reg_value[0], 16) + parseInt("100", 16)).toString(16);
        flag[0] = 1;
        flag[7] = 1;
    }
    reg_value[0] = fillZero(reg_value[0]);
    console.log(`[A] = ${reg_value[0]}`);
    console.log(flag);
}

function SUI(mnemonic) {
    console.log("\n-----SUI-----");
    mnemonic = mnemonic.split(" ");
    let immediate_value = mnemonic[1];
    if (immediate_value.length === 2) {
        if (parseInt(reg_value[0], 16) > parseInt(immediate_value, 16)) {
            reg_value[0] = (parseInt(reg_value[0], 16) - parseInt(immediate_value, 16)).toString(16);
        } else {
            reg_value[0] = (parseInt(reg_value[0], 16) - parseInt(immediate_value, 16)).toString(16);
            reg_value[0] = (parseInt(reg_value[0], 16) + parseInt("100", 16)).toString(16);
            flag[0] = 1;
            flag[7] = 1;
        }
    } else {
        console.log("Invalid value: Expected value is one byte hexadecimal value");
    }
    console.log(`[A] = ${reg_value[0]}`);
    reg_value[0] = fillZero(reg_value[0]);
}

function XCHG(mnemonic) {
    console.log("\n-----XCHG-----");
    console.log("Before: ");
    console.log(`[H] = ${reg_value[6]}`);
    console.log(`[L] = ${reg_value[7]}`);
    console.log(`[D] = ${reg_value[4]}`);
    console.log(`[E] = ${reg_value[5]}`);

    let reg_H = reg_value[6];
    let reg_L = reg_value[7];
    let reg_D = reg_value[4];
    let reg_E = reg_value[5];

    reg_value[6] = reg_value[4];
    reg_value[7] = reg_value[5];
    reg_value[4] = reg_H;
    reg_value[5] = reg_L;

    reg_value[4] = fillZero(reg_value[4]);
    reg_value[5] = fillZero(reg_value[5]);
    reg_value[6] = fillZero(reg_value[6]);
    reg_value[7] = fillZero(reg_value[7]);

    console.log("\nAfter: ");
    console.log(`[H] = ${reg_value[6]}`);
    console.log(`[L] = ${reg_value[7]}`);
    console.log(`[D] = ${reg_value[4]}`);
    console.log(`[E] = ${reg_value[5]}`);
}

function XRA(mnemonic) {
    console.log("\n-----XRA-----");
    mnemonic = mnemonic.split(" ");
    let reg_1 = mnemonic[1];
    reg_1 = reg_list.indexOf(reg_1);

    if (reg_1 === "M") {
        memory_address_M(1);
    }

    reg_value[0] = (parseInt(reg_value[0], 16) ^ parseInt(reg_value[reg_1], 16)).toString(16);
    console.log(`[A] = ${reg_value[0]}`);
    checkAccumulator();
    reg_value[0] = fillZero(reg_value[0]);
}

function XRI(mnemonic) {
    console.log("\n-----XRI-----");
    mnemonic = mnemonic.split(" ");
    let immediate_value = mnemonic[1];

    if (immediate_value.length === 2) {
        reg_value[0] = (parseInt(reg_value[0], 16) ^ parseInt(immediate_value, 16)).toString(16);
    } else {
        console.log("Invalid value: Expected value is one byte hexadecimal value");
    }

    console.log(`[A] = ${reg_value[0]}`);
    checkAccumulator();
    reg_value[0] = fillZero(reg_value[0]);
}

function checkAccumulator() {
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
            regName = regName.toString(16).toUpperCase().padStart(2, '0')
            return regName.toUpperCase();
        } else if (regName.length === 3) {
            regName = regName.toString(16).toUpperCase().padStart(4, '0')
            return regName
        } else {
            return regName
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
            case "ADD C":
                machineCode = "81";
                break;
            case "ADD D":
                machineCode = "82";
                break;
            case "ADD E":
                machineCode = "83";
                break;
            case "ADD H":
                machineCode = "84";
                break;
            case "ADD L":
                machineCode = "85";
                break;
            case "ADD M":
                machineCode = "86";
                break;
            case "ANA A":
                machineCode = "A7";
                break;
            case "ANA B":
                machineCode = "A0";
                break;
            case "ANA C":
                machineCode = "A1";
                break;
            case "ANA D":
                machineCode = "A2";
                break;
            case "ANA E":
                machineCode = "A3";
                break;
            case "ANA H":
                machineCode = "A4";
                break;
            case "ANA L":
                machineCode = "A5";
                break;
            case "ANA M":
                machineCode = "A6";
                break;
            case "CMA":
                machineCode = "2F";
                break;
            case "CMP A":
                machineCode = "BF";
                break;
            case "CMP B":
                machineCode = "B8";
                break;
            case "CMP C":
                machineCode = "B9";
                break;
            case "CMP D":
                machineCode = "BA";
                break;
            case "CMP E":
                machineCode = "BB";
                break;
            case "CMP H":
                machineCode = "BC";
                break;
            case "CMP L":
                machineCode = "BD";
                break;
            case "CMP M":
                machineCode = "BE";
                break;
            case "DAD B":
                machineCode = "09";
                break;
            case "DAD D":
                machineCode = "19";
                break;
            case "DAD H":
                machineCode = "29";
                break;
            case "DAD SP":
                machineCode = "39";
                break;
            case "DCR A":
                machineCode = "3D";
                break;
            case "DCR B":
                machineCode = "05";
                break;
            case "DCR C":
                machineCode = "0D";
                break;
            case "DCR D":
                machineCode = "15";
                break;
            case "DCR E":
                machineCode = "1D";
                break;
            case "DCR H":
                machineCode = "25";
                break;
            case "DCR L":
                machineCode = "2D";
                break;
            case "DCR M":
                machineCode = "35";
                break;
            case "DCX B":
                machineCode = "0B";
                break;
            case "DCX D":
                machineCode = "1B";
                break;
            case "DCX H":
                machineCode = "2B";
                break;
            case "DCX SP":
                machineCode = "3B";
                break;
            case "HLT":
                machineCode = "76";
                break;
            case "INR A":
                machineCode = "3C";
                break;
            case "INR B":
                machineCode = "04";
                break;
            case "INR C":
                machineCode = "0C";
                break;
            case "INR D":
                machineCode = "14";
                break;
            case "INR E":
                machineCode = "1C";
                break;
            case "INR H":
                machineCode = "24";
                break;
            case "INR L":
                machineCode = "2C";
                break;
            case "INR M":
                machineCode = "34";
                break;
            case "INX B":
                machineCode = "03";
                break;
            case "INX D":
                machineCode = "13";
                break;
            case "INX H":
                machineCode = "23";
                break;
            case "INX M":
                machineCode = "33";
                break;
            case "LDAX B":
                machineCode = "0A";
                break;
            case "LDAX D":
                machineCode = "1A";
                break;
            case "MOV A,A":
                machineCode = "7F";
                break;
            case "MOV A,B":
                machineCode = "78";
                break;
            case "MOV A,C":
                machineCode = "79";
                break;
            case "MOV A,D":
                machineCode = "7A";
                break;
            case "MOV A,E":
                machineCode = "7B";
                break;
            case "MOV A,H":
                machineCode = "7C";
                break;
            case "MOV A,L":
                machineCode = "7D";
                break;
            case "MOV A,M":
                machineCode = "7E";
                break;
            case "MOV B,A":
                machineCode = "47";
                break;
            case "MOV B,B":
                machineCode = "40";
                break;
            case "MOV B,C":
                machineCode = "41";
                break;
            case "MOV B,D":
                machineCode = "42";
                break;
            case "MOV B,E":
                machineCode = "43";
                break;
            case "MOV B,H":
                machineCode = "44";
                break;
            case "MOV B,L":
                machineCode = "45";
                break;
            case "MOV B,M":
                machineCode = "46";
                break;
            case "MOV C,A":
                machineCode = "4F";
                break;
            case "MOV C,B":
                machineCode = "48";
                break;
            case "MOV C,C":
                machineCode = "49";
                break;
            case "MOV C,D":
                machineCode = "4A";
                break;
            case "MOV C,E":
                machineCode = "4B";
                break;
            case "MOV C,H":
                machineCode = "4C";
                break;
            case "MOV C,L":
                machineCode = "4D";
                break;
            case "MOV C,M":
                machineCode = "4E";
                break;
            case "MOV D,A":
                machineCode = "57";
                break;
            case "MOV D,B":
                machineCode = "50";
                break;
            case "MOV D,C":
                machineCode = "51";
                break;
            case "MOV D,D":
                machineCode = "52";
                break;
            case "MOV D,E":
                machineCode = "53";
                break;
            case "MOV D,H":
                machineCode = "54";
                break;
            case "MOV D,L":
                machineCode = "55";
                break;
            case "MOV D,M":
                machineCode = "56";
                break;
            case "MOV E,A":
                machineCode = "5F";
                break;
            case "MOV E,B":
                machineCode = "58";
                break;
            case "MOV E,C":
                machineCode = "59";
                break;
            case "MOV E,D":
                machineCode = "5A";
                break;
            case "MOV E,E":
                machineCode = "5B";
                break;
            case "MOV E,H":
                machineCode = "5C";
                break;
            case "MOV E,L":
                machineCode = "5D";
                break;
            case "MOV E,M":
                machineCode = "5E";
                break;
            case "MOV H,A":
                machineCode = "67";
                break;
            case "MOV H,B":
                machineCode = "60";
                break;
            case "MOV H,C":
                machineCode = "61";
                break;
            case "MOV H,D":
                machineCode = "62";
                break;
            case "MOV H,E":
                machineCode = "63";
                break;
            case "MOV H,H":
                machineCode = "64";
                break;
            case "MOV H,L":
                machineCode = "65";
                break;
            case "MOV H,M":
                machineCode = "66";
                break;
            case "MOV L,A":
                machineCode = "6F";
                break;
            case "MOV L,B":
                machineCode = "68";
                break;
            case "MOV L,C":
                machineCode = "69";
                break;
            case "MOV L,D":
                machineCode = "6A";
                break;
            case "MOV L,E":
                machineCode = "6B";
                break;
            case "MOV L,H":
                machineCode = "6C";
                break;
            case "MOV L,L":
                machineCode = "6D";
                break;
            case "MOV L,M":
                machineCode = "6E";
                break;
            case "MOV M,A":
                machineCode = "77";
                break;
            case "MOV M,B":
                machineCode = "70";
                break;
            case "MOV M,C":
                machineCode = "71";
                break;
            case "MOV M,D":
                machineCode = "72";
                break;
            case "MOV M,E":
                machineCode = "73";
                break;
            case "MOV M,H":
                machineCode = "74";
                break;
            case "MOV M,L":
                machineCode = "75";
                break;
            case "NOP":
                machineCode = "00";
                break;
            case "NOP":
                machineCode = "00";
                break;
            case "ORA A":
                machineCode = "B7";
                break;
            case "ORA B":
                machineCode = "B0";
                break;
            case "ORA C":
                machineCode = "B1";
                break;
            case "ORA D":
                machineCode = "B2";
                break;
            case "ORA E":
                machineCode = "B3";
                break;
            case "ORA H":
                machineCode = "B4";
                break;
            case "ORA L":
                machineCode = "B5";
                break;
            case "ORA M":
                machineCode = "B6";
                break;
            case "PUSH B":
                machineCode = "C5";
                break;
            case "PUSH D":
                machineCode = "D5";
                break;
            case "PUSH H":
                machineCode = "E5";
                break;
            case "PUSH PSW":
                machineCode = "F5";
                break;
            case "POP B":
                machineCode = "C1";
                break;
            case "POP D":
                machineCode = "D1";
                break;
            case "POP H":
                machineCode = "E1";
                break;
            case "POP PSW":
                machineCode = "F1";
                break;
            case "RET":
                machineCode = "C9";
                break;
            case "RC":
                machineCode = "D8";
                break;
            case "RNC":
                machineCode = "D0";
                break;
            case "RP":
                machineCode = "F0";
                break;
            case "RM":
                machineCode = "F8";
                break;
            case "RPE":
                machineCode = "E8";
                break;
            case "RPO":
                machineCode = "E0";
                break;
            case "RZ":
                machineCode = "C8";
                break;
            case "RNZ":
                machineCode = "C0";
                break;
            case "RLC":
                machineCode = "07";
                break;
            case "RRC":
                machineCode = "0F";
                break;
            case "STAX B":
                machineCode = "02";
                break;
            case "STAX D":
                machineCode = "12";
                break;
            case "SUB A":
                machineCode = "97";
                break;
            case "SUB B":
                machineCode = "90";
                break;
            case "SUB C":
                machineCode = "91";
                break;
            case "SUB D":
                machineCode = "92";
                break;
            case "SUB E":
                machineCode = "93";
                break;
            case "SUB H":
                machineCode = "94";
                break;
            case "SUB L":
                machineCode = "95";
                break;
            case "SUB M":
                machineCode = "96";
                break;
            case "XCHG":
                machineCode = "EB";
                break;
            case "XRA A":
                machineCode = "AF";
                break;
            case "XRA B":
                machineCode = "A8";
                break;
            case "XRA C":
                machineCode = "A9";
                break;
            case "XRA D":
                machineCode = "AA";
                break;
            case "XRA E":
                machineCode = "AB";
                break;
            case "XRA H":
                machineCode = "AC";
                break;
            case "XRA L":
                machineCode = "AD";
                break;
            case "XRA M":
                machineCode = "AE";
                break;
            default:
                console.log("Unknown instruction...");
                textTop.innerHTML = "SYNTAX ERROR"
                textBottom.value = ""
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
            case "ANI":
                machineCode = "E6";
                break;
            case "CPI":
                machineCode = "FE";
                break;
            case "ORI":
                machineCode = "F6";
                break;
            case "SUI":
                machineCode = "D6";
                break;
            case "XRI":
                machineCode = "EE";
                break;
            default:
                console.log("Unknown instruction...");
                textTop.innerHTML = "SYNTAX ERROR"
                textBottom.value = ""
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
            case "MVI B":
                machineCode = "06";
                break;
            case "MVI C":
                machineCode = "0E";
                break;
            case "MVI D":
                machineCode = "16";
                break;
            case "MVI E":
                machineCode = "1E";
                break;
            case "MVI H":
                machineCode = "26";
                break;
            case "MVI L":
                machineCode = "2E";
                break;
            case "MVI M":
                machineCode = "36";
                break;
            default:
                console.log("Unknown instruction...");
                textTop.innerHTML = "SYNTAX ERROR"
                textBottom.value = ""
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
            case "CC":
                machineCode = "DC";
                break;
            case "CNC":
                machineCode = "D4";
                break;
            case "CP":
                machineCode = "F4";
                break;
            case "CM":
                machineCode = "FC";
                break;
            case "CPE":
                machineCode = "EC";
                break;
            case "CPO":
                machineCode = "E4";
                break;
            case "CZ":
                machineCode = "CC";
                break;
            case "CNZ":
                machineCode = "C4";
                break;
            case "LDA":
                machineCode = "3A";
                break;
            case "STA":
                machineCode = "32";
                break;
            case "JMP":
                machineCode = "C3";
                break;
            case "JC":
                machineCode = "DA";
                break;
            case "JNC":
                machineCode = "D2";
                break;
            case "JZ":
                machineCode = "CA";
                break;
            case "JNZ":
                machineCode = "C2";
                break;
            case "JP":
                machineCode = "F2";
                break;
            case "JM":
                machineCode = "FA";
                break;
            case "JPE":
                machineCode = "EA";
                break;
            case "JPO":
                machineCode = "E2";
                break;
            case "LHLD":
                machineCode = "2A";
                break;
            case "SHLD":
                machineCode = "22";
                break;
            default:
                console.log("Unknown instruction...");
                textTop.innerHTML = "SYNTAX ERROR"
                textBottom.value = ""
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
            case "LXI D":
                machineCode = "11";
                break;
            case "LXI H":
                machineCode = "21";
                break;
            case "LXI SP":
                machineCode = "31";
                break;
            default:
                console.log("Unknown instruction...");
                textTop.innerHTML = "SYNTAX ERROR"
                textBottom.value = ""
                return { byte: "Error", machineCode: null, immediateValue: null };
        }

        console.log(`Byte = ${byte}, Machine code = ${machineCode}, Memory location = ${memoryLocation}`)
        retValue = [byte, machineCode, memoryLocation]
        console.log(retValue)
        return retValue
    } else {
        console.log("Unknown instruction...");
        textTop.innerHTML = "SYNTAX ERROR"
        textBottom.value = ""
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

    console.log("-----MEMORY VIEW/EDIT-----")
    console.log("If you want to change the value, type the desired value. Otherwise hit enter.")
    memoryFunc = 'active'

    textTop.innerHTML = "MEMORY VIEW/EDIT"
    textBottom.value = "ADDR:" + hexValue

    modeMemory = 0
    let addressPlace = textBottom.value
    hexValue = addressPlace.split(":")[1]
    console.log(`hexValue: ${hexValue}`)
    hexValue = (parseInt(hexValue, 16)).toString(16).padStart(4, '0')
    memoryLocationIndex = memoryLocationList.indexOf(hexValue)
    addressValue = memoryLocationValue[memoryLocationIndex]

    enter.addEventListener('click', enterMemory = () => {
        modeMemory = 1
        console.log("-                  -")

        memoryLocationIndex = memoryLocationList.indexOf(hexValue)
        addressValue = memoryLocationValue[memoryLocationIndex]

        if (initialMode === false && addressActiveStatus !== 'active') {
            hexValue = hexValue
            console.log(`hexValue = ${hexValue}`)
            memoryLocationIndex = memoryLocationList.indexOf(hexValue)
            let addressValue = memoryLocationValue[memoryLocationIndex]
            let newValue = addressValue
            let l = string.length
            console.log(addressValue)
            console.log(string.length)
            if (l !== 0) {
                newValue = string.padStart(2, '0')
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
                let addressLocationIndex = addressLocationList.indexOf(hexValue);
                if (addressLocationIndex !== -1) {
                    addressValueList[addressLocationIndex] = addressValue;
                } else {
                    addressValueList.push(addressValue);
                    addressLocationList.push(hexValue);
                }
            } else {
                addressValue = newValue
                console.log(`New Value: ${addressValue}`)
                addressValueList.pop()
                addressLocationList.pop()
                addressValueListBefore.pop()
                hexValue = (parseInt(hexValue, 16) - 1).toString(16).toUpperCase().padStart(4, '0')
                hexValue = hexValue
                memoryLocationIndex = memoryLocationList.indexOf(hexValue)
                addressValueListBefore.push(memoryLocationValue[memoryLocationIndex])
                let addressLocationIndex = addressLocationList.indexOf(hexValue);
                if (addressLocationIndex !== -1) {
                    addressValueList[addressLocationIndex] = addressValue;
                } else {
                    addressValueList.push(addressValue);
                    addressLocationList.push(hexValue);
                }
            }

            textBottom.value = `${hexValue}:${addressValue}`
            console.log(`Address location list = [${addressLocationList}]`)
            console.log(`Address value list before = [${addressValueListBefore}]`)
            console.log(`Address value list after = [${addressValueList}]`)

            hexValue = (parseInt(hexValue, 16) + 1).toString(16).toUpperCase().padStart(4, '0')
        }
    })
    escapeBtn.addEventListener('click', escapeMemory = () => {
        enter.removeEventListener('click', enterMemory)
        if (initialMode === false && memoryActiveStatus === 'active') {
            textTop.innerHTML = "MENU:   A,D,M,F, "
            textBottom.value = "C,G,S,R,I,E,P"
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
            addressValueListBefore = []
        }
    })
}

function address8085() {
    console.log("-----ADDRESS-----")
    let byte1
    modeAddress = 0
    addressActiveStatus = 'active'

    program = []
    addressList = []
    machineCodeList = []
    machineCodeList1 = []
    programAddressList = []

    textTop.innerHTML = "ASSEMBLE"
    textBottom.value = "ADDR:" + hexValue

    enter.addEventListener('click', enterAddress = () => {
        if (initialMode === false && memoryActiveStatus !== 'active' && executeActiveStatus !== 'active') {
            textBottom.value = ''
            modeAddress = 1
            textTop.innerHTML = `ASSEMBLE:${hexValue}`
            textBottom.value += `${string}`
            string = ''
            mnemonic = textBottom.value
            console.log(mnemonic)

            byte1 = byte8085(mnemonic)
            if (byte1 !== "error") {
                console.log(hexValue)
                programAddressList.push(hexValue);
                program.push(`${hexValue}:${mnemonic}`);
                let retValue = MNToMC(hexValue, mnemonic);
                console.log(retValue)
                if (nextAddress1 === null && nextAddress2 === null) {
                    machineCode = retValue[0].toString(16).toUpperCase().padStart(2, '0')
                    console.log(`Machine Code : ${machineCode}`)
                    textTop.innerHTML = `${hexValue}:${machineCode}`
                    textBottom.value = ''
                } else if (nextAddress2 === null) {
                    machineCode = retValue[0].toString(16).toUpperCase().padStart(2, '0')
                    nextAddress1 = retValue[1].toString(16).toUpperCase().padStart(2, '0')
                    console.log(`Machine Code : ${machineCode}:${nextAddress1}`)
                    textTop.innerHTML = `${hexValue}:${machineCode}:${nextAddress1}`
                    textBottom.value = ''
                } else {
                    machineCode = retValue[0].toString(16).toUpperCase().padStart(2, '0')
                    nextAddress1 = retValue[1].toString(16).toUpperCase().padStart(2, '0')
                    nextAddress2 = retValue[2].toString(16).toUpperCase().padStart(2, '0')
                    console.log(`Machine Code : ${machineCode}:${nextAddress1}:${nextAddress2}`)
                    textTop.innerHTML = `${hexValue}:${machineCode}:${nextAddress1}:${nextAddress2}`
                    textBottom.value = ''
                }
            }
            console.log(`byte: ${byte1}, ${byte}`)
            if (byte1 === 1) {
                hexValue = (parseInt(hexValue, 16) + parseInt("1", 16)).toString(16).toUpperCase().padStart(4, '0')
            } else if (byte1 === 2) {
                hexValue = (parseInt(hexValue, 16) + parseInt("2", 16)).toString(16).toUpperCase().padStart(4, '0')
            } else if (byte1 === 3) {
                hexValue = (parseInt(hexValue, 16) + parseInt("3", 16)).toString(16).toUpperCase().padStart(4, '0')
            }
            string = ''
        }
    })
    escapeBtn.addEventListener('click', escapeAddress = () => {
        enter.removeEventListener('click', enterAddress)
        if (initialMode === false && memoryActiveStatus !== 'active') {
            textTop.innerHTML = "MENU:   A,D,M,F, "
            textBottom.value = "C,G,S,R,I,E,P"
            console.log(`Program = [${program}]`)
            console.log(`Address list = [${addressList}]`)
            console.log(`Machine code list = [${machineCodeList}]`)
            console.log(`Machine code list 01 = [${machineCodeList1}]`)
            console.log(`Program address list = [${programAddressList}]`)
            initialMode = true
            modeAddress = 0
            addressActiveStatus = 'inactive'
        }
    })
}

// Not complete...
function instructionEncoder(machineCode) {
    console.log("Encoding Instruction...");
    console.log(`Machine code = ${machineCode}`);

    const oneByteList = ["00", "80", "81", "82", "83", "84", "85", "86", "87", "AO", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "2F", "B8", "B9", "BA", "BB", "BC", "BD", "BE", "BF", "09", "19", "29", "39", "05", "0D", "15", "1D", "25", "2D", "35", "3D", "0B", "1B", "2B", "3B", "76", "04", "0C", "14", "1C", "24", "2C", "34", "3C", "03", "13", "23", "33", "0A", "1A", "78", "79", "7A", "7B", "7C", "7D", "7E", "7F", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4A", "4B", "4C", "4D", "4E", "4F", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5A", "5B", "5C", "5D", "5E", "5F", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6A", "6B", "6C", "6D", "6E", "6F", "70", "71", "72", "73", "74", "75", "76", "77", "07", "0F", "B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "02", "12", "90", "91", "92", "93", "94", "95", "96", "97", "EB", "A8", "A9", "AA", "AB", "AC", "AD", "AE", "AF", "C9", "D8", "F8", "C0", "D0", "F0", "E8", "E0", "C8", "C1", "C5", "D1", "D5", "E1", "E5", "F1", "F5"];
    const twoByteList1 = ["C6", "D6", "E6", "F6", "EE", "FE"];
    const twoByteList2 = ["06", "0E", "16", "1E", "26", "2E", "36", "3E"];
    const threeByteList1 = ["22", "2A", "32", "3A", "C2", "C3", "CA", "CD", "DC", "FC", "D4", "C4", "CC", "F4", "EC", "FE", "E4", "D2", "DA", "E2", "EA", "F2", "FA"];
    const threeByteList2 = ["01", "11", "21", "31"];

    if (oneByteList.includes(machineCode)) {
        const byte = "ONE";
        let opcode;

        switch (machineCode) {
            case "87": opcode = "ADD A"; break;
            case "80": opcode = "ADD B"; break;
            case "81": opcode = "ADD C"; break;
            case "82": opcode = "ADD D"; break;
            case "83": opcode = "ADD E"; break;
            case "84": opcode = "ADD H"; break;
            case "85": opcode = "ADD L"; break;
            case "86": opcode = "ADD M"; break;
            case "A7": opcode = "ANA A"; break;
            case "A0": opcode = "ANA B"; break;
            case "A1": opcode = "ANA C"; break;
            case "A2": opcode = "ANA D"; break;
            case "A3": opcode = "ANA E"; break;
            case "A4": opcode = "ANA H"; break;
            case "A5": opcode = "ANA L"; break;
            case "A6": opcode = "ANA M"; break;
            case "2F": opcode = "CMA"; break;
            case "BF": opcode = "CMP A"; break;
            case "B8": opcode = "CMP B"; break;
            case "B9": opcode = "CMP C"; break;
            case "BA": opcode = "CMP D"; break;
            case "BB": opcode = "CMP E"; break;
            case "BC": opcode = "CMP H"; break;
            case "BD": opcode = "CMP L"; break;
            case "BE": opcode = "CMP M"; break;
            case "09": opcode = "DAD B"; break;
            case "19": opcode = "DAD D"; break;
            case "29": opcode = "DAD H"; break;
            case "39": opcode = "DAD SP"; break;
            case "3D": opcode = "DCR A"; break;
            case "05": opcode = "DCR B"; break;
            case "0D": opcode = "DCR C"; break;
            case "15": opcode = "DCR D"; break;
            case "1D": opcode = "DCR E"; break;
            case "25": opcode = "DCR H"; break;
            case "2D": opcode = "DCR L"; break;
            case "35": opcode = "DCR M"; break;
            case "0B": opcode = "DCX B"; break;
            case "1B": opcode = "DCX D"; break;
            case "2B": opcode = "DCX H"; break;
            case "3B": opcode = "DCX SP"; break;
            case "76": opcode = "HLT"; break;
            case "3C": opcode = "INR A"; break;
            case "04": opcode = "INR B"; break;
            case "0C": opcode = "INR C"; break;
            case "14": opcode = "INR D"; break;
            case "1C": opcode = "INR E"; break;
            case "24": opcode = "INR H"; break;
            case "2C": opcode = "INR L"; break;
            case "34": opcode = "INR M"; break;
            case "03": opcode = "INX B"; break;
            case "13": opcode = "INX D"; break;
            case "23": opcode = "INX H"; break;
            case "33": opcode = "INX SP"; break;
            case "0A": opcode = "LDAX B"; break;
            case "1A": opcode = "LDAX D"; break;
            case "7F": opcode = "MOV A,A"; break;
            case "78": opcode = "MOV A,B"; break;
            case "79": opcode = "MOV A,C"; break;
            case "7A": opcode = "MOV A,D"; break;
            case "7B": opcode = "MOV A,E"; break;
            case "7C": opcode = "MOV A,H"; break;
            case "7D": opcode = "MOV A,L"; break;
            case "7E": opcode = "MOV A,M"; break;
            case "47": opcode = "MOV B,A"; break;
            case "40": opcode = "MOV B,B"; break;
            case "41": opcode = "MOV B,C"; break;
            case "42": opcode = "MOV B,D"; break;
            case "43": opcode = "MOV B,E"; break;
            case "44": opcode = "MOV B,H"; break;
            case "45": opcode = "MOV B,L"; break;
            case "46": opcode = "MOV B,M"; break;
            case "4F": opcode = "MOV C,A"; break;
            case "48": opcode = "MOV C,B"; break;
            case "49": opcode = "MOV C,C"; break;
            case "4A": opcode = "MOV C,D"; break;
            case "4B": opcode = "MOV C,E"; break;
            case "4C": opcode = "MOV C,H"; break;
            case "4D": opcode = "MOV C,L"; break;
            case "4E": opcode = "MOV C,M"; break;
            case "57": opcode = "MOV D,A"; break;
            case "50": opcode = "MOV D,B"; break;
            case "51": opcode = "MOV D,C"; break;
            case "52": opcode = "MOV D,D"; break;
            case "53": opcode = "MOV D,E"; break;
            case "54": opcode = "MOV D,H"; break;
            case "55": opcode = "MOV D,L"; break;
            case "56": opcode = "MOV D,M"; break;
            case "5F": opcode = "MOV E,A"; break;
            case "58": opcode = "MOV E,B"; break;
            case "59": opcode = "MOV E,C"; break;
            case "5A": opcode = "MOV E,D"; break;
            case "5B": opcode = "MOV E,E"; break;
            case "5C": opcode = "MOV E,H"; break;
            case "5D": opcode = "MOV E,L"; break;
            case "5E": opcode = "MOV E,M"; break;
            case "67": opcode = "MOV H,A"; break;
            case "60": opcode = "MOV H,B"; break;
            case "61": opcode = "MOV H,C"; break;
            case "62": opcode = "MOV H,D"; break;
            case "63": opcode = "MOV H,E"; break;
            case "64": opcode = "MOV H,H"; break;
            case "65": opcode = "MOV H,L"; break;
            case "66": opcode = "MOV H,M"; break;
            case "6F": opcode = "MOV L,A"; break;
            case "68": opcode = "MOV L,B"; break;
            case "69": opcode = "MOV L,C"; break;
            case "6A": opcode = "MOV L,D"; break;
            case "6B": opcode = "MOV L,E"; break;
            case "6C": opcode = "MOV L,H"; break;
            case "6D": opcode = "MOV L,L"; break;
            case "6E": opcode = "MOV L,M"; break;
            case "77": opcode = "MOV M,A"; break;
            case "70": opcode = "MOV M,B"; break;
            case "71": opcode = "MOV M,C"; break;
            case "72": opcode = "MOV M,D"; break;
            case "73": opcode = "MOV M,E"; break;
            case "74": opcode = "MOV M,H"; break;
            case "75": opcode = "MOV M,L"; break;
            case "00": opcode = "NOP"; break;
            case "B7": opcode = "ORA A"; break;
            case "B0": opcode = "ORA B"; break;
            case "B1": opcode = "ORA C"; break;
            case "B2": opcode = "ORA D"; break;
            case "B3": opcode = "ORA E"; break;
            case "B4": opcode = "ORA H"; break;
            case "B5": opcode = "ORA L"; break;
            case "B6": opcode = "ORA M"; break;
            case "C5": opcode = "PUSH B"; break;
            case "D5": opcode = "PUSH D"; break;
            case "E5": opcode = "PUSH H"; break;
            case "F5": opcode = "PUSH PSW"; break;
            case "C1": opcode = "POP B"; break;
            case "D1": opcode = "POP D"; break;
            case "E1": opcode = "POP H"; break;
            case "F1": opcode = "POP PSW"; break;
            case "C9": opcode = "RET"; break;
            case "D8": opcode = "RC"; break;
            case "D0": opcode = "RNC"; break;
            case "F0": opcode = "RP"; break;
            case "F8": opcode = "RM"; break;
            case "E8": opcode = "RPE"; break;
            case "E0": opcode = "RPO"; break;
            case "C8": opcode = "RZ"; break;
            case "C0": opcode = "RNZ"; break;
            case "07": opcode = "RLC"; break;
            case "0F": opcode = "RRC"; break;
            case "02": opcode = "STAX B"; break;
            case "12": opcode = "STAX D"; break;
            case "97": opcode = "SUB A"; break;
            case "90": opcode = "SUB B"; break;
            case "91": opcode = "SUB C"; break;
            case "92": opcode = "SUB D"; break;
            case "93": opcode = "SUB E"; break;
            case "94": opcode = "SUB H"; break;
            case "95": opcode = "SUB L"; break;
            case "96": opcode = "SUB M"; break;
            case "EB": opcode = "XCHG"; break;
            case "AF": opcode = "XRA A"; break;
            case "A8": opcode = "XRA B"; break;
            case "A9": opcode = "XRA C"; break;
            case "AA": opcode = "XRA D"; break;
            case "AB": opcode = "XRA E"; break;
            case "AC": opcode = "XRA H"; break;
            case "AD": opcode = "XRA L"; break;
            case "AE": opcode = "XRA M"; break;
            default: break;
        }

        return [byte, opcode];
    } else if (twoByteList1.includes(machineCode)) {
        const byte = "TWO_1";
        let opcode;

        switch (machineCode) {
            case "C6": opcode = "ADI"; break;
            case "E6": opcode = "ANI"; break;
            case "FE": opcode = "CPI"; break;
            case "F6": opcode = "ORI"; break;
            case "D6": opcode = "SUI"; break;
            case "EE": opcode = "XRI"; break;
            default: break;
        }

        return [byte, opcode];
    } else if (twoByteList2.includes(machineCode)) {
        const byte = "TWO_2";
        let opcode;

        switch (machineCode) {
            case "3E": opcode = "MVI A"; break;
            case "06": opcode = "MVI B"; break;
            case "0E": opcode = "MVI C"; break;
            case "16": opcode = "MVI D"; break;
            case "1E": opcode = "MVI E"; break;
            case "26": opcode = "MVI H"; break;
            case "2E": opcode = "MVI L"; break;
            case "36": opcode = "MVI M"; break;
            default: break;
        }

        return [byte, opcode];
    } else if (threeByteList1.includes(machineCode)) {
        const byte = "THREE_1";
        let opcode;

        switch (machineCode) {
            case "CD": opcode = "CALL"; break;
            case "DC": opcode = "CC"; break;
            case "D4": opcode = "CNC"; break;
            case "CC": opcode = "CZ"; break;
            case "C4": opcode = "CNZ"; break;
            case "F4": opcode = "CP"; break;
            case "FC": opcode = "CM"; break;
            case "EC": opcode = "CPE"; break;
            case "E4": opcode = "CPO"; break;
            case "3A": opcode = "LDA"; break;
            case "32": opcode = "STA"; break;
            case "C3": opcode = "JMP"; break;
            case "DA": opcode = "JC"; break;
            case "D2": opcode = "JNC"; break;
            case "CA": opcode = "JZ"; break;
            case "C2": opcode = "JNZ"; break;
            case "F2": opcode = "JP"; break;
            case "FA": opcode = "JM"; break;
            case "EA": opcode = "JPE"; break;
            case "E2": opcode = "JPO"; break;
            case "2A": opcode = "LHLD"; break;
            case "22": opcode = "SHLD"; break;
            default: break;
        }

        return [byte, opcode];
    } else if (threeByteList2.includes(machineCode)) {
        const byte = "THREE_2";
        let opcode;

        switch (machineCode) {
            case "01": opcode = "LXI B"; break;
            case "11": opcode = "LXI D"; break;
            case "21": opcode = "LXI H"; break;
            case "31": opcode = "LXI SP"; break;
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
    p_c = 0
    textTop.innerHTML = "GO EXECUTE"
    textBottom.value = "ADDR:" + hexValue
    modeAddress = 0
    addressActiveStatus = 'active'

    enter.addEventListener('click', enterExecute = () => {
        if (initialMode === false && memoryActiveStatus !== 'active') {
            startAddress = textBottom.value.split(":")[1]
            console.log(startAddress)
            let addressPlace = textBottom.value
            hexValue = addressPlace.split(":")[1]
            hexValue = (parseInt(hexValue, 16)).toString(16).padStart(4, '0')
            console.log(program)
            program_1 = program.slice() // Assuming `program` is a global variable
            MC_to_MN(startAddress);
            textTop.innerHTML = "EXECUTING...."
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
                        p_c = programAddressList.indexOf(address_code);
                        p_c = p_c + 1;
                    }
                } else if (opcode === "JM") {
                    p_c = JC(instruction);
                    if (p_c === "A") {
                        p_c = programAddressList.indexOf(address_code);
                        p_c = p_c + 1;
                    }
                } else if (opcode === "JPE") {
                    p_c = JC(instruction);
                    if (p_c === "A") {
                        p_c = programAddressList.indexOf(address_code);
                        p_c = p_c + 1;
                    }
                } else if (opcode === "JPO") {
                    p_c = JC(instruction);
                    if (p_c === "A") {
                        p_c = programAddressList.indexOf(address_code);
                        p_c = p_c + 1;
                    }
                } else if (opcode === "JC") {
                    p_c = JC(instruction);
                    if (p_c === "A") {
                        p_c = programAddressList.indexOf(address_code);
                        p_c = p_c + 1;
                    }
                } else if (opcode === "JNC") {
                    p_c = JNC(instruction);
                    if (p_c === "A") {
                        p_c = programAddressList.indexOf(address_code);
                        p_c = p_c + 1;
                    }
                } else if (opcode === "JZ") {
                    p_c = JZ(instruction);
                    if (p_c === "A") {
                        p_c = programAddressList.indexOf(address_code);
                        p_c = p_c + 1;
                    }
                } else if (opcode === "JNZ") {
                    p_c = JNZ(instruction);
                    if (p_c === "A") {
                        p_c = programAddressList.indexOf(address_code);
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
                    p_c = programAddressList.indexOf(ret_address);
                } else if (opcode === "RC") {
                    let returnValue = RC(instruction);
                    if (returnValue) {
                        p_c = programAddressList.indexOf(ret_address);
                    } else {
                        p_c = p_c + 1;
                    }
                } else if (opcode === "RNC") {
                    let returnValue = RNC(instruction);
                    if (returnValue) {
                        p_c = programAddressList.indexOf(ret_address);
                    } else {
                        p_c = p_c + 1;
                    }
                } else if (opcode === "RP") {
                    let returnValue = RP(instruction);
                    if (returnValue) {
                        p_c = programAddressList.indexOf(ret_address);
                    } else {
                        p_c = p_c + 1;
                    }
                } else if (opcode === "RM") {
                    let returnValue = RM(instruction);
                    if (returnValue) {
                        p_c = programAddressList.indexOf(ret_address);
                    } else {
                        p_c = p_c + 1;
                    }
                } else if (opcode === "RPE") {
                    let returnValue = RPE(instruction);
                    if (returnValue) {
                        p_c = programAddressList.indexOf(ret_address);
                    } else {
                        p_c = p_c + 1;
                    }
                } else if (opcode === "RPO") {
                    let returnValue = RPO(instruction);
                    if (returnValue) {
                        p_c = programAddressList.indexOf(ret_address);
                    } else {
                        p_c = p_c + 1;
                    }
                } else if (opcode === "RZ") {
                    let returnValue = RZ(instruction);
                    if (returnValue) {
                        p_c = programAddressList.indexOf(ret_address);
                    } else {
                        p_c = p_c + 1;
                    }
                } else if (opcode === "RNZ") {
                    let returnValue = RNZ(instruction);
                    if (returnValue) {
                        p_c = programAddressList.indexOf(ret_address);
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

function memory_address_M(mode) {
    if (mode === 0) {
        console.log("Storing the value to Memory address...");
        reg_value[6] = fillZero(reg_value[6]);
        reg_value[7] = fillZero(reg_value[7]);
        M_address = reg_value[6] + reg_value[7];
        M_index = memoryLocationList.indexOf(M_address);
        memoryLocationValue[M_index] = reg_value[8];
        console.log(`[H] = ${reg_value[6]}, [L] = ${reg_value[7]}`);
        console.log(`[M] = [${M_address}] = ${reg_value[8]}`);
    } else if (mode === 1) {
        console.log("Retrieving the value from Memory address...");
        reg_value[6] = fillZero(reg_value[6]);
        reg_value[7] = fillZero(reg_value[7]);
        M_address = reg_value[6] + reg_value[7];
        M_index = memoryLocationList.indexOf(M_address);
        reg_value[8] = memoryLocationValue[M_index];
        console.log(`[M] = [${M_address}] = ${reg_value[8]}`);
        console.log(`[H] = ${reg_value[6]}, [L] = ${reg_value[7]}`);
    }
}


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

reset.addEventListener('click', () => {
    setTimeout(() => {
        enter.removeEventListener('click', enterExecute)
        hexButtons.forEach(hex => { hex.removeEventListener('click', hexFunc) })
        buttons.forEach(btn => { btn.removeEventListener('click', buttonFunc) })

        string = ''
        hexValue = '8000'
        hexAddress = '0000'
        memoryActiveStatus = 'inactive'
        addressActiveStatus = 'inactive'
        executeActiveStatus = 'inactive'
        initialMode = true
        modeMemory = 0
        modeAddress = 0
        modeExecute = 0

        textTop.innerHTML = "SCIENTIFIC TECH"
        textBottom.value = "8085 TRAINER KIT"
        setTimeout(() => {
            textTop.innerHTML = "MENU:   A,D,M,F, "
            textBottom.value = "C,G,S,R,I,E,P"
        }, 1000)
    }, 500)
    // spclButtons.forEach(spclbtn => {spclbtn.removeEventListener('click', spclFunc)})
})

buttons.forEach(btn => {
    btn.addEventListener('click', buttonFunc = () => {
        if (modeAddress === 0 && initialMode === false && addressActiveStatus === 'active') {
            if (btn.innerHTML === 'Backspace') {
                hexValue = hexValue.substring(0, hexValue.length - 1)
                textBottom.value = `ADDR:${hexValue}`
            } else if (hexValue.length < 4) {
                if (btn.innerHTML === 'Enter') {
                    textBottom.value = `ADDR:${hexValue}`
                } else if (btn.innerHTML !== 'Enter') {
                    hexValue += btn.innerHTML
                    textBottom.value = `ADDR:${hexValue}`
                }
            }
        } else if (modeAddress === 1 && initialMode === false && addressActiveStatus === 'active') {
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
                textTop.innerHTML = `ASSEMBLE:${hexValue}`
                textBottom.value = `${string}`
            }
        }
    })
})

hexButtons.forEach(hex => {
    hex.addEventListener('click', hexFunc = () => {
        if (modeMemory === 0 && initialMode === false && memoryActiveStatus === 'active') {
            if (hex.innerHTML === 'Backspace') {
                hexValue = hexValue.substring(0, hexValue.length - 1)
                console.log(hexValue)
                textBottom.value = `ADDR:${hexValue}`
            } else if (hexValue.length < 4) {
                if (hex.innerHTML === 'Enter') {
                    textBottom.value = `ADDR:${hexValue}`
                } else if (hex.innerHTML !== 'Enter') {
                    hexValue += hex.innerHTML
                    textBottom.value = `ADDR:${hexValue}`
                }
            }
        } else if (modeMemory === 1 && initialMode === false && memoryActiveStatus === 'active') {
            if (hex.innerHTML === 'Backspace') {
                console.log(string)
                string = addressValue
                string = string.substring(0, string.length - 1)
                addressValue = string
                let hexValueTemp = hexValue
                hexValueTemp = (parseInt(hexValueTemp, 16) - 1).toString(16).toUpperCase().padStart(4, '0')
                textBottom.value = `${hexValueTemp}:${addressValue}`
            } else if (string.length < 2) {
                if (hex.innerHTML === 'Enter') {
                    if (string !== '') {
                        addressValue = string
                        string = ''
                        console.log(`${hexValue}: ${addressValue}`)
                        textBottom.value = `${hexValue}:${addressValue}`
                    } else {
                        string = ''
                        console.log(`${hexValue}: ${addressValue}`)
                        textBottom.value = `${hexValue}:${addressValue}`
                    }
                } else {
                    let address1 = (parseInt(hexValue, 16) - 1).toString(16).toUpperCase().padStart(4, '0')
                    string += hex.innerHTML
                    addressValue = string
                    textBottom.value = `${address1}:${addressValue}`
                }
            }
        }
    })
})

spclButtons.forEach(spclbtn => {
    spclbtn.addEventListener('click', spclFunc = () => {
        if (spclbtn.innerHTML === 'M' && initialMode === true) {
            initialMode = false
            textTop.innerHTML = "MEMORY VIEW/EDIT"
            textBottom.value = "ADDR:" + hexValue
            memory8085()
        } else if (spclbtn.innerHTML === 'A' && initialMode === true) {
            initialMode = false
            textTop.innerHTML = "ASSEMBLE"
            textBottom.value = "ADDR:" + hexValue
            address8085()
        } else if (spclbtn.innerHTML === 'G' && initialMode === true) {
            initialMode = false
            textTop.innerHTML = "GO EXECUTE"
            textBottom.value = "ADDR:" + hexValue
            execute8085()
        } else if (spclbtn.innerHTML === 'R' && initialMode === true) {
            initialMode = false
            textTop.innerHTML = "REG VIEW/EDIT"
            let regArray = ["PSW", "BC", "DE", "HL"]
            textBottom.value = `${regArray[0]}:${fillZero(reg_value[0]) + fillZero(parseInt(reg_value[1].join(''), 2).toString(16))}`
            let i = 1
            let j = 2
            let k = 3

            enter.addEventListener('click', enterExecute = () => {
                console.log(i)
                if (i === 0) {
                    textBottom.value = `${regArray[i]}:${fillZero(reg_value[j]) + fillZero(parseInt(reg_value[1].join(''), 2).toString(16))}`
                    i += 1
                    j += 2
                    k += 2
                } else {
                    textBottom.value = `${regArray[i]}:${fillZero(reg_value[j]) + fillZero(reg_value[k])}`
                    i += 1
                    j += 2
                    k += 2
                    if (i > regArray.length - 1) {
                        i = 0; j = 0; k = 1;
                    }
                }
            })

            console.log(`A = ${fillZero(reg_value[0])} flag = ${reg_value[1]} = ${fillZero(parseInt(reg_value[1].join(''), 2).toString(16))}`);
            console.log(`B = ${fillZero(reg_value[2])} C = ${fillZero(reg_value[3])}`);
            console.log(`D = ${fillZero(reg_value[4])} E = ${fillZero(reg_value[5])}`);
            console.log(`H = ${fillZero(reg_value[6])} L = ${fillZero(reg_value[7])}`);
        }
    })
})
