let textLCD = document.getElementById('lcd')

let hexButtons = document.querySelectorAll('.hex')
let regButtons = document.querySelectorAll('.reg')
let spclButtons = document.querySelectorAll('.spclbtn')

let reset = document.querySelector('#reset')
let next = document.querySelector('#next')
let execute = document.querySelector('#execute')
let sub = document.querySelector('#sub')
let go = document.querySelector('#go')
let decrement = document.querySelector('#decrement')
let string = ''
let address = '0000'
let byte, machine_code, ivMl, ret_value, nextAddress1, nextAddress2, address_value, address_1
let reg_active_status = 'inactive'
let initial_mode = true
let mode = 0
let ret_address
let one_byte, mnemonic
let two_byte
let three_byte

textLCD.value = '.  '

let memory_location_value = []
n = 0;
for (let i = 0; i < 65535; i++) {
    n = Math.floor(Math.random() * 255).toString(16)
    if (parseInt(n, 16) < 16) {
        n = n.padStart(2, '0')
    }
    memory_location_value.push(n.toUpperCase())
}
console.log(memory_location_value)

let A = "0"
let flag = [0, 0, 0, 0, 0, 0, 0, 0]
let B = "0"
let C = "0"
let D = "0"
let E = "0"
let H = "0"
let L = "0"
let M = "0"
let reg_list = ["A", "flag", "B", "C", "D", "E", "H", "L", "M"]

let reg_value = [A, flag, B, C, D, E, H, L, M]
let M_address = reg_value[6] + reg_value[7]
let M_index
let stack = ["0FFF"]
let stack_value = []
let stack_pointer = "0FFF"

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

function ADD(mnemonic) {
    console.log("-----ADD-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    reg_1 = reg_list.indexOf(reg_1);
    if (reg_1 === 8) {
        memory_address_M(1);
    }
    reg_value[0] = (parseInt(reg_value[0], 16) + parseInt(reg_value[reg_1], 16)).toString(16);
    if (parseInt(reg_value[0], 16) > 255) {
        check_accumulator();
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt("100", 16)).toString(16);
    }
    reg_value[0] = reg_value[0].padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
}

function ADI(mnemonic) {
    console.log("-----ADI-----");
    let split_mnemonic = mnemonic.split(" ");
    let immediate_value = split_mnemonic[1];
    if (immediate_value.length === 2 && /^[0-9A-Fa-f]{2}$/.test(immediate_value)) {
        // ChatGPT included the && /^[0-9A-Fa-f]{2}$/.test(immediate_value) in the JavaScript code to validate 
        // whether the immediate_value extracted from the mnemonic is a valid two-digit hexadecimal value.
        reg_value[0] = (parseInt(reg_value[0], 16) + parseInt(immediate_value, 16)).toString(16);
        console.log(reg_value[0])

        if (parseInt(reg_value[0], 16) > 255) {
            check_accumulator();
            reg_value[0] = (parseInt(reg_value[0], 16) - parseInt("100", 16)).toString(16);
        }
    }
    reg_value[0] = reg_value[0].padStart(2, "0").toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
}
function ANA(mnemonic) {
    console.log("-----ANA-----");
    let split_mnemonic = mnemonic.split(' ');
    let reg_1 = split_mnemonic[1];
    let reg_index = reg_list.indexOf(reg_1);
    if (reg_1 === "M") {
        memory_address_M(1);
    }
    reg_value[0] = parseInt(reg_value[0], 16) && parseInt(reg_value[reg_index], 16);
    check_accumulator();
    reg_value[0] = reg_value[0].toString(16).padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
}

function ANI(mnemonic) {
    console.log("-----ANI-----");
    let split_mnemonic = mnemonic.split(' ');
    let immediate_value = split_mnemonic[1];
    if (immediate_value.length === 2) {
        reg_value[0] = (parseInt(reg_value[0], 16) && parseInt(immediate_value, 16)).toString(16);
        check_accumulator();
    } else {
        console.log("Invalid value: Expected value is one byte hexadecimal value");
        return;
    }
    reg_value[0] = reg_value[0].toString(16).padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
}

function CALL(mnemonic) {
    let call_address = mnemonic.split(' ')[1];
    ret_address = (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    let [higher_byte, lower_byte] = split_address(ret_address);
    stack_value.push(higher_byte);
    stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
    stack_value.push(lower_byte);
    address = parseInt(call_address, 16).toString(16).padStart(4, '0').toUpperCase();
    console.log(`Going to ${call_address}`);
    console.log(`Stack pointer = ${stack_pointer}`);
    console.log(`Stack = ${stack}`);
    console.log(`Stack value = ${stack_value}`);

    return address;
}

function CC(mnemonic) {
    console.log("-----CC-----");
    if (flag[7] === 1) {
        let split_mnemonic = mnemonic.split(' ');
        let call_address = split_mnemonic[1];
        ret_address = (parseInt(call_address, 16) + 1).toString(16).toUpperCase().padStart(4, '0');
        let [higher_byte, lower_byte] = split_address(ret_address);
        stack.push(stack_pointer);
        stack_value.push(higher_byte);
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).toUpperCase().padStart(4, '0');
        stack_value.push(lower_byte);
        address = (parseInt(call_address, 16)).toString(16).toUpperCase().padStart(4, '0');
        console.log(`Going to ${call_address}`);
        console.log(`Stack pointer = ${stack_pointer}`);
        console.log(`Stack = ${stack}`);
        console.log(`Stack value = ${stack_value}`);
        return address;
    } else {
        return (parseInt(address, 16) + 1).toString(16).toUpperCase().padStart(4, '0');
    }
}

