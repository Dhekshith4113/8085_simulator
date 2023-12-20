let textLCD = document.getElementById('lcd')
let details = document.getElementById('details')

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
let initial_enter = false
let mode = 0
let ret_address
let one_byte, mnemonic
let two_byte
let three_byte

textLCD.value = '.  '

let A, flag, B, C, D, E, H, L, M;
let reg_list, reg_value;
let memory_location_value, stack_pointer;

A = parseInt(0).toString(16).slice(2).padStart(2, '0');
flag = [0, 0, 0, 0, 0, 0, 0, 0];
B = parseInt(0).toString(16).slice(2).padStart(2, '0');
C = parseInt(0).toString(16).slice(2).padStart(2, '0');
D = parseInt(0).toString(16).slice(2).padStart(2, '0');
E = parseInt(0).toString(16).slice(2).padStart(2, '0');
H = parseInt(0).toString(16).slice(2).padStart(2, '0');
L = parseInt(0).toString(16).slice(2).padStart(2, '0');
M = parseInt(0).toString(16).slice(2).padStart(2, '0');
reg_list = ["A", "flag", "B", "C", "D", "E", "H", "L", "M"];
reg_value = [A, flag, B, C, D, E, H, L, M];

address = "8000";
stack_pointer = "00FF";
single_step_active = "inactive";