function CNC(mnemonic) {
    console.log("-----CNC-----");
    if (flag[7] === 0) {
        let split_mnemonic = mnemonic.split(' ');
        let call_address = split_mnemonic[1];
        ret_address = (parseInt(call_address, 16) + 1).toString(16).toUpperCase().padStart(4, '0');
        let [higher_byte, lower_byte] = split_address(ret_address);
        stack.push(stack_pointer);
        stack_value.push(higher_byte);
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).toUpperCase().padStart(4, '0');
        stack_value.push(lower_byte);
        address = (parseInt(call_address, 16)).toString(16).toUpperCase().padStart(4, '0');
        console.log(`Going to ${call_address}`);
        console.log(`Stack pointer = ${stack_pointer}`);
        console.log(`Stack = ${stack}`);
        console.log(`Stack value = ${stack_value}`);
        return address;
    } else {
        return (parseInt(address, 16) + 1).toString(16).toUpperCase().padStart(4, '0');
    }
}
function CP(mnemonic) {
    console.log("-----CP-----");
    if (flag[0] === 0) {
        let split_mnemonic = mnemonic.split(' ');
        let call_address = split_mnemonic[1];
        ret_address = (parseInt(call_address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let [higher_byte, lower_byte] = split_address(ret_address);
        stack.push(stack_pointer);
        stack_value.push(higher_byte);
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        stack_value.push(lower_byte);
        address = (parseInt(call_address, 16)).toString(16).padStart(4, '0').toUpperCase();
        console.log(`Going to ${call_address}`);
        console.log(`Stack pointer = ${stack_pointer}`);
        console.log(`Stack = ${stack}`);
        console.log(`Stack value = ${stack_value}`);
        return address;
    } else {
        return (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    }
}

function CM(mnemonic) {
    console.log("-----CM-----");
    if (flag[0] === 1) {
        let split_mnemonic = mnemonic.split(' ');
        let call_address = split_mnemonic[1];
        ret_address = (parseInt(call_address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let [higher_byte, lower_byte] = split_address(ret_address);
        stack.push(stack_pointer);
        stack_value.push(higher_byte);
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        stack_value.push(lower_byte);
        address = (parseInt(call_address, 16)).toString(16).padStart(4, '0').toUpperCase();
        console.log(`Going to ${call_address}`);
        console.log(`Stack pointer = ${stack_pointer}`);
        console.log(`Stack = ${stack}`);
        console.log(`Stack value = ${stack_value}`);
        return address;
    } else {
        return (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    }
}

function CPE(mnemonic) {
    console.log("-----CPE-----");
    if (flag[5] === 1) {
        let split_mnemonic = mnemonic.split(' ');
        let call_address = split_mnemonic[1];
        ret_address = (parseInt(call_address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let [higher_byte, lower_byte] = split_address(ret_address);
        stack.push(stack_pointer);
        stack_value.push(higher_byte);
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        stack_value.push(lower_byte);
        address = (parseInt(call_address, 16)).toString(16).padStart(4, '0').toUpperCase();
        console.log(`Going to ${call_address}`);
        console.log(`Stack pointer = ${stack_pointer}`);
        console.log(`Stack = ${stack}`);
        console.log(`Stack value = ${stack_value}`);
        return address;
    } else {
        return (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    }
}

function CPO(mnemonic) {
    console.log("-----CPO-----");
    if (flag[5] === 0) {
        let split_mnemonic = mnemonic.split(' ');
        let call_address = split_mnemonic[1];
        ret_address = (parseInt(call_address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let [higher_byte, lower_byte] = split_address(ret_address);
        stack.push(stack_pointer);
        stack_value.push(higher_byte);
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        stack_value.push(lower_byte);
        address = (parseInt(call_address, 16)).toString(16).padStart(4, '0').toUpperCase();
        console.log(`Going to ${call_address}`);
        console.log(`Stack pointer = ${stack_pointer}`);
        console.log(`Stack = ${stack}`);
        console.log(`Stack value = ${stack_value}`);
        return address;
    } else {
        return (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    }
}

function CMA(mnemonic) {
    console.log("-----CMA-----");
    reg_value[0] = (0 - parseInt(reg_value[0], 16)).toString(16); // Negating value
    reg_value[0] = (parseInt(reg_value[0], 16) + parseInt("FF", 16)).toString(16).padStart(2, '0').toUpperCase(); // Adding FF
    flag[0] = 1;
    flag[7] = 1;
    reg_value[0] = reg_value[0].padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
}

function CMP(mnemonic) {
    console.log("-----CMP-----");
    let split_mnemonic = mnemonic.split(' ');
    let reg_1 = split_mnemonic[1];
    let reg_index = reg_list.indexOf(reg_1);
    if (reg_1 === "M") {
        memory_address_M(1);
    }
    if (parseInt(reg_value[0], 16) < parseInt(reg_value[reg_index], 16)) {
        flag[1] = 0;
        flag[7] = 1;
        console.log(`[A] < [${reg_list[reg_index]}]`);
    } else if (parseInt(reg_value[0], 16) === parseInt(reg_value[reg_index], 16)) {
        flag[1] = 1;
        flag[7] = 0;
        console.log(`[A] = [${reg_list[reg_index]}]`);
    } else if (parseInt(reg_value[0], 16) > parseInt(reg_value[reg_index], 16)) {
        flag[1] = 0;
        flag[7] = 0;
        console.log(`[A] > [${reg_list[reg_index]}]`);
    }
}

function CPI(mnemonic) {
    console.log("-----CPI-----");
    let split_mnemonic = mnemonic.split(' ');
    let immediate_value = split_mnemonic[1];
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
}

function DAD(mnemonic) {
    console.log("-----DAD-----");
    let split_mnemonic = mnemonic.split(' ');
    let reg_1 = split_mnemonic[1];
    if (reg_1 === "SP") {
        // Handle SP case if needed
    } else {
        let reg_1_index = reg_list.indexOf(reg_1);
        let reg_2_index = reg_1_index + 1;

        reg_value[7] = (parseInt(reg_value[7], 16) + parseInt(reg_value[reg_2_index], 16)).toString(16);
        if (parseInt(reg_value[7], 16) > 255) {
            check_flag(reg_value[7]);
            reg_value[7] = (parseInt(reg_value[7], 16) - parseInt("100", 16)).toString(16);
            reg_value[6] = (parseInt(reg_value[6], 16) + parseInt(reg_value[reg_1_index], 16) + 1).toString(16);
            if (parseInt(reg_value[6], 16) > 255) {
                check_flag(reg_value[6]);
                reg_value[6] = (parseInt(reg_value[6], 16) - parseInt("100", 16)).toString(16);
            }
        } else {
            reg_value[6] = (parseInt(reg_value[6], 16) + parseInt(reg_value[reg_1_index], 16)).toString(16);
            if (parseInt(reg_value[6], 16) > 255) {
                check_flag(reg_value[6]);
                reg_value[6] = (parseInt(reg_value[6], 16) - parseInt("100", 16)).toString(16);
            }
        }
    }
    reg_value[6] = reg_value[6].padStart(2, '0').toUpperCase();
    reg_value[7] = reg_value[7].padStart(2, '0').toUpperCase();
    console.log(`[H] = ${reg_value[6]}`);
    console.log(`[L] = ${reg_value[7]}`);
}

function DCR(mnemonic) {
    console.log("-----DCR-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    let reg_index = reg_list.indexOf(reg_1);
    if (reg_1 === "M") {
        memory_address_M(1);
    }
    reg_value[reg_index] = (parseInt(reg_value[reg_index], 16) - 1).toString(16).toUpperCase();
    if (reg_1 === "M") {
        memory_address_M(0);
    }
    console.log(`[${reg_list[reg_index]}] = ${reg_value[reg_index]}`);
    check_flag(reg_value[reg_index]);
    reg_value[reg_index] = reg_value[reg_index].padStart(2, '0').toUpperCase();
}

function DCX(mnemonic) {
    console.log("-----DCX-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    let reg_1_index = reg_list.indexOf(reg_1);
    let reg_2_index = reg_1_index + 1;
    if (parseInt(reg_value[reg_2_index], 16) === 0) {
        reg_value[reg_1_index] = (parseInt(reg_value[reg_1_index], 16) - 1).toString(16).toUpperCase();
        reg_value[reg_2_index] = 'FF';
    } else {
        reg_value[reg_2_index] = (parseInt(reg_value[reg_2_index], 16) - 1).toString(16).toUpperCase();
    }
    reg_value[reg_1_index] = reg_value[reg_1_index].padStart(2, '0').toUpperCase();
    reg_value[reg_2_index] = reg_value[reg_2_index].padStart(2, '0').toUpperCase();
    console.log(`[${reg_list[reg_1_index]}] = ${reg_value[reg_1_index]}`);
    console.log(`[${reg_list[reg_2_index]}] = ${reg_value[reg_2_index]}`);
}

function INR(mnemonic) {
    console.log("-----INR-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    let reg_index = reg_list.indexOf(reg_1);
    if (reg_1 === "M") {
        memory_address_M(1);
    }
    reg_value[reg_index] = (parseInt(reg_value[reg_index], 16) + 1).toString(16).toUpperCase();
    if (reg_1 === "M") {
        memory_address_M(0);
    }
    console.log(`[${reg_list[reg_index]}] = ${reg_value[reg_index]}`);
    check_flag(reg_value[reg_index]);
    reg_value[reg_index] = reg_value[reg_index].padStart(2, '0').toUpperCase();
}

function INX(mnemonic) {
    console.log("-----INX-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    let reg_1_index = reg_list.indexOf(reg_1);
    let reg_2_index = reg_1_index + 1;
    if (parseInt(reg_value[reg_2_index], 16) === 255) {
        reg_value[reg_1_index] = (parseInt(reg_value[reg_1_index], 16) + 1).toString(16).toUpperCase();
        reg_value[reg_2_index] = "00";
    } else {
        reg_value[reg_2_index] = (parseInt(reg_value[reg_2_index], 16) + 1).toString(16).toUpperCase();
    }
    reg_value[reg_1_index] = reg_value[reg_1_index].padStart(2, '0').toUpperCase();
    reg_value[reg_2_index] = reg_value[reg_2_index].padStart(2, '0').toUpperCase();
    if (reg_1 === "H") {
        M = reg_value[6] + reg_value[7];
        reg_value[8] = memory_location_value[parseInt(M, 16)].toString(16).padStart(2, '0').toUpperCase();
    }
    console.log(`[${reg_list[reg_1_index]}] = ${reg_value[reg_1_index]}`);
    console.log(`[${reg_list[reg_2_index]}] = ${reg_value[reg_2_index]}`);
}

function JMP(mnemonic) {
    console.log("-----JMP-----");
    mnemonic = mnemonic.split(' ');
    let jmp_address = mnemonic[1];
    console.log(`Jumping to ${jmp_address}`);
    return jmp_address;
}

function JP(mnemonic) {
    console.log("-----JP-----");
    mnemonic = mnemonic.split(' ');
    let jmp_address = mnemonic[1];
    if (flag[0] === 0) {
        console.log(`Jumping to ${jmp_address}`);
        return [null, jmp_address];
    } else if (flag[0] === 1) {
        console.log("No jumping!");
        let bit = "no jump";
        return [bit, null];
    }
}

function JM(mnemonic) {
    console.log("-----JM-----");
    mnemonic = mnemonic.split(' ');
    let jmp_address = mnemonic[1];
    if (flag[0] === 1) {
        console.log(`Jumping to ${jmp_address}`);
        return [null, jmp_address];
    } else if (flag[0] === 0) {
        console.log("No jumping!");
        let bit = "no jump";
        return [bit, null];
    }
}

function JPE(mnemonic) {
    console.log("-----JPE-----");
    mnemonic = mnemonic.split(' ');
    let jmp_address = mnemonic[1];
    if (flag[5] === 1) {
        console.log(`Jumping to ${jmp_address}`);
        return [null, jmp_address];
    } else if (flag[5] === 0) {
        console.log("No jumping!");
        let bit = "no jump";
        return [bit, null];
    }
}

function JPO(mnemonic) {
    console.log("-----JPO-----");
    mnemonic = mnemonic.split(' ');
    let jmp_address = mnemonic[1];
    if (flag[5] === 0) {
        console.log(`Jumping to ${jmp_address}`);
        return [null, jmp_address];
    } else if (flag[5] === 1) {
        console.log("No jumping!");
        let bit = "no jump";
        return [bit, null];
    }
}

function JC(mnemonic) {
    console.log("-----JC-----");
    mnemonic = mnemonic.split(' ');
    let jmp_address = mnemonic[1];
    if (flag[7] === 1) {
        console.log(`Jumping to ${jmp_address}`);
        return [null, jmp_address];
    } else if (flag[7] === 0) {
        console.log("No jumping!");
        let bit = "no jump";
        return [bit, null];
    }
}

function JNC(mnemonic) {
    console.log("-----JNC-----");
    mnemonic = mnemonic.split(' ');
    let jmp_address = mnemonic[1];
    if (flag[7] === 0) {
        console.log(`Jumping to ${jmp_address}`);
        return [null, jmp_address];
    } else if (flag[7] === 1) {
        console.log("No jumping!");
        let bit = "no jump";
        return [bit, null];
    }
}

function JZ(mnemonic) {
    console.log("-----JZ-----");
    mnemonic = mnemonic.split(' ');
    let jmp_address = mnemonic[1];
    if (flag[1] === 1) {
        console.log(`Jumping to ${jmp_address}`);
        return [null, jmp_address];
    } else if (flag[1] === 0) {
        console.log("No jumping!");
        let bit = "no jump";
        return [bit, null];
    }
}

function JNZ(mnemonic) {
    console.log("-----JNZ-----");
    mnemonic = mnemonic.split(' ');
    let jmp_address = mnemonic[1];
    if (flag[1] === 0) {
        console.log(`Jumping to ${jmp_address}`);
        return [null, jmp_address];
    } else if (flag[1] === 1) {
        console.log("No jumping!");
        let bit = "no jump";
        return [bit, null];
    }
}

function LDA(mnemonic) {
    console.log("-----LDA-----");
    mnemonic = mnemonic.split(' ');
    let address = mnemonic[1];
    reg_value[0] = parseInt(memory_location_value[parseInt(address, 16)], 16).toString(16).padStart(4, '0').toUpperCase();
    console.log(`[${address}] = ${memory_location_value[parseInt(address, 16)]}`);
    console.log(`[A] = ${reg_value[0]}`);
}

function LDAX(mnemonic) {
    console.log("-----LDAX-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    reg_1 = reg_list.indexOf(reg_1);
    let higher_byte = reg_value[reg_1].toString(16).padStart(2, '0').toUpperCase();
    let reg_2 = reg_1 + 1;
    let lower_byte = reg_value[reg_2].toString(16).padStart(2, '0').toUpperCase();
    let address = higher_byte + lower_byte;
    reg_value[0] = memory_location_value[parseInt(address, 16)].toString(16).padStart(2, '0').toUpperCase();
    console.log(`[${reg_list[reg_1]}] = ${reg_value[reg_1]}`);
    console.log(`[${reg_list[reg_2]}] = ${reg_value[reg_2]}`);
    console.log(`[${address}] = ${memory_location_value[parseInt(address, 16)]}`);
    console.log(`[A] = ${reg_value[0]}`);
}

function LXI(mnemonic) {
    console.log("-----LXI-----");
    let operand = mnemonic.split(' ')[1].split(',');
    let [higher_byte, lower_byte] = split_address(operand[1]);

    if (operand[0] === "B" || operand[0] === "D" || operand[0] === "H") {
        let reg_1 = reg_list.indexOf(operand[0]);
        reg_value[reg_1] = parseInt(higher_byte, 16).toString(16).padStart(2, '0').toUpperCase();
        let reg_2 = reg_1 + 1;
        reg_value[reg_2] = parseInt(lower_byte, 16).toString(16).padStart(2, '0').toUpperCase();
        console.log(`Address = ${operand[1]}`);
        console.log(`[${reg_list[reg_1]}] = ${reg_value[reg_1]}`);
        console.log(`[${reg_list[reg_2]}] = ${reg_value[reg_2]}`);
    } else if (operand[0] === "SP") {
        stack[0] = parseInt(operand[1], 16).toString(16).padStart(4, '0').toUpperCase();
    } else {
        console.log("Register invalid");
    }

    if (operand[0] === "H") {
        reg_value[8] = memory_location_value[parseInt(operand[1], 16)].toString(16).padStart(2, '0').toUpperCase();
        console.log(`[M] = [${operand[1]}] = ${reg_value[8]}`);
    }
}
function LHLD(mnemonic) {
    console.log("-----LHLD-----");
    mnemonic = mnemonic.split(' ');
    let address = mnemonic[1]
    reg_value[7] = memory_location_value[parseInt(address, 16)].toString(16).padStart(2, '0').toUpperCase();
    reg_value[6] = memory_location_value[parseInt(address, 16) + 1].toString(16).padStart(2, '0').toUpperCase();
    console.log(`[${address}] = ${memory_location_value[address]}`);
    console.log(`[H] = ${reg_value[6]}`);
    console.log(`[L] = ${reg_value[7]}`);
}

function SHLD(mnemonic) {
    console.log("-----SHLD-----");
    mnemonic = mnemonic.split(' ');
    let address = mnemonic[1]
    memory_location_value[parseInt(address, 16)] = reg_value[7].toString(16).padStart(2, '0').toUpperCase();
    memory_location_value[parseInt(address, 16) + 1] = reg_value[6].toString(16).padStart(2, '0').toUpperCase();
    console.log(`[H] = ${reg_value[6]}`);
    console.log(`[L] = ${reg_value[7]}`);
    console.log(`[${address}] = ${memory_location_value[parseInt(address, 16)]}`);
}

function MOV(mnemonic) {
    console.log("-----MOV-----");
    mnemonic = mnemonic.split(' ');
    let operand = mnemonic[1].split(',');
    let reg_1 = operand[0];
    let reg_2 = operand[1];
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

function MVI(mnemonic) {
    console.log("-----MVI-----");
    mnemonic = mnemonic.split(' ');
    let operand = mnemonic[1].split(',');
    let reg_1_index = reg_list.indexOf(operand[0]);
    if (operand[0] === "M") {
        memory_address_M(0);
    }
    reg_value[reg_1_index] = parseInt(operand[1], 16).toString(16).padStart(2, '0').toUpperCase();
    console.log(`[${reg_list[reg_1_index]}] = ${reg_value[reg_1_index]}`);
}

function ORA(mnemonic) {
    console.log("-----ORA-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    let reg_1_index = reg_list.indexOf(reg_1);
    if (reg_1 === "M") {
        memory_address_M(1);
    }
    reg_value[0] = (parseInt(reg_value[0], 16) || parseInt(reg_value[reg_1_index], 16)).toString(16);
    console.log(`[A] = ${reg_value[0]}`);
    check_accumulator();
    reg_value[0] = reg_value[0].padStart(2, '0').toUpperCase();
}

function ORI(mnemonic) {
    console.log("-----ORI-----");
    mnemonic = mnemonic.split(' ');
    let immediate_value = mnemonic[1];
    if (immediate_value.length === 2) {
        reg_value[0] = (parseInt(reg_value[0], 16) || parseInt(immediate_value, 16)).toString(16);
    } else {
        console.log("Invalid value: Expected value is one byte hexadecimal value");
    }
    console.log(`[A] = ${reg_value[0]}`);
    check_accumulator();
    reg_value[0] = reg_value[0].padStart(2, '0').toUpperCase();
}

function PUSH(mnemonic) {
    console.log("-----PUSH-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    if (reg_1 === "PSW") {
        let higher_byte = reg_value[0].toString(16).padStart(2, '0').toUpperCase();
        let lower_byte = reg_value[1].join('').toString(2);
        let flag = parseInt(lower_byte, 2).toString(16).padStart(2, '0').toUpperCase();
        stack_value.push(flag);
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        stack.push(stack_pointer);
        stack_value.push(higher_byte);
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        console.log(`Higher byte = [A] = ${higher_byte}`);
        console.log(`Lower byte = flag = ${flag}`);
    } else {
        reg_1 = reg_list.indexOf(reg_1);
        let higher_byte = reg_value[reg_1].toString(16).padStart(2, '0').toUpperCase();
        let reg_2 = reg_1 + 1;
        let lower_byte = reg_value[reg_2].toString(16).padStart(2, '0').toUpperCase();
        stack_value.push(lower_byte);
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        stack.push(stack_pointer);
        stack_value.push(higher_byte);
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        console.log(`Higher byte = [${reg_list[reg_1]}] = ${higher_byte}`);
        console.log(`Lower byte = [${reg_list[reg_2]}] = ${lower_byte}`);
    }
    console.log(`Stack pointer = ${stack_pointer}`);
    console.log(`Stack = ${stack}`);
    console.log(`Stack value = ${stack_value}`);
}

function POP(mnemonic) {
    console.log("-----POP-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    if (reg_1 === "PSW") {
        let lower_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        let flag = parseInt(lower_byte, 16).toString(2).padStart(8, '0').split('');
        stack.pop();
        console.log(`Flag_binary = ${flag.join('')}`);
        reg_value[1] = flag;
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let higher_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        console.log(`Higher byte = [A] = ${higher_byte}`);
        console.log(`Lower byte = flag = ${lower_byte}`);
    } else {
        reg_1 = reg_list.indexOf(reg_1);
        let reg_2 = reg_1 + 1;
        reg_value[reg_2] = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        stack.pop();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        reg_value[reg_1] = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        console.log(`Higher byte = [${reg_list[reg_1]}] = ${reg_value[reg_1]}`);
        console.log(`Lower byte = [${reg_list[reg_2]}] = ${reg_value[reg_2]}`);
    }
    console.log(`Stack pointer = ${stack_pointer}`);
    console.log(`Stack = ${stack}`);
    console.log(`Stack value = ${stack_value}`);
}

function RET(mnemonic) {
    console.log("-----RET-----");
    let lower_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
    stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    let higher_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
    ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
    console.log(`Returning to ${ret_address}`);
}

function RC(mnemonic) {
    console.log("-----RC-----");
    let return_flag = false;
    if (flag[7] === 1) {
        let lower_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let higher_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
        console.log(`Returning to ${ret_address}`);
        return_flag = true;
    }
    return return_flag;
}

function RNC(mnemonic) {
    console.log("-----RNC-----");
    let return_flag = false;
    if (flag[7] === 0) {
        let lower_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let higher_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
        console.log(`Returning to ${ret_address}`);
        return_flag = true;
    }
    return return_flag;
}

function RP(mnemonic) {
    console.log("-----RP-----");
    let return_value;
    if (flag[0] === 0) {
        let lower_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let higher_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
        console.log(`Returning to ${ret_address}`);
        return_value = true;
    } else {
        return_value = false;
    }
    return return_value;
}

function RM(mnemonic) {
    console.log("-----RM-----");
    let return_value;
    if (flag[0] === 1) {
        let lower_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let higher_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
        console.log(`Returning to ${ret_address}`);
        return_value = true;
    } else {
        return_value = false;
    }
    return return_value;
}

function RPE(mnemonic) {
    console.log("-----RPE-----");
    if (flag[5] === 1) {
        let lower_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let higher_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
        console.log(`Returning to ${ret_address}`);
        return true;
    } else {
        return false;
    }
}

function RPO(mnemonic) {
    console.log("-----RPO-----");
    if (flag[5] === 0) {
        let lower_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let higher_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
        console.log(`Returning to ${ret_address}`);
        return true;
    } else {
        return false;
    }
}

function RZ(mnemonic) {
    console.log("-----RZ-----");
    if (flag[1] === 1) {
        let lower_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let higher_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
        console.log(`Returning to ${ret_address}`);
        return true;
    } else {
        return false;
    }
}

function RNZ(mnemonic) {
    console.log("-----RNZ-----");
    if (flag[1] === 0) {
        let lower_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let higher_byte = stack_value.pop().toString(16).padStart(2, '0').toUpperCase();
        ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
        console.log(`Returning to ${ret_address}`);
        return true;
    } else {
        return false;
    }
}
function RLC(mnemonic) {
    console.log("-----RLC-----");
    reg_value[0] = parseInt(reg_value[0], 16) << 1;
    reg_value[0] = reg_value[0].toString(16).padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
}

function RRC(instruction) {
    console.log("-----RRC-----");
    reg_value[0] = parseInt(reg_value[0], 16) >> 1;
    reg_value[0] = reg_value[0].toString(16).padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
}

function STA(mnemonic) {
    console.log("-----STA-----");
    mnemonic = mnemonic.split(' ');
    let address = parseInt(mnemonic[1], 16);
    memory_location_value[address] = reg_value[0].toString(16).padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
    console.log(`[${address}] = ${memory_location_value[address]}`);
}

function STAX(mnemonic) {
    console.log("-----STAX-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = reg_list.indexOf(mnemonic[1]);
    let higher_byte = reg_value[reg_1].toString(16).padStart(2, '0').toUpperCase();
    let reg_2 = reg_1 + 1;
    let lower_byte = reg_value[reg_2].toString(16).padStart(2, '0').toUpperCase();
    let address = `${higher_byte}${lower_byte}`;
    memory_location_value[parseInt(address, 16)] = reg_value[0];
    console.log(`[A] = ${reg_value[0]}`);
    console.log(`[${reg_list[reg_1]}] = ${reg_value[reg_1]}`);
    console.log(`[${reg_list[reg_2]}] = ${reg_value[reg_2]}`);
    console.log(`[${address}] = ${memory_location_value[parseInt(address, 16)]}`);
}

function SUB(mnemonic) {
    console.log("-----SUB-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    let reg_1_index = reg_list.indexOf(reg_1);
    if (reg_1 === "M") {
        memory_address_M(1);
    }
    if (parseInt(reg_value[0], 16) > parseInt(reg_value[reg_1_index], 16)) {
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt(reg_value[reg_1_index], 16)).toString(16);
    } else if (parseInt(reg_value[0], 16) === parseInt(reg_value[reg_1_index], 16)) {
        reg_value[0] = '0';
        flag[1] = 1;
    } else if (parseInt(reg_value[0], 16) < parseInt(reg_value[reg_1_index], 16)) {
        reg_value[0] = ((parseInt(reg_value[0], 16) - parseInt(reg_value[reg_1_index], 16)) + 0x100).toString(16).slice(1);
        flag[0] = 1;
        flag[7] = 1;
    }
    reg_value[0] = reg_value[0].padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
    console.log(flag);
}

function SUI(mnemonic) {
    console.log("-----SUI-----");
    mnemonic = mnemonic.split(' ');
    let immediate_value = mnemonic[1];
    if (immediate_value.length === 2) {
        if (parseInt(reg_value[0], 16) > parseInt(immediate_value, 16)) {
            reg_value[0] = (parseInt(reg_value[0], 16) - parseInt(immediate_value, 16)).toString(16);
        } else if (parseInt(reg_value[0], 16) === parseInt(immediate_value, 16)) {
            reg_value[0] = '0';
            flag[1] = 1;
        } else if (parseInt(reg_value[0], 16) < parseInt(immediate_value, 16)) {
            reg_value[0] = ((parseInt(reg_value[0], 16) - parseInt(immediate_value, 16)) + 0x100).toString(16).slice(1);
            flag[0] = 1;
            flag[7] = 1;
        }
    } else {
        console.log("Invalid value: Expected value is one byte hexadecimal value");
    }
    reg_value[0] = reg_value[0].padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
}

function XCHG(mnemonic) {
    console.log("-----XCHG-----");
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
    reg_value[4] = reg_value[4].padStart(2, '0').toUpperCase();
    reg_value[5] = reg_value[5].padStart(2, '0').toUpperCase();
    reg_value[6] = reg_value[6].padStart(2, '0').toUpperCase();
    reg_value[7] = reg_value[7].padStart(2, '0').toUpperCase();
    console.log("After: ");
    console.log(`[H] = ${reg_value[6]}`);
    console.log(`[L] = ${reg_value[7]}`);
    console.log(`[D] = ${reg_value[4]}`);
    console.log(`[E] = ${reg_value[5]}`);
}

function XRA(mnemonic) {
    console.log("-----XRA-----");
    mnemonic = mnemonic.split(' ');
    let reg1 = mnemonic[1];
    let reg_index = reg_list.indexOf(reg1);
    if (reg_index !== -1) {
        if (reg1 === 'M') {
            memory_address_M(1);
        }
        reg_value[0] = (parseInt(reg_value[0], 16) ^ parseInt(reg_value[reg_index], 16)).toString(16);
        console.log(`[A] = ${reg_value[0]}`);
        check_accumulator();
        reg_value[0] = reg_value[0].padStart(2, '0').toUpperCase();
    }
}

function XRI(mnemonic) {
    console.log("-----XRI-----");
    mnemonic = mnemonic.split(' ');
    let immediate_value = mnemonic[1];
    if (immediate_value.length === 2) {
        reg_value[0] = (parseInt(reg_value[0], 16) ^ parseInt(immediate_value, 16)).toString(16);
    } else {
        console.log("Invalid value: Expected value is one byte hexadecimal value");
    }
    console.log(`[A] = ${reg_value[0]}`);
    check_accumulator();
    reg_value[0] = reg_value[0].padStart(2, '0').toUpperCase();
}

function check_accumulator() {
    console.log("Checking Accumulator...");
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

function check_flag(reg_name) {
    console.log("Checking Flag...");
    if (parseInt(reg_name, 16) === 0) {
        flag[1] = 1;
    } else if (parseInt(reg_name, 16) !== 0) {
        flag[1] = 0;
    }
    if (parseInt(reg_name, 16) > 255) {
        flag[7] = 1;
    } else if (parseInt(reg_name, 16) <= 255) {
        flag[7] = 0;
    }
    console.log(`Flag = ${flag}`);
}

function split_address(address) {
    return [address.substring(0, 2), address.substring(2)];
}

function memory_8085() {
    console.log("-----MEMORY VIEW/EDIT-----");
    console.log("If you want to change the value, type the desired value. Otherwise hit next.");
    mode = 0
    address_value = memory_location_value[parseInt(address, 16)]
    next.addEventListener('click', nextMemory = () => {
        address_1 = address
        address_1 = (parseInt(address_1, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        address_value = memory_location_value[parseInt(address, 16)]
        let preString = memory_location_value[parseInt(address, 16)];
        textLCD.value = `${address}.${address_value}`
        console.log(`Actual value: ${address}:${address_value}`)
        if (string.length === 2) {
            memory_location_value[parseInt(address, 16) - 1] = string.toUpperCase();
        }
        mode = 1
        address_1 = (parseInt(address_1, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        address = (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        string = preString
    })
    reset.addEventListener('click', escapeMemory = () => {
        next.removeEventListener('click', nextMemory)
        reset.removeEventListener('click', escapeMemory)
        if (initial_mode === false) {
            textLCD.value = '.  '
            mode = 0
            initial_mode = true
            reg_active_status = 'inactive'
        }
    })
}

function instruction_encoder(machine_code) {
    let one_byte_list = [
        "00", "80", "81", "82", "83", "84", "85", "86", "87", "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7",
        "2F", "B8", "B9", "BA", "BB", "BC", "BD", "BE", "BF", "09", "19", "29", "39", "05", "0D", "15", "1D",
        "25", "2D", "35", "3D", "0B", "1B", "2B", "3B", "76", "04", "0C", "14", "1C", "24", "2C", "34", "3C",
        "03", "13", "23", "33", "0A", "1A", "78", "79", "7A", "7B", "7C", "7D", "7E", "7F", "40", "41", "42",
        "43", "44", "45", "46", "47", "48", "49", "4A", "4B", "4C", "4D", "4E", "4F", "50", "51", "52", "53",
        "54", "55", "56", "57", "58", "59", "5A", "5B", "5C", "5D", "5E", "5F", "60", "61", "62", "63", "64",
        "65", "66", "67", "68", "69", "6A", "6B", "6C", "6D", "6E", "6F", "70", "71", "72", "73", "74", "75",
        "76", "77", "07", "0F", "B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "02", "12", "90", "91", "92",
        "93", "94", "95", "96", "97", "EB", "A8", "A9", "AA", "AB", "AC", "AD", "AE", "AF", "C9", "D8", "F8",
        "C0", "D0", "F0", "E8", "E0", "C8", "C1", "C5", "D1", "D5", "E1", "E5", "F1", "F5"
    ]
    let two_byte_list_1 = ["C6", "D6", "E6", "F6", "EE", "FE"]
    let two_byte_list_2 = ["06", "0E", "16", "1E", "26", "2E", "36", "3E"]
    let three_byte_list_1 = ["22", "2A", "32", "3A", "C2", "C3", "CA", "CD", "DC", "FC", "D4", "C4", "CC",
        "F4", "EC", "FE", "E4", "D2", "DA", "E2", "EA", "F2", "FA"
    ]
    let three_byte_list_2 = ["01", "11", "21", "31"]
    if (one_byte_list.includes(machine_code)) {
        let byte = "ONE";
        let opcode;
        switch (machine_code) {
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
    } else if (two_byte_list_1.includes(machine_code)) {
        let byte = "TWO_1";
        let opcode;
        switch (machine_code) {
            case "C6": opcode = "ADI"; break;
            case "E6": opcode = "ANI"; break;
            case "FE": opcode = "CPI"; break;
            case "F6": opcode = "ORI"; break;
            case "D6": opcode = "SUI"; break;
            case "EE": opcode = "XRI"; break;
            default: break;
        }
        return [byte, opcode];
    } else if (two_byte_list_2.includes(machine_code)) {
        let byte = "TWO_2";
        let opcode;
        switch (machine_code) {
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
    } else if (three_byte_list_1.includes(machine_code)) {
        let byte = "THREE_1";
        let opcode;
        switch (machine_code) {
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
    } else if (three_byte_list_2.includes(machine_code)) {
        let byte = "THREE_2";
        let opcode;
        switch (machine_code) {
            case "01": opcode = "LXI B"; break;
            case "11": opcode = "LXI D"; break;
            case "21": opcode = "LXI H"; break;
            case "31": opcode = "LXI SP"; break;
            default: break;
        }
        return [byte, opcode];
    } else {
        let byte = null;
        let opcode = null;
        return [byte, opcode];
    }
}

function MC_to_MN(address) {
    let machine_code = memory_location_value[parseInt(address, 16)];
    machine_code = String(machine_code).padStart(2, '0').toUpperCase();
    let [byte, mnemonic_opcode] = instruction_encoder(machine_code); // iv_ml means immediate_value or memory_location
    let mnemonic = "";
    if (byte === "ONE") {
        mnemonic = mnemonic_opcode;
        console.log(`\n${address}:${mnemonic_opcode}`);
        address = (parseInt(address, 16)).toString(16).toUpperCase().padStart(4, '0');
    } else if (byte === "TWO_1") {
        let address_1 = address;
        address = (parseInt(address, 16) + 1).toString(16).toUpperCase().padStart(4, '0');
        machine_code = memory_location_value[parseInt(address, 16)];
        mnemonic = `${mnemonic_opcode} ${String(machine_code).padStart(2, '0')}`;
        console.log(`\n${address_1}:${mnemonic}`);
    } else if (byte === "TWO_2") {
        let address_1 = address;
        address = (parseInt(address, 16) + 1).toString(16).toUpperCase().padStart(4, '0');
        machine_code = memory_location_value[parseInt(address, 16)];
        mnemonic = `${mnemonic_opcode},${String(machine_code).padStart(2, '0')}`;
        console.log(`\n${address_1}:${mnemonic}`);
    } else if (byte === "THREE_1") {
        let address_1 = address;
        address = (parseInt(address, 16) + 3).toString(16).toUpperCase().padStart(4, '0');
        machine_code = memory_location_value[parseInt(address, 16) - 1];
        mnemonic = String(machine_code).padStart(2, '0').toUpperCase();
        address = (parseInt(address, 16) - 1).toString(16).toUpperCase().padStart(4, '0');
        machine_code = memory_location_value[parseInt(address, 16) - 1];
        machine_code = String(machine_code).padStart(2, '0').toUpperCase();
        mnemonic = parseInt(mnemonic + machine_code, 16).toString(16).toUpperCase().padStart(4, '0');
        mnemonic = `${mnemonic_opcode} ${mnemonic}`;
        console.log(`\n${address_1}:${mnemonic}`);
        address = (parseInt(address, 16)).toString(16).toUpperCase().padStart(4, '0');
    } else if (byte === "THREE_2") {
        let address_1 = address;
        address = (parseInt(address, 16) + 3).toString(16).toUpperCase().padStart(4, '0');
        machine_code = memory_location_value[parseInt(address, 16) - 1];
        mnemonic = String(machine_code).padStart(2, '0').toUpperCase();
        address = (parseInt(address, 16) - 1).toString(16).toUpperCase().padStart(4, '0');
        machine_code = memory_location_value[parseInt(address, 16) - 1];
        machine_code = String(machine_code).padStart(2, '0').toUpperCase();
        mnemonic = parseInt(mnemonic + machine_code, 16).toString(16).toUpperCase().padStart(4, '0');
        mnemonic = `${mnemonic_opcode},${mnemonic}`;
        console.log(`\n${address_1}:${mnemonic}`);
        address = (parseInt(address, 16)).toString(16).toUpperCase().padStart(4, '0');
    } else if (byte === null) {
        mnemonic = "UNKNOWN MNEMONIC";
        address = (parseInt(address, 16)).toString(16).toUpperCase().padStart(4, '0');
    }
    return [mnemonic, address];
}

function execute_8085() {
    mode = 0
    execute.addEventListener('click', executeProgram = () => {
        if (initial_mode === false && reg_active_status !== 'active') {
            address = (address).toString(16).toUpperCase().padStart(4, '0');
            console.log("Executing...");
            textLCD.value = `E     `
            while (true) {
                let [instruction, addr] = MC_to_MN(address);
                address = addr
                let opcode = instruction.split(' ')[0];
                switch (opcode) {
                    case "ADD": ADD(instruction); break;
                    case "ADI": ADI(instruction); break;
                    case "ANA": ANA(instruction); break;
                    case "ANI": ANI(instruction); break;
                    case "CALL":
                        address = CALL(instruction);
                        address = String(address).padStart(4, '0').toUpperCase();
                        break;
                    case "CC":
                        address = CC(instruction);
                        address = String(address).padStart(4, '0').toUpperCase();
                        break;
                    case "CNC":
                        address = CNC(instruction);
                        address = String(address).padStart(4, '0').toUpperCase();
                        break;
                    case "CP":
                        address = CP(instruction);
                        address = String(address).padStart(4, '0').toUpperCase();
                        break;
                    case "CM":
                        address = CM(instruction);
                        address = String(address).padStart(4, '0').toUpperCase();
                        break;
                    case "CPE":
                        address = CPE(instruction);
                        address = String(address).padStart(4, '0').toUpperCase();
                        break;
                    case "CPO":
                        address = CPO(instruction);
                        address = String(address).padStart(4, '0').toUpperCase();
                        break;
                    case "CZ":
                        address = CZ(instruction);
                        address = String(address).padStart(4, '0').toUpperCase();
                        break;
                    case "CNZ":
                        address = CNZ(instruction);
                        address = String(address).padStart(4, '0').toUpperCase();
                        break;
                    case "CMA": CMA(instruction); break;
                    case "CMP": CMP(instruction); break;
                    case "CMA": CMA(instruction); break;
                    case "CMP": CMP(instruction); break;
                    case "CPI": CPI(instruction); break;
                    case "DCR": DCR(instruction); break;
                    case "DCX": DCX(instruction); break;
                    case "DAD": DAD(instruction); break;
                    case "INR": INR(instruction); break;
                    case "INX": INX(instruction); break;
                    case "CPI": CPI(instruction); break;
                    case "DCR": DCR(instruction); break;
                    case "DCX": DCX(instruction); break;
                    case "DAD": DAD(instruction); break;
                    case "INR": INR(instruction); break;
                    case "INX": INX(instruction); break;
                    case "JMP":
                        address = JMP(instruction);
                        break;
                    case "JP":
                        address_1 = address;
                        result = JP(instruction);
                        address = result[1]
                        if (result[0] === "no jump") {
                            address = String((parseInt(address_1, 16) + 1).toString(16)).padStart(4, '0').toUpperCase();
                        }
                        break;
                    case "JM":
                        address_1 = address;
                        result = JM(instruction);
                        address = result[1]
                        if (result[0] === "no jump") {
                            address = String((parseInt(address_1, 16) + 1).toString(16)).padStart(4, '0').toUpperCase();
                        }
                        break;
                    case "JPE":
                        address_1 = address;
                        result = JPE(instruction);
                        address = result[1]
                        if (result[0] === "no jump") {
                            address = String((parseInt(address_1, 16) + 1).toString(16)).padStart(4, '0').toUpperCase();
                        }
                        break;
                    case "JPO":
                        address_1 = address;
                        result = JPO(instruction);
                        address = result[1]
                        if (result[0] === "no jump") {
                            address = String((parseInt(address_1, 16) + 1).toString(16)).padStart(4, '0').toUpperCase();
                        }
                        break;
                    case "JC":
                        address_1 = address;
                        result = JC(instruction);
                        address = result[1]
                        if (result[0] === "no jump") {
                            address = String((parseInt(address_1, 16) + 1).toString(16)).padStart(4, '0').toUpperCase();
                        }
                        break;
                    case "JNC":
                        address_1 = address;
                        result = JNC(instruction);
                        address = result[1]
                        if (result[0] === "no jump") {
                            address = String((parseInt(address_1, 16) + 1).toString(16)).padStart(4, '0').toUpperCase();
                        }
                        break;
                    case "JZ":
                        address_1 = address;
                        result = JZ(instruction);
                        address = result[1]
                        if (result[0] === "no jump") {
                            address = String((parseInt(address_1, 16) + 1).toString(16)).padStart(4, '0').toUpperCase();
                        }
                        break;
                    case "JNZ":
                        address_1 = address;
                        result = JNZ(instruction);
                        address = result[1]
                        if (result[0] === "no jump") {
                            address = String((parseInt(address_1, 16) + 1).toString(16)).padStart(4, '0').toUpperCase();
                        }
                        break;
                    case "LDA": LDA(instruction); break;
                    case "LDAX": LDAX(instruction); break;
                    case "LXI": LXI(instruction); break;
                    case "LHLD": LHLD(instruction); break;
                    case "SHLD": SHLD(instruction); break;
                    case "MOV": MOV(instruction); break;
                    case "MVI": MVI(instruction); break;
                    case "ORA": ORA(instruction); break;
                    case "ORI": ORI(instruction); break;
                    case "PUSH": PUSH(instruction); break;
                    case "POP": POP(instruction); break;
                    case "RET":
                        RET(instruction);
                        address = ret_address;
                        address = String(address).padStart(4, '0').toUpperCase();
                        break;
                    case "RC":
                        return_value = RC(instruction);
                        if (return_value === true) {
                            address = ret_address;
                            address = String(address).padStart(4, '0').toUpperCase();
                        } else {
                            address = String(parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
                        }
                        break;
                    case "RNC":
                        return_value = RNC(instruction);
                        if (return_value === true) {
                            address = ret_address;
                            address = String(address).padStart(4, '0').toUpperCase();
                        } else {
                            address = String(parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
                        }
                        break;
                    case "RP":
                        return_value = RP(instruction);
                        if (return_value === true) {
                            address = ret_address;
                            address = String(address).padStart(4, '0').toUpperCase();
                        } else {
                            address = String(parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
                        }
                        break;
                    case "RM":
                        return_value = RM(instruction);
                        if (return_value === true) {
                            address = ret_address;
                            address = String(address).padStart(4, '0').toUpperCase();
                        } else {
                            address = String(parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
                        }
                        break;
                    case "RPE":
                        return_value = RPE(instruction);
                        if (return_value === true) {
                            address = ret_address;
                            address = String(address).padStart(4, '0').toUpperCase();
                        } else {
                            address = String(parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
                        }
                        break;
                    case "RPO":
                        return_value = RPO(instruction);
                        if (return_value === true) {
                            address = ret_address;
                            address = String(address).padStart(4, '0').toUpperCase();
                        } else {
                            address = String(parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
                        }
                        break;
                    case "RZ":
                        return_value = RP(instruction);
                        if (return_value === true) {
                            address = ret_address;
                            address = String(address).padStart(4, '0').toUpperCase();
                        } else {
                            address = String(parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
                        }
                        break;
                    case "RNZ":
                        return_value = RP(instruction);
                        if (return_value === true) {
                            address = ret_address;
                            address = String(address).padStart(4, '0').toUpperCase();
                        } else {
                            address = String(parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
                        }
                        break;
                    case "RLC": RLC(instruction); break;
                    case "RRC": RRC(instruction); break;
                    case "STA": STA(instruction); break;
                    case "STAX": STAX(instruction); break;
                    case "SUB": SUB(instruction); break;
                    case "SUI": SUI(instruction); break;
                    case "XCHG": XCHG(instruction); break;
                    case "XRA": XRA(instruction); break;
                    case "XRI": XRI(instruction); break;
                    case "HLT":
                        console.log("-----HLT-----");
                        return;
                    default:
                        console.log(`The instruction ${instruction} at memory location ${address.toUpperCase()} is not provided by the developer.`);
                }
                if (opcode !== "CALL" && opcode !== "CC" && opcode !== "CNC" && opcode !== "CP" && opcode !== "CM" && opcode !== "CPE" && opcode !== "CPO" && opcode !== "CZ" && opcode !== "CNZ" && opcode !== "JMP" && opcode !== "JC" && opcode !== "JNC" && opcode !== "JZ" && opcode !== "JNZ" && opcode !== "RET" && opcode !== "RC" && opcode !== "RNC" && opcode !== "RP" && opcode !== "RM" && opcode !== "RPE" && opcode !== "RPO" && opcode !== "RZ" && opcode !== "RNZ") {
                    address = ((parseInt(address, 16) + 1).toString(16)).toUpperCase().padStart(4, '0');
                }
                if (opcode === "HLT") {
                    break;
                }
            }
        }
    })
    console.log("Executed Successfully...")
    reset.addEventListener('click', resetExecute = () => {
        execute.removeEventListener('click', executeProgram)
        reset.removeEventListener('click', resetExecute)
        flag = [0, 0, 0, 0, 0, 0, 0, 0];
        string = ''
        address = '0000'
        mode = 0
        reg_active_status = 'inactive'
        initial_mode = true
        textLCD.value = '.  '
    })
}

function memory_address_M(mode) {
    if (mode === 0) {
        console.log("Storing the value to Memory address...");
        reg_value[6] = reg_value[6].toString().padStart(2, '0').toUpperCase();
        reg_value[7] = reg_value[7].toString().padStart(2, '0').toUpperCase();
        let M_address = reg_value[6] + reg_value[7];
        memory_location_value[parseInt(M_address, 16)] = reg_value[8];
        console.log(`[H] = ${reg_value[6]}, [L] = ${reg_value[7]}`);
        console.log(`[M] = [${M_address}] = ${reg_value[8]}`);
    } else if (mode === 1) {
        console.log("Retrieving the value from Memory address...");
        reg_value[6] = reg_value[6].toString().padStart(2, '0').toUpperCase();
        reg_value[7] = reg_value[7].toString().padStart(2, '0').toUpperCase();
        let M_address = reg_value[6] + reg_value[7];
        reg_value[8] = memory_location_value[parseInt(M_address, 16)];
        console.log(`[M] = [${M_address}] = ${reg_value[8]}`);
        console.log(`[H] = ${reg_value[6]}, [L] = ${reg_value[7]}`);
    }
}

function registers() {
    reg_active_status = 'active'
    let regArray = ["A", "FL", "B", "C", "D", "E", "H", "L"]
    let flag_bin = reg_value[1].join('');
    let flag_hex = parseInt(flag_bin, 2).toString(16).toUpperCase().padStart(2, '0');
    console.log(`A = ${reg_value[0].toString(16).toUpperCase().padStart(2, '0')}  Flag = ${flag_hex} = ${flag_bin}`);
    console.log(`B = ${reg_value[2].toString(16).toUpperCase().padStart(2, '0')}     C = ${reg_value[3].toString(16).toUpperCase().padStart(2, '0')}`);
    console.log(`D = ${reg_value[4].toString(16).toUpperCase().padStart(2, '0')}     E = ${reg_value[5].toString(16).toUpperCase().padStart(2, '0')}`);
    console.log(`H = ${reg_value[6].toString(16).toUpperCase().padStart(2, '0')}     L = ${reg_value[7].toString(16).toUpperCase().padStart(2, '0')}`);
    regButtons.forEach(reg => {
        reg.addEventListener('click', regFunc = () => {
            if (reg_active_status === 'active') {
                console.log(reg.innerHTML.split("<br>")[0])
                let regString = reg.innerHTML.split("<br>")[0]
                let regValue = regString.split(" ")[1]
                let i = regArray.indexOf(regValue)
                if (i !== -1) {
                    console.log(i)
                    textLCD.value = `${regArray[i]}.${reg_value[i].toString(16).toUpperCase().padStart(2, '0')}`
                } else {
                    console.log(i)
                    textLCD.value = `.  `
                }
            }
        })
    })
    reset.addEventListener('click', escapeRegisters = () => {
        reg.addEventListener('click', regFunc)
        reset.removeEventListener('click', escapeRegisters)
        if (initial_mode === false) {
            textLCD.value = '.  '
            initial_mode = true
            mode = 0
            reg_active_status = 'inactive'
        }
    })
}
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

hexButtons.forEach(hex => {
    hex.addEventListener('click', hexFunc = () => {
        if (mode === 0 && initial_mode === false && reg_active_status !== 'active') {
            if (address.length > 3) {
                address = address.slice(1)
                address += hex.innerHTML.slice(0, 1)
                textLCD.value = `${address}.  `
            }
            else if (hex.id !== 'NEXT') {
                address += hex.innerHTML.slice(0, 1)
                textLCD.value = `${address}.  `
            }
        } else if (mode === 1 && initial_mode === false && reg_active_status !== 'active') {
            if (string.length > 1) {
                string = string.slice(1)
                string += hex.innerHTML.slice(0, 1)
                address_value = string
                textLCD.value = `${address_1}.${address_value}`
            } else if (hex.id !== 'NEXT') {
                string += hex.innerHTML.slice(0, 1)
                address_value = string
                textLCD.value = `${address_1}.${address_value}`
            }
        }
    })
})

spclButtons.forEach(spclbtn => {
    spclbtn.addEventListener('click', spclFunc = () => {
        if (spclbtn.innerHTML.split("<br>")[1] === 'SUB' && initial_mode === true) {
            initial_mode = false
            textLCD.value = `${address}.  `
            memory_8085()
        } else if (spclbtn.innerHTML.split("<br>")[1] === 'GO' && initial_mode === true) {
            initial_mode = false
            textLCD.value = `${address}.  `
            execute_8085()
        } else if (spclbtn.innerHTML.split("<br>")[1] === 'REG' && initial_mode === true) {
            initial_mode = false
            textLCD.value = `.  `
            registers()
        }
    })
})