memory_location_value = [];
let n = 0;
for (let i = 0; i < 65536; i++) {
    n = parseInt(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
    memory_location_value.push(n);
}
console.log(memory_location_value)

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

function ADD(mnemonic) {
    console.log("-----ADD-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    reg_1 = reg_list.indexOf(reg_1);
    if (reg_1 === 'M') {
        memory_address_M(1);
    }
    reg_value[0] = (parseInt(reg_value[0], 16) + parseInt(reg_value[reg_1], 16)).toString(16).padStart(2, '0').toUpperCase();
    if (parseInt(reg_value[0], 16) > 255) {
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
        flag[7] = 1;
    }
    console.log(`[A] = ${reg_value[0]}`);
    check_accumulator();
}

function ADI(mnemonic) {
    console.log("-----ADI-----");
    mnemonic = mnemonic.split(" ");
    let immediate_value = mnemonic[1];
    if (immediate_value.length === 2 && /^[0-9A-Fa-f]{2}$/.test(immediate_value)) {
        // ChatGPT included the && /^[0-9A-Fa-f]{2}$/.test(immediate_value) in the JavaScript code to validate 
        // whether the immediate_value extracted from the mnemonic is a valid two-digit hexadecimal value.
        reg_value[0] = (parseInt(reg_value[0], 16) + parseInt(immediate_value, 16)).toString(16).padStart(2, '0').toUpperCase();
        if (parseInt(reg_value[0], 16) > 255) {
            reg_value[0] = (parseInt(reg_value[0], 16) - parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
            flag[7] = 1;
        }
    }
    console.log(`[A] = ${reg_value[0]}`);
    check_accumulator();
}

function ADC(mnemonic) {
    console.log("-----ADC-----");
    let regList = ['B', 'C', 'D', 'E', 'H', 'L', 'M', 'A'];
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    reg_1 = regList.indexOf(reg_1);
    if (reg_1 === 6) {
        memory_address_M(1);
    }
    reg_value[0] = (parseInt(reg_value[0], 16) + parseInt(reg_value[reg_1], 16) + flag[7]).toString(16).padStart(2, '0').toUpperCase();
    if (parseInt(reg_value[0], 16) > 255) {
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
        flag[7] = 1;
    }
    console.log(`[A] = ${reg_value[0]}`);
    check_accumulator();
}

function ACI(mnemonic) {
    console.log("-----ACI-----");
    mnemonic = mnemonic.split(" ");
    let immediate_value = mnemonic[1];
    reg_value[0] = (parseInt(reg_value[0], 16) + parseInt(immediate_value, 16) + flag[7]).toString(16).padStart(2, '0').toUpperCase();
    if (parseInt(reg_value[0], 16) > 255) {
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
        flag[7] = 1;
    }
    console.log(`[A] = ${reg_value[0]}`);
    check_accumulator();
}

function ANA(mnemonic) {
    console.log("-----ANA-----");
    mnemonic = mnemonic.split(" ");
    let reg_1 = mnemonic[1];
    reg_1 = reg_list.indexOf(reg_1);
    if (reg_1 === "M") {
        memory_address_M(1);
    }
    reg_value[0] = (parseInt(reg_value[0], 16) & parseInt(reg_value[reg_1], 16)).toString(16).padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
    check_accumulator();
}

function ANI(mnemonic) {
    console.log("-----ANI-----");
    mnemonic = mnemonic.split(" ");
    let immediate_value = mnemonic[1];
    reg_value[0] = (parseInt(reg_value[0], 16) & parseInt(immediate_value, 16)).toString(16).padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
    check_accumulator();
}

function CALL(mnemonic) {
    console.log("-----CALL-----");
    let mnemonicArr = mnemonic.split(' ');
    let call_address = mnemonicArr[1];
    ret_address = (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    let [higher_byte, lower_byte] = splitAddress(ret_address);
    memory_location_value[parseInt(stack_pointer, 16)] = higher_byte;
    stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
    memory_location_value[parseInt(stack_pointer, 16)] = lower_byte;
    stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
    console.log(`Going to ${call_address}...`);
    console.log(`Stack Pointer = ${stack_pointer}`);
    return call_address;
}

function CC(mnemonic) {
    if (flag[7] === 1) {
        let call_address = mnemonic.split(' ')[1];
        ret_address = (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let [higher_byte, lower_byte] = splitAddress(ret_address);
        memoryLocationValue[parseInt(stack_pointer, 16)] = higher_byte;
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        memoryLocationValue[parseInt(stack_pointer, 16)] = lower_byte;
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        console.log(`Going to ${call_address}...`);
        console.log(`Stack Pointer = ${stack_pointer}`);
        return call_address;
    } else {
        return (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    }
}

function CNC(mnemonic) {
    if (flag[7] === 0) {
        let call_address = mnemonic.split(' ')[1];
        ret_address = (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let [higher_byte, lower_byte] = splitAddress(ret_address);
        memoryLocationValue[parseInt(stack_pointer, 16)] = higher_byte;
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        memoryLocationValue[parseInt(stack_pointer, 16)] = lower_byte;
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        console.log(`Going to ${call_address}...`);
        console.log(`Stack Pointer = ${stack_pointer}`);
        return call_address;
    } else {
        return (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    }
}

function CP(mnemonic) {
    console.log("-----CP-----");
    if (flag[0] === 0) {
        let call_address = mnemonic.split(' ')[1];
        ret_address = (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let [higher_byte, lower_byte] = splitAddress(ret_address);
        memory_location_value[parseInt(stack_pointer, 16)] = higher_byte;
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        memory_location_value[parseInt(stack_pointer, 16)] = lower_byte;
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        console.log(`Going to ${call_address}...`);
        console.log(`Stack Pointer = ${stack_pointer}`);
        return call_address;
    } else {
        return (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    }
}

function CM(mnemonic) {
    console.log("-----CM-----");
    if (flag[0] === 1) {
        let call_address = mnemonic.split(' ')[1];
        ret_address = (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let [higher_byte, lower_byte] = splitAddress(ret_address);
        memory_location_value[parseInt(stack_pointer, 16)] = higher_byte;
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        memory_location_value[parseInt(stack_pointer, 16)] = lower_byte;
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        console.log(`Going to ${call_address}...`);
        console.log(`Stack Pointer = ${stack_pointer}`);
        return call_address;
    } else {
        return (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    }
}

function CPE(mnemonic) {
    console.log("-----CPE-----");
    if (flag[5] === 1) {
        let call_address = mnemonic.split(' ')[1];
        ret_address = (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let [higher_byte, lower_byte] = split_address(ret_address);
        memory_location_value[parseInt(stack_pointer, 16)] = higher_byte;
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        memory_location_value[parseInt(stack_pointer, 16)] = lower_byte;
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        console.log(`Going to ${call_address}...`);
        console.log(`Stack Pointer = ${stack_pointer}`);
        return call_address;
    } else {
        return (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    }
}

function CPO(mnemonic) {
    console.log("-----CPO-----");
    if (flag[5] === 0) {
        let call_address = mnemonic.split(' ')[1];
        ret_address = (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let [higher_byte, lower_byte] = split_address(ret_address);
        memory_location_value[parseInt(stack_pointer, 16)] = higher_byte;
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        memory_location_value[parseInt(stack_pointer, 16)] = lower_byte;
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        console.log(`Going to ${call_address}...`);
        console.log(`Stack Pointer = ${stack_pointer}`);
        return call_address;
    } else {
        return (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    }
}

function CMA() {
    console.log("-----CMA-----");
    reg_value[0] = (0 - parseInt(reg_value[0], 16) + parseInt("FF", 16)).toString(16).toUpperCase().padStart(2, '0');
    flag[0] = 1;
    console.log("[A] = " + reg_value[0]);
    check_accumulator();
}

function CMC() {
    console.log("-----CMC-----");
    if (flag[7] === 1) {
        flag[7] = 0;
    } else {
        flag[7] = 1;
    }
    console.log("Flag = " + flag);
}

function CMP(mnemonic) {
    console.log("-----CMP-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    reg_1 = reg_list.indexOf(reg_1);
    if (reg_1 === "M") {
        memory_address_M(1);
    }
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
}

function CPI(mnemonic) {
    console.log("-----CPI-----");
    mnemonic = mnemonic.split(' ');
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
}

function DAA(mnemonic) {
    console.log("-----DAA-----");
    let reg_A_hex = reg_value[0];
    let most_significant_bit = (parseInt(reg_value[0], 16) & 240) >> 4;
    let least_significant_bit = parseInt(reg_value[0], 16) & 15;
    if (least_significant_bit > 9 && most_significant_bit <= 9) {
        reg_value[0] = (parseInt(reg_value[0], 16) + parseInt("06", 16)).toString(16).padStart(2, '0').toUpperCase();
        flag[0] = 1;
        flag[3] = 1;
    } else if (least_significant_bit <= 9 && most_significant_bit > 9) {
        reg_value[0] = (parseInt(reg_value[0], 16) + parseInt("60", 16) - parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
        flag[7] = 1;
    } else if (least_significant_bit > 9 && most_significant_bit > 9) {
        reg_value[0] = (parseInt(reg_value[0], 16) + parseInt("66", 16) - parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
        flag[7] = 1;
    }
    console.log(`BCD equivalent of ${reg_A_hex} is ${flag[7]}${reg_value[0]}.`);
    console.log(`[A] = ${reg_value[0]}`);
    check_accumulator();
}

function DAD(mnemonic) {
    console.log("-----DAD-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    if (reg_1 === "SP") {
        let [higher_byte, lower_byte] = split_address(stack_pointer);
        reg_value[7] = (parseInt(reg_value[7], 16) + parseInt(lower_byte, 16)).toString(16);
        if (parseInt(reg_value[7], 16) > 255) {
            check_flag(reg_value[7]);
            reg_value[7] = (parseInt(reg_value[7], 16) - parseInt("100", 16)).toString(16);
            reg_value[6] = (parseInt(reg_value[6], 16) + parseInt(higher_byte, 16) + 1).toString(16);
            if (parseInt(reg_value[6], 16) > 255) {
                check_flag(reg_value[6]);
                reg_value[6] = (parseInt(reg_value[6], 16) - parseInt("100", 16)).toString(16);
            }
        } else {
            reg_value[6] = (parseInt(reg_value[6], 16) + parseInt(higher_byte, 16)).toString(16);

            if (parseInt(reg_value[6], 16) > 255) {
                check_flag(reg_value[6]);
                reg_value[6] = (parseInt(reg_value[6], 16) - parseInt("100", 16)).toString(16);
            }
        }
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
    reg_value[6] = ('00' + reg_value[6]).slice(-2).toUpperCase();
    reg_value[7] = ('00' + reg_value[7]).slice(-2).toUpperCase();
    console.log(`[H] = ${reg_value[6]} [L] = ${reg_value[7]}`);
}

function DCR(mnemonic) {
    console.log("-----DCR-----");
    mnemonic = mnemonic.split(" ");
    let reg_1 = mnemonic[1];
    let reg_index = reg_list.indexOf(reg_1);
    if (reg_1 === "M") {
        memory_address_M(1);
    }
    if (parseInt(reg_value[reg_index], 16) > 1) {
        reg_value[reg_index] = (parseInt(reg_value[reg_index], 16) - 1).toString(16).padStart(2, '0').toUpperCase();
    } else if (parseInt(reg_value[reg_index], 16) === 1) {
        reg_value[reg_index] = "00";
    } else if (parseInt(reg_value[reg_index], 16) < 1) {
        reg_value[reg_index] = (parseInt(reg_value[reg_index], 16) - 1 + parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
        flag[0] = 1;
    }
    if (reg_1 === "M") {
        memory_address_M(0);
    }
    console.log(`[${reg_list[reg_index]}] = ${reg_value[reg_index]}`);
    check_flag(reg_value[reg_index]);
}

function DCX(mnemonic) {
    console.log("-----DCX-----");
    mnemonic = mnemonic.split(" ");
    if (mnemonic[1] === "SP") {
        let [higher_byte, lower_byte] = split_address(stack_pointer);
        if (parseInt(lower_byte, 16) === 0) {
            higher_byte = (parseInt(higher_byte, 16) - 1).toString(16).padStart(2, '0').toUpperCase();
            lower_byte = "FF";
        } else {
            lower_byte = (parseInt(lower_byte, 16) - 1).toString(16).padStart(2, '0').toUpperCase();
        }
        stack_pointer = higher_byte + lower_byte;
        console.log(`Stack Pointer= ${stack_pointer}`);
    } else {
        let reg_1 = mnemonic[1];
        let reg_1_index = reg_list.indexOf(reg_1);
        let reg_2_index = reg_1_index + 1;
        if (parseInt(reg_value[reg_2_index], 16) === 0) {
            reg_value[reg_1_index] = (parseInt(reg_value[reg_1_index], 16) - 1).toString(16).padStart(2, '0').toUpperCase();
            reg_value[reg_2_index] = "FF";
        } else {
            reg_value[reg_2_index] = (parseInt(reg_value[reg_2_index], 16) - 1).toString(16).padStart(2, '0').toUpperCase();
        }
        console.log(`[${reg_list[reg_1_index]}] = ${reg_value[reg_1_index]} [${reg_list[reg_2_index]}] = ${reg_value[reg_2_index]}`);
    }
}

function INR(mnemonic) {
    console.log("-----INR-----");
    mnemonic = mnemonic.split(" ");
    let reg_1 = mnemonic[1];
    let reg_index = reg_list.indexOf(reg_1);
    if (reg_1 === "M") {
        memory_address_M(1);
    }
    reg_value[reg_index] = (parseInt(reg_value[reg_index], 16) + 1).toString(16).padStart(2, '0').toUpperCase();
    if (reg_1 === "M") {
        memory_address_M(0);
    }
    if (parseInt(reg_value[reg_index], 16) > 255) {
        reg_value[0] = (parseInt(reg_value[reg_index], 16) - parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
        flag[7] = 1;
    }
    console.log(`[${reg_list[reg_index]}] = ${reg_value[reg_index]}`);
    check_flag(reg_value[reg_index]);
}

function INX(mnemonic) {
    console.log("-----INX-----");
    mnemonic = mnemonic.split(" ");
    if (mnemonic[1] === "SP") {
        let [higher_byte, lower_byte] = split_address(stack_pointer);
        if (parseInt(lower_byte, 16) === 255) {
            higher_byte = (parseInt(higher_byte, 16) + 1).toString(16).padStart(2, '0').toUpperCase();
            if (parseInt(higher_byte, 16) > 255) {
                higher_byte = (parseInt(higher_byte, 16) - parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
            }
            lower_byte = "00";
        } else {
            lower_byte = (parseInt(lower_byte, 16) + 1).toString(16).padStart(2, '0').toUpperCase();

            if (parseInt(lower_byte, 16) > 255) {
                lower_byte = (parseInt(lower_byte, 16) - parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
            }
        }
        stack_pointer = higher_byte + lower_byte;
        console.log(`Stack Pointer = ${stack_pointer}`);
    } else {
        let reg_1 = mnemonic[1];
        let reg_1_index = reg_list.indexOf(reg_1);
        let reg_2_index = reg_1_index + 1;
        if (parseInt(reg_value[reg_2_index], 16) === 255) {
            reg_value[reg_1_index] = (parseInt(reg_value[reg_1_index], 16) + 1).toString(16).padStart(2, '0').toUpperCase();
            if (parseInt(reg_value[reg_1_index], 16) > 255) {
                reg_value[reg_1_index] = (parseInt(reg_value[reg_1_index], 16) - parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
            }
            reg_value[reg_2_index] = "00";
        } else {
            reg_value[reg_2_index] = (parseInt(reg_value[reg_2_index], 16) + 1).toString(16).padStart(2, '0').toUpperCase();
            if (parseInt(reg_value[reg_2_index], 16) > 255) {
                reg_value[reg_2_index] = (parseInt(reg_value[reg_2_index], 16) - parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
            }
        }
        if (reg_1 === "H") {
            let M = reg_value[6] + reg_value[7];
            reg_value[8] = memory_location_value[parseInt(M, 16)].toString(16).padStart(2, '0').toUpperCase();
        }
        console.log(`[${reg_list[reg_1_index]}] = ${reg_value[reg_1_index]} [${reg_list[reg_2_index]}] = ${reg_value[reg_2_index]}`);
    }
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
    mnemonic = mnemonic.split(" ");
    let operand = mnemonic[1].split(",");
    let [higher_byte, lower_byte] = split_address(operand[1]);
    if (operand[0] === "B" || operand[0] === "D" || operand[0] === "H") {
        let reg_1 = reg_list.indexOf(operand[0]);
        reg_value[reg_1] = (parseInt(higher_byte, 16)).toString(16).padStart(2, '0').toUpperCase();
        let reg_2 = reg_1 + 1;
        reg_value[reg_2] = (parseInt(lower_byte, 16)).toString(16).padStart(2, '0').toUpperCase();
        console.log(`Address = ${operand[1]}`);
        console.log(`[${reg_list[reg_1]}] = ${reg_value[reg_1]} [${reg_list[reg_2]}] = ${reg_value[reg_2]}`);
    } else if (operand[0] === "SP") {
        stack_pointer = String(operand[1]).padStart(4, '0').toUpperCase();
        console.log(`Stack Pointer = ${stack_pointer}`);
    }
    if (operand[0] === "H") {
        reg_value[8] = (memory_location_value[parseInt(operand[1], 16)]).toString(16).padStart(2, '0').toUpperCase();
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
    mnemonic = mnemonic.split(" ");
    let reg_1 = mnemonic[1];
    reg_1 = reg_list.indexOf(reg_1);
    if (reg_1 === "M") {
        memory_address_M(1);
    }
    reg_value[0] = (parseInt(reg_value[0], 16) | parseInt(reg_value[reg_1], 16)).toString(16).padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
    check_accumulator();
}

function ORI(mnemonic) {
    console.log("-----ORI-----");
    mnemonic = mnemonic.split(" ");
    let immediate_value = mnemonic[1];
    reg_value[0] = (parseInt(reg_value[0], 16) | parseInt(immediate_value, 16)).toString(16).padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
    check_accumulator();
}

function PCHL(mnemonic) {
    console.log("-----PCHL-----");
    let address = (parseInt(reg_value[6] + reg_value[7], 16)).toString(16).padStart(4, '0').toUpperCase();
    console.log(`[HL] = ${address}`);
    console.log(`Program Counter changed to ${address}...`);
    return address;
}

function PUSH(mnemonic) {
    console.log("-----PUSH-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
    if (reg_1 === "PSW") {
        let higher_byte = reg_value[0].toString().padStart(2, '0').toUpperCase();
        memory_location_value[parseInt(stack_pointer, 16)] = higher_byte;
        let lower_byte = reg_value[1].join('');
        lower_byte = parseInt(lower_byte, 2).toString(16).padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        memory_location_value[parseInt(stack_pointer, 16)] = lower_byte;
        console.log(`[A] = ${higher_byte} flag = ${lower_byte}`);
        console.log(`[${(parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase()}] = ${memory_location_value[parseInt(stack_pointer, 16) + 1].toString().padStart(2, '0').toUpperCase()} [${(parseInt(stack_pointer, 16)).toString(16).padStart(4, '0').toUpperCase()}] = ${memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase()}`);
    } else {
        reg_1 = reg_list.indexOf(reg_1);
        let higher_byte = reg_value[reg_1].toString().padStart(2, '0').toUpperCase();
        let reg_2 = reg_1 + 1;
        let lower_byte = reg_value[reg_2].toString().padStart(2, '0').toUpperCase();
        memory_location_value[parseInt(stack_pointer, 16)] = higher_byte;
        stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
        memory_location_value[parseInt(stack_pointer, 16)] = lower_byte;
        console.log(`[${reg_list[reg_1]}] = ${higher_byte} [${reg_list[reg_2]}] = ${lower_byte}`);
        console.log(`[${(parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase()}] = ${memory_location_value[parseInt(stack_pointer, 16) + 1].toString().padStart(2, '0').toUpperCase()} [${(parseInt(stack_pointer, 16)).toString(16).padStart(4, '0').toUpperCase()}] = ${memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase()}`);
    }
    console.log(`Stack Pointer = ${stack_pointer}`);
}

function POP(mnemonic) {
    console.log("-----POP-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    if (reg_1 === "PSW") {
        let flag = parseInt(memory_location_value[parseInt(stack_pointer, 16)], 16).toString(2).padStart(8, '0'); // lower_byte
        console.log(`Flag_binary = ${flag}`);
        reg_value[1] = flag.split('');
        console.log(`Flag = ${reg_value[1]}`);
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        reg_value[0] = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase(); // higher_byte
        console.log(`[${(parseInt(stack_pointer, 16)).toString(16).padStart(4, '0').toUpperCase()}] = ${memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase()} [${(parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase()}] = ${memory_location_value[parseInt(stack_pointer, 16) - 1].toString().padStart(2, '0').toUpperCase()}`);
        console.log(`[A] = ${reg_value[0]} flag = ${flag}`);
    } else {
        reg_1 = reg_list.indexOf(reg_1);
        let reg_2 = reg_1 + 1;
        reg_value[reg_2] = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase(); // lower_byte
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        reg_value[reg_1] = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase(); // higher_byte
        console.log(`[${(parseInt(stack_pointer, 16)).toString(16).padStart(4, '0').toUpperCase()}] = ${memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase()} [${(parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase()}] = ${memory_location_value[parseInt(stack_pointer, 16) - 1].toString().padStart(2, '0').toUpperCase()}`);
        console.log(`[${reg_list[reg_1]}] = ${reg_value[reg_1]} [${reg_list[reg_2]}] = ${reg_value[reg_2]}`); // higher_byte lower_byte
    }
    stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    console.log(`Stack Pointer = ${stack_pointer}`);
}

function RET(mnemonic) {
    console.log("-----RET-----");
    stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    let lower_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
    stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    let higher_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
    ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
    console.log(`Returning to ${ret_address}...`);
}

function RC(mnemonic) {
    console.log("-----RC-----");
    if (flag[7] === 1) {
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let lower_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let higher_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
        ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
        console.log(`Returning to ${ret_address}...`);
        return true;
    } else {
        console.log("No Returning!");
        return false;
    }
}

function RNC(mnemonic) {
    console.log("-----RNC-----");
    if (flag[7] === 0) {
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let lower_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let higher_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
        ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
        console.log(`Returning to ${ret_address}...`);
        return true;
    } else {
        console.log("No Returning!");
        return false;
    }
}

function RP(mnemonic) {
    console.log("-----RP-----");
    if (flag[0] === 0) {
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let lower_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let higher_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
        ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
        console.log(`Returning to ${ret_address}...`);
        return true;
    } else {
        console.log("No Returning!");
        return false;
    }
}

function RM(mnemonic) {
    console.log("-----RM-----");
    if (flag[0] === 1) {
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let lower_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let higher_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
        ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
        console.log(`Returning to ${ret_address}...`);
        return true;
    } else {
        console.log("No Returning!");
        return false;
    }
}

function RPE(mnemonic) {
    console.log("-----RPE-----");
    if (flag[5] === 1) {
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let lower_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let higher_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
        ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
        console.log(`Returning to ${ret_address}...`);
        return true;
    } else {
        console.log("No Returning!");
        return false;
    }
}

function RPO(mnemonic) {
    console.log("-----RPO-----");
    if (flag[5] === 0) {
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let lower_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let higher_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
        ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
        console.log(`Returning to ${ret_address}...`);
        return true;
    } else {
        console.log("No Returning!");
        return false;
    }
}

function RZ(mnemonic) {
    console.log("-----RZ-----");
    if (flag[1] === 1) {
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let lower_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let higher_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
        ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
        console.log(`Returning to ${ret_address}...`);
        return true;
    } else {
        console.log("No Returning!");
        return false;
    }
}

function RNZ(mnemonic) {
    console.log("-----RNZ-----");
    if (flag[1] === 0) {
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let lower_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
        stack_pointer = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        let higher_byte = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
        ret_address = (higher_byte + lower_byte).padStart(4, '0').toUpperCase();
        console.log(`Returning to ${ret_address}...`);
        return true;
    } else {
        console.log("No Returning!");
        return false;
    }
}

function RAL() {
    console.log("-----RAL-----");
    let most_significant_bit = parseInt(reg_value[0], 16) & parseInt("80", 16);
    if (most_significant_bit === parseInt("80", 16)) {
        reg_value[0] = (parseInt(reg_value[0], 16) << 1).toString(16).padStart(2, '0').toUpperCase();
        if (flag[7] === 1) {
            reg_value[0] = (parseInt(reg_value[0], 16) - parseInt("100", 16) + 1).toString(16).padStart(2, '0').toUpperCase();
        } else {
            reg_value[0] = (parseInt(reg_value[0], 16) - parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
        }
        flag[7] = 1;
    } else {
        reg_value[0] = (parseInt(reg_value[0], 16) << 1).toString(16).padStart(2, '0').toUpperCase();
        if (flag[7] === 1) {
            reg_value[0] = (parseInt(reg_value[0], 16) + 1).toString(16).padStart(2, '0').toUpperCase();
        }
        flag[7] = 0;
    }
    console.log(`[A]  = ${reg_value[0]}`);
    check_accumulator();
}

function RAR() {
    console.log("-----RAR-----");
    let least_significant_bit = parseInt(reg_value[0], 16) & 1;
    if (least_significant_bit === 1) {
        reg_value[0] = (parseInt(reg_value[0], 16) >> 1).toString(16).padStart(2, '0').toUpperCase();
        if (flag[7] === 1) {
            reg_value[0] = (parseInt(reg_value[0], 16) + parseInt("80", 16)).toString(16).padStart(2, '0').toUpperCase();
        }
        flag[7] = 1;
    } else {
        reg_value[0] = (parseInt(reg_value[0], 16) >> 1).toString(16).padStart(2, '0').toUpperCase();
        if (flag[7] === 1) {
            reg_value[0] = (parseInt(reg_value[0], 16) + parseInt("80", 16)).toString(16).padStart(2, '0').toUpperCase();
        }
        flag[7] = 0;
    }
    console.log(`[A]  = ${reg_value[0]}`);
    check_accumulator();
}

function RLC() {
    console.log("-----RLC-----");
    let most_significant_bit = parseInt(reg_value[0], 16) & parseInt("80", 16);
    if (most_significant_bit === parseInt("80", 16)) {
        reg_value[0] = (parseInt(reg_value[0], 16) << 1 & parseInt("FF", 16)).toString(16).padStart(2, '0').toUpperCase();
    } else {
        reg_value[0] = (parseInt(reg_value[0], 16) << 1).toString(16).padStart(2, '0').toUpperCase();
    }
    console.log(`[A] = ${reg_value[0]}`);
}

function RRC() {
    console.log("-----RRC-----");
    let least_significant_bit = parseInt(reg_value[0], 16) & 1;
    if (least_significant_bit === 1) {
        reg_value[0] = ((parseInt(reg_value[0], 16) >> 1) + parseInt("80", 16)).toString(16).padStart(2, '0').toUpperCase();
    } else {
        reg_value[0] = (parseInt(reg_value[0], 16) >> 1).toString(16).padStart(2, '0').toUpperCase();
    }
    console.log(`[A] = ${reg_value[0]}`);
}

function SPHL(mnemonic) {
    console.log("-----SPHL-----");
    stack_pointer = reg_value[6] + reg_value[7];
    console.log(`[HL] = ${stack_pointer}`);
    console.log(`Stack Pointer changed to ${stack_pointer}...`);
}

function STA(mnemonic) {
    console.log("-----STA-----");
    mnemonic = mnemonic.split(' ');
    let address = mnemonic[1];
    memory_location_value[parseInt(address, 16)] = reg_value[0].toString().padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
    console.log(`[${address}] = ${memory_location_value[parseInt(address, 16)]}`);
}

function STAX(mnemonic) {
    console.log("-----STAX-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    reg_1 = reg_list.indexOf(reg_1);
    let higher_byte = reg_value[reg_1].toString().padStart(2, '0').toUpperCase();
    let reg_2 = reg_1 + 1;
    let lower_byte = reg_value[reg_2].toString().padStart(2, '0').toUpperCase();
    let address = higher_byte + lower_byte;
    memory_location_value[parseInt(address, 16)] = reg_value[0];
    console.log(`[A] = ${reg_value[0]}`);
    console.log(`[${reg_list[reg_1]}] = ${reg_value[reg_1]} [${reg_list[reg_2]}] = ${reg_value[reg_2]}`);
    console.log(`[${address}] = ${memory_location_value[parseInt(address, 16)]}`);
}

function STC() {
    console.log("-----STC-----");
    flag[7] = 1;
    console.log(`Flag = ${flag}`);
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
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt(reg_value[reg_1_index], 16)).toString(16).padStart(2, '0').toUpperCase();
    } else if (parseInt(reg_value[0], 16) === parseInt(reg_value[reg_1_index], 16)) {
        reg_value[0] = '00';
        flag[1] = 1;
    } else if (parseInt(reg_value[0], 16) < parseInt(reg_value[reg_1_index], 16)) {
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt(reg_value[reg_1_index], 16) + parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
        flag[0] = 1;
    }
    console.log(`[A] = ${reg_value[0]}`);
    check_accumulator();
}

function SUI(mnemonic) {
    console.log("-----SUI-----");
    mnemonic = mnemonic.split(' ');
    let immediate_value = mnemonic[1];
    if (parseInt(reg_value[0], 16) > parseInt(immediate_value, 16)) {
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt(immediate_value, 16)).toString(16).padStart(2, '0').toUpperCase();
    } else if (parseInt(reg_value[0], 16) === parseInt(immediate_value, 16)) {
        reg_value[0] = '00';
        flag[1] = 1;
    } else if (parseInt(reg_value[0], 16) < parseInt(immediate_value, 16)) {
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt(immediate_value, 16) + parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
        flag[0] = 1;
    }
    console.log(`[A] = ${reg_value[0]}`);
    check_accumulator();
}

function SBB(mnemonic) {
    console.log("-----SBB-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    let reg_1_index = reg_list.indexOf(reg_1);
    if (reg_1 === "M") {
        memory_address_M(1);
    }
    if (parseInt(reg_value[0], 16) > parseInt(reg_value[reg_1_index], 16)) {
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt(reg_value[reg_1_index], 16) - flag[7]).toString(16).padStart(2, '0').toUpperCase();
    } else if (parseInt(reg_value[0], 16) === parseInt(reg_value[reg_1_index], 16)) {
        if (flag[7] === 1) {
            reg_value[0] = "FF";
        } else {
            reg_value[0] = "00";
            flag[1] = 1;
        }
    } else if (parseInt(reg_value[0], 16) < parseInt(reg_value[reg_1_index], 16)) {
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt(reg_value[reg_1_index], 16) + parseInt("100", 16) - flag[7]).toString(16).padStart(2, '0').toUpperCase();
        flag[0] = 1;
    }
    console.log(`[A] = ${reg_value[0]}`);
    check_accumulator();
}

function SBI(mnemonic) {
    console.log("-----SBI-----");
    mnemonic = mnemonic.split(' ');
    let immediate_value = parseInt(mnemonic[1], 16);
    if (parseInt(reg_value[0], 16) > immediate_value) {
        reg_value[0] = (parseInt(reg_value[0], 16) - immediate_value - flag[7]).toString(16).padStart(2, '0').toUpperCase();
    } else if (parseInt(reg_value[0], 16) === immediate_value) {
        if (flag[7] === 1) {
            reg_value[0] = "FF";
            flag[0] = 1;
        } else {
            reg_value[0] = "00";
            flag[1] = 1;
        }
    } else if (parseInt(reg_value[0], 16) < immediate_value) {
        reg_value[0] = (parseInt(reg_value[0], 16) - immediate_value + parseInt("100", 16) - flag[7]).toString(16).padStart(2, '0').toUpperCase();
        flag[0] = 1;
    }
    console.log(`[A] = ${reg_value[0]}`);
    check_accumulator();
}

function XCHG(mnemonic) {
    console.log("-----XCHG-----");
    console.log("Before: ");
    console.log(`[H] = ${reg_value[6]} [L] = ${reg_value[7]}`);
    console.log(`[D] = ${reg_value[4]} [E] = ${reg_value[5]}`);
    let reg_H = reg_value[6];
    let reg_L = reg_value[7];
    let reg_D = reg_value[4];
    let reg_E = reg_value[5];
    reg_value[6] = reg_D;
    reg_value[7] = reg_E;
    reg_value[4] = reg_H;
    reg_value[5] = reg_L;
    console.log("After: ");
    console.log(`[H] = ${reg_value[6]} [L] = ${reg_value[7]}`);
    console.log(`[D] = ${reg_value[4]} [E] = ${reg_value[5]}`);
}

function XRA(mnemonic) {
    console.log("-----XRA-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    reg_1 = reg_list.indexOf(reg_1);
    if (reg_1 === "M") {
        memory_address_M(1);
    }
    reg_value[0] = (parseInt(reg_value[0], 16) ^ parseInt(reg_value[reg_1], 16)).toString(16).padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
    check_accumulator();
}

function XRI(mnemonic) {
    console.log("-----XRI-----");
    mnemonic = mnemonic.split(' ');
    let immediate_value = mnemonic[1];
    reg_value[0] = (parseInt(reg_value[0], 16) ^ parseInt(immediate_value, 16)).toString(16).padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
    checkAccumulator();
}

function XTHL(mnemonic) {
    console.log("-----XTHL-----");
    let initial_value = stack_pointer;
    let stack_pointer_1 = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    console.log("Before: ");
    console.log(`[HL] = ${reg_value[6]}${reg_value[7]}`);
    console.log(`[${stack_pointer_1}] = ${memory_location_value[parseInt(stack_pointer_1, 16)].toString().padStart(2, '0').toUpperCase()} [${stack_pointer}] = ${memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase()}`);
    let reg_H = reg_value[6];
    let reg_L = reg_value[7];
    reg_value[7] = memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase();
    reg_value[6] = memory_location_value[parseInt(stack_pointer_1, 16)].toString().padStart(2, '0').toUpperCase();
    stack_pointer_1 = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    memory_location_value[parseInt(stack_pointer, 16)] = reg_L;
    memory_location_value[parseInt(stack_pointer_1, 16)] = reg_H;
    stack_pointer_1 = (parseInt(stack_pointer, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    console.log("After: ");
    console.log(`[HL] = ${reg_value[6]}${reg_value[7]}`);
    console.log(`[${stack_pointer_1}] = ${memory_location_value[parseInt(stack_pointer_1, 16)].toString().padStart(2, '0').toUpperCase()} [${stack_pointer}] = ${memory_location_value[parseInt(stack_pointer, 16)].toString().padStart(2, '0').toUpperCase()}`);
    stack_pointer = initial_value;
}

function checkAccumulator() {
    console.log("Checking Accumulator...");
    if (parseInt(reg_value[0], 16) === 0) {
        flag[1] = 1;
    } else if (parseInt(reg_value[0], 16) !== 0) {
        flag[1] = 0;
    }
    if (flag[0] === 1) {
        flag[7] = 1;
    } else if (parseInt(reg_value[0], 16) <= 255) {
        flag[7] = 0;
    }
    let oneCount = (parseInt(reg_value[0], 16).toString(2).match(/1/g) || []).length;
    if (oneCount % 2 === 0) {
        flag[5] = 1; // Even number of ones
    } else {
        flag[5] = 0; // Odd number of ones
    }
    console.log(`Flag = ${flag}`);
}

function checkFlag(regName) {
    console.log("Checking Flag...");
    if (parseInt(regName, 16) === 0) {
        flag[1] = 1;
    } else if (parseInt(regName, 16) !== 0) {
        flag[1] = 0;
    }
    if (flag[0] === 1) {
        flag[7] = 1;
    } else if (parseInt(regName, 16) <= 255) {
        flag[7] = 0;
    }
    let oneCount = (parseInt(reg_value[0], 16).toString(2).match(/1/g) || []).length;
    if (oneCount % 2 === 0) {
        flag[5] = 1; // Even number of ones
    } else {
        flag[5] = 0; // Odd number of ones
    }
    console.log(`Flag = ${flag}`);
}

function splitAddress(address) {
    let mid = Math.floor(address.length / 2);
    let higherByte = (address.substring(0, mid)).padStart(2, '0').toUpperCase();
    let lowerByte = (address.substring(mid % 2 === 0 ? mid : (mid + 1))).padStart(2, '0').toUpperCase();
    return [higherByte, lowerByte];
}

function memory_8085() {
    console.log("-----MEMORY VIEW/EDIT-----");
    console.log("If you want to change the value, type the desired value. Otherwise hit next.");
    mode = 0
    next.addEventListener('click', nextMemory = () => {
        mode = 1
        if (initial_enter === true) {
            address = (parseInt(address, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
            address_value = memory_location_value[parseInt(address, 16)]
            initial_enter = false
        }
        memory_location_value[parseInt(address, 16)] = address_value.toUpperCase();
        address = (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        address_value = memory_location_value[parseInt(address, 16)]
        textLCD.value = `${address}.${address_value}`
        console.log(`Actual value: ${address}:${address_value}`)
        string = memory_location_value[parseInt(address, 16)];
    })
    reset.addEventListener('click', escapeMemory = () => {
        next.removeEventListener('click', nextMemory)
        reset.removeEventListener('click', escapeMemory)
        if (initial_mode === false) {
            textLCD.value = '.  '
            mode = 0
            initial_mode = true
            initial_enter = false
            reg_active_status = 'inactive'
            console.log(memory_location_value)
        }
    })
}

function instruction_encoder(machine_code) {
    let one_byte_list = ["00", "80", "81", "82", "83", "84", "85", "86", "87", "AO", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "2F", "B8", "B9", "BA", "BB", "BC", "BD", "BE", "BF", "09", "19", "29", "39", "05", "0D", "15", "1D", "25", "2D", "35", "3D", "0B", "1B", "2B", "3B", "76", "04", "0C", "14", "1C", "24", "2C", "34", "3C", "03", "13", "23", "33", "0A", "1A", "78", "79", "7A", "7B", "7C", "7D", "7E", "7F", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4A", "4B", "4C", "4D", "4E", "4F", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5A", "5B", "5C", "5D", "5E", "5F", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6A", "6B", "6C", "6D", "6E", "6F", "70", "71", "72", "73", "74", "75", "76", "77", "07", "0F", "B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "02", "12", "90", "91", "92", "93", "94", "95", "96", "97", "EB", "A8", "A9", "AA", "AB", "AC", "AD", "AE", "AF", "C9", "D8", "F8", "C0", "D0", "F0", "E8", "E0", "C8", "C1", "C5", "D1", "D5", "E1", "E5", "F1", "F5", "37", "17", "1F", "20", "30", "3F", "27", "8F", "88", "89", "8A", "8B", "8C", "8D", "8E", "9F", "98", "99", "9A", "9B", "9C", "9D", "9E", "C7", "CF", "D7", "DF", "E7", "EF", "F7", "FF", "D3", "DB", "E3", "E9", "F3", "FB", "F9"]
    let two_byte_list_1 = ["C6", "D6", "E6", "F6", "EE", "FE", "CE", "DE", "DB", "D3"]
    let two_byte_list_2 = ["06", "0E", "16", "1E", "26", "2E", "36", "3E"]
    let three_byte_list_1 = ["22", "2A", "32", "3A", "C2", "C3", "CA", "CD", "DC", "FC", "D4", "C4", "CC", "F4", "EC", "FE", "E4", "D2", "DA", "E2", "EA", "F2", "FA"]
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
            case "8F": opcode = "ADC A"; break;
            case "88": opcode = "ADC B"; break;
            case "89": opcode = "ADC C"; break;
            case "8A": opcode = "ADC D"; break;
            case "8B": opcode = "ADC E"; break;
            case "8C": opcode = "ADC H"; break;
            case "8D": opcode = "ADC L"; break;
            case "8E": opcode = "ADC M"; break;
            case "A7": opcode = "ANA A"; break;
            case "A0": opcode = "ANA B"; break;
            case "A1": opcode = "ANA C"; break;
            case "A2": opcode = "ANA D"; break;
            case "A3": opcode = "ANA E"; break;
            case "A4": opcode = "ANA H"; break;
            case "A5": opcode = "ANA L"; break;
            case "A6": opcode = "ANA M"; break;
            case "2F": opcode = "CMA"; break;
            case "3F": opcode = "CMC"; break;
            case "BF": opcode = "CMP A"; break;
            case "B8": opcode = "CMP B"; break;
            case "B9": opcode = "CMP C"; break;
            case "BA": opcode = "CMP D"; break;
            case "BB": opcode = "CMP E"; break;
            case "BC": opcode = "CMP H"; break;
            case "BD": opcode = "CMP L"; break;
            case "BE": opcode = "CMP M"; break;
            case "27": opcode = "DAA"; break;
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
            case "F3": opcode = "DI"; break;
            case "FB": opcode = "EI"; break;
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
            case "E9": opcode = "PCHL"; break;
            case "F9": opcode = "SPHL"; break;
            case "E3": opcode = "XTHL"; break;
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
            case "17": opcode = "RAL"; break;
            case "1F": opcode = "RAR"; break;
            case "07": opcode = "RLC"; break;
            case "0F": opcode = "RRC"; break;
            case "C7": opcode = "RST 0"; break;
            case "CF": opcode = "RST 1"; break;
            case "D7": opcode = "RST 2"; break;
            case "DF": opcode = "RST 3"; break;
            case "E7": opcode = "RST 4"; break;
            case "EF": opcode = "RST 5"; break;
            case "F7": opcode = "RST 6"; break;
            case "FF": opcode = "RST 7"; break;
            case "20": opcode = "RIM"; break;
            case "30": opcode = "SIM"; break;
            case "02": opcode = "STAX B"; break;
            case "12": opcode = "STAX D"; break;
            case "37": opcode = "STC"; break;
            case "97": opcode = "SUB A"; break;
            case "90": opcode = "SUB B"; break;
            case "91": opcode = "SUB C"; break;
            case "92": opcode = "SUB D"; break;
            case "93": opcode = "SUB E"; break;
            case "94": opcode = "SUB H"; break;
            case "95": opcode = "SUB L"; break;
            case "96": opcode = "SUB M"; break;
            case "9F": opcode = "SBB A"; break;
            case "98": opcode = "SBB B"; break;
            case "99": opcode = "SBB C"; break;
            case "9A": opcode = "SBB D"; break;
            case "9B": opcode = "SBB E"; break;
            case "9C": opcode = "SBB H"; break;
            case "9D": opcode = "SBB L"; break;
            case "9E": opcode = "SBB M"; break;
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
            case "CE": opcode = "ACI"; break;
            case "E6": opcode = "ANI"; break;
            case "FE": opcode = "CPI"; break;
            case "DB": opcode = "IN"; break;
            case "D3": opcode = "OUT"; break;
            case "F6": opcode = "ORI"; break;
            case "D6": opcode = "SUI"; break;
            case "DE": opcode = "SBI"; break;
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
                    case "ADC": ADC(instruction); break;
                    case "ADI": ADI(instruction); break;
                    case "ACI": ACI(instruction); break;
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
                    case "CMC": CMC(instruction); break;
                    case "CMP": CMP(instruction); break;
                    case "CMA": CMA(instruction); break;
                    case "CMP": CMP(instruction); break;
                    case "CPI": CPI(instruction); break;
                    case "DAA": DAA(instruction); break;
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
                    case "PCHL": PCHL(instruction); break;
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
                    case "RAL": RLC(); break;
                    case "RAR": RRC(); break;
                    case "RLC": RLC(); break;
                    case "RRC": RRC(); break;
                    case "SPHL": SPHL(instruction); break;
                    case "RRC": RRC(instruction); break;
                    case "STA": STA(instruction); break;
                    case "STAX": STAX(instruction); break;
                    case "STC": STC(); break;
                    case "SUB": SUB(instruction); break;
                    case "SUI": SUI(instruction); break;
                    case "SBB": SBB(instruction); break;
                    case "SBI": SBI(instruction); break;
                    case "XCHG": XCHG(instruction); break;
                    case "XRA": XRA(instruction); break;
                    case "XRI": XRI(instruction); break;
                    case "XTHL": XTHL(instruction); break;
                    case "HLT":
                        console.log("-----HLT-----\nProgram Terminated...");
                        console.log("Executed Successfully...")
                        let flag_bin = reg_value[1].join('');
                        let flag_hex = parseInt(flag_bin, 2).toString(16).padStart(2, '0').toUpperCase();
                        console.log(`[A]  = ${reg_value[0].toString().padStart(2, '0').toUpperCase()}   Flag  = ${flag_hex} = ${flag_bin}`);
                        console.log(`[B]  = ${reg_value[2].toString().padStart(2, '0').toUpperCase()}    [C]  = ${reg_value[3].toString().padStart(2, '0').toUpperCase()}`);
                        console.log(`[D]  = ${reg_value[4].toString().padStart(2, '0').toUpperCase()}    [E]  = ${reg_value[5].toString().padStart(2, '0').toUpperCase()}`);
                        console.log(`[H]  = ${reg_value[6].toString().padStart(2, '0').toUpperCase()}    [L]  = ${reg_value[7].toString().padStart(2, '0').toUpperCase()}`);
                        console.log(`[PC] = ${address}  [SP] = ${stack_pointer}`);
                        details.innerHTML = `<br/>[A]  = ${reg_value[0].toString().padStart(2, '0').toUpperCase()} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp Flag  = ${flag_hex}<br/>
                                            [B]  = ${reg_value[2].toString().padStart(2, '0').toUpperCase()} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [C]  = ${reg_value[3].toString().padStart(2, '0').toUpperCase()}<br/>
                                            [D]  = ${reg_value[4].toString().padStart(2, '0').toUpperCase()} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [E]  = ${reg_value[5].toString().padStart(2, '0').toUpperCase()}<br/>
                                            [H]  = ${reg_value[6].toString().padStart(2, '0').toUpperCase()} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [L]  = ${reg_value[7].toString().padStart(2, '0').toUpperCase()}<br/>
                                            [PC] = ${address} &nbsp; [SP] = ${stack_pointer}`
                        return;
                    default:
                        console.log(`The instruction "${instruction}" (${memory_location_value[parseInt(address, 16)]}) at memory location "${address.padStart(4, '0').toUpperCase()}" is not provided by the developer...`);
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
    console.log(`\nA = ${reg_value[0].toString(16).toUpperCase().padStart(2, '0')}  Flag = ${flag_hex} = ${flag_bin}`);
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
                textLCD.value = `${address}.${address_value}`
            }
            else if (hex.id !== 'NEXT') {
                string += hex.innerHTML.slice(0, 1)
                address_value = string
                textLCD.value = `${address}.${address_value}`
            }
        }
    })
})

spclButtons.forEach(spclbtn => {
    spclbtn.addEventListener('click', spclFunc = () => {
        if (spclbtn.innerHTML.split("<br>")[1] === 'SUB' && initial_mode === true) {
            initial_mode = false
            initial_enter = true
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
