let textTop = document.getElementById('lcdTop')
let textBottom = document.getElementById('lcdBottom')
let details = document.getElementById('details')

let buttons = document.querySelectorAll('.btn')
let hexButtons = document.querySelectorAll('.hex')
let spclButtons = document.querySelectorAll('.spclbtn')

let reset = document.querySelector('#reset')
let escapeBtn = document.querySelector('#escape')
let backSpace = document.querySelector('#backspace')
let enter = document.querySelector('#enter')
let space = document.querySelector('#space')

let string = ''
let address = '8000'
let byte, machine_code, ivMl, ret_value, nextAddress1, nextAddress2, address_value
let memory_active_status = 'inactive'
let address_active_status = 'inactive'
let execute_active_status = 'inactive'
let single_step_active = 'inactive'
let execute_address = 'inactive'
let initial_mode = true
let initial_enter = false
let mode_memory = 0
let mode_address = 0
let mode_execute = 0
let ret_address
let one_byte, two_byte, three_byte, mnemonic, old_value

setTimeout(() => {
    textTop.innerHTML = "SCIENTIFIC TECH"
    textBottom.value = "8085 TRAINER KIT"
    setTimeout(() => {
        textTop.innerHTML = "MENU:   A,D,M,F, "
        textBottom.value = "C,G,S,R,I,E,P"
    }, 1000)
}, 500)

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

console.log("\nPress any of the given key:\nA - Assemble    G - Go Execute    S - Single Step    M - Memory View/Edit    R - Register View");

function ADD(mnemonic) {
    console.log("-----ADD-----");
    mnemonic = mnemonic.split(' ');
    let reg_1 = mnemonic[1];
    reg_1 = reg_list.indexOf(reg_1);
    if (reg_1 === 'M') {
        memory_address_M(1);
    }
    reg_value[0] = (parseInt(reg_value[0], 16) + parseInt(reg_value[reg_1], 16)).toString(16).padStart(2, '0').toUpperCase();
    check_flag(reg_value[0]);
    if (parseInt(reg_value[0], 16) > 255) {
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
    }
    console.log(`[A] = ${reg_value[0]}`);
}

function ADI(mnemonic) {
    console.log("-----ADI-----");
    mnemonic = mnemonic.split(" ");
    let immediate_value = mnemonic[1];
    if (immediate_value.length === 2 && /^[0-9A-Fa-f]{2}$/.test(immediate_value)) {
        // ChatGPT included the && /^[0-9A-Fa-f]{2}$/.test(immediate_value) in the JavaScript code to validate 
        // whether the immediate_value extracted from the mnemonic is a valid two-digit hexadecimal value.
        reg_value[0] = (parseInt(reg_value[0], 16) + parseInt(immediate_value, 16)).toString(16).padStart(2, '0').toUpperCase();
        check_flag(reg_value[0]);
        if (parseInt(reg_value[0], 16) > 255) {
            reg_value[0] = (parseInt(reg_value[0], 16) - parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
        }
    }
    console.log(`[A] = ${reg_value[0]}`);
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
    check_flag(reg_value[0]);
    if (parseInt(reg_value[0], 16) > 255) {
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
    }
    console.log(`[A] = ${reg_value[0]}`);
}

function ACI(mnemonic) {
    console.log("-----ACI-----");
    mnemonic = mnemonic.split(" ");
    let immediate_value = mnemonic[1];
    reg_value[0] = (parseInt(reg_value[0], 16) + parseInt(immediate_value, 16) + flag[7]).toString(16).padStart(2, '0').toUpperCase();
    check_flag(reg_value[0]);
    if (parseInt(reg_value[0], 16) > 255) {
        reg_value[0] = (parseInt(reg_value[0], 16) - parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
    }
    console.log(`[A] = ${reg_value[0]}`);
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
    check_flag(reg_value[0]);
}

function ANI(mnemonic) {
    console.log("-----ANI-----");
    mnemonic = mnemonic.split(" ");
    let immediate_value = mnemonic[1];
    reg_value[0] = (parseInt(reg_value[0], 16) & parseInt(immediate_value, 16)).toString(16).padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
    check_flag(reg_value[0]);
}

function CALL(mnemonic) {
    console.log("-----CALL-----");
    let mnemonicArr = mnemonic.split(' ');
    let call_address = mnemonicArr[1];
    ret_address = (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
    let [higher_byte, lower_byte] = split_address(ret_address);
    memory_location_value[parseInt(stack_pointer, 16)] = higher_byte;
    stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
    memory_location_value[parseInt(stack_pointer, 16)] = lower_byte;
    stack_pointer = (parseInt(stack_pointer, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
    console.log(`Going to ${call_address}...`);
    console.log(`Stack Pointer = ${stack_pointer}`);
    return call_address;
}

function CC(mnemonic) {
    console.log("-----CC-----");
    if (flag[7] === 1) {
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

function CNC(mnemonic) {
    console.log("-----CNC-----");
    if (flag[7] === 0) {
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

function CZ(mnemonic) {
    console.log("-----CZ-----");
    if (flag[1] === 1) {
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

function CNZ(mnemonic) {
    console.log("-----CNZ-----");
    if (flag[1] === 0) {
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

function CP(mnemonic) {
    console.log("-----CP-----");
    if (flag[0] === 0) {
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

function CM(mnemonic) {
    console.log("-----CM-----");
    if (flag[0] === 1) {
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
    check_flag(reg_value[0]);
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
    check_flag(reg_value[0]);
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
    check_flag(reg_value[reg_index]);
    if (parseInt(reg_value[reg_index], 16) > 255) {
        reg_value[0] = (parseInt(reg_value[reg_index], 16) - parseInt("100", 16)).toString(16).padStart(2, '0').toUpperCase();
    }
    console.log(`[${reg_list[reg_index]}] = ${reg_value[reg_index]}`);
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
    check_flag(reg_value[0]);
}

function ORI(mnemonic) {
    console.log("-----ORI-----");
    mnemonic = mnemonic.split(" ");
    let immediate_value = mnemonic[1];
    reg_value[0] = (parseInt(reg_value[0], 16) | parseInt(immediate_value, 16)).toString(16).padStart(2, '0').toUpperCase();
    console.log(`[A] = ${reg_value[0]}`);
    check_flag(reg_value[0]);
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
    check_flag(reg_value[0]);
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
    check_flag(reg_value[0]);
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
    check_flag(reg_value[0]);
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
    check_flag(reg_value[0]);
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
    check_flag(reg_value[0]);
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
    check_flag(reg_value[0]);
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
    check_flag(reg_value[0]);
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

function check_flag(regName) {
    console.log("Checking Flag...");
    if (parseInt(regName, 16) === 0) {
        flag[1] = 1;
    } else if (parseInt(regName, 16) !== 0) {
        flag[1] = 0;
    }
    if (parseInt(regName, 16) > 255 || flag[0] === 1) {
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

function split_address(address) {
    let mid = Math.floor(address.length / 2);
    let higherByte = (address.substring(0, mid)).padStart(2, '0').toUpperCase();
    let lowerByte = (address.substring(mid % 2 === 0 ? mid : (mid + 1))).padStart(2, '0').toUpperCase();
    return [higherByte, lowerByte];
}

function byte_8085(mnemonic) {
    let t = 0;
    let opcode = mnemonic.split(" ")[0];
    let one_byte = ["MOV", "ADD", "ADC", "CMP", "CMA", "INR", "INX", "DCR", "DCX", "DAD", "LDAX", "STAX", "HLT", "SUB", "SBB", "XCHG", "ANA", "ORA", "XRA", "RRC", "RLC", "RET", "RC", "RNC", "RP", "RM", "RPE", "RPO", "RZ", "RNZ", "PUSH", "POP", "NOP", "STC", "RAL", "RAR", "DAA", "CMC", "RIM", "SIM", "EI", "DI", "RST", "PCHL", "SPHL", "XTHL"]
    let two_byte = ["MVI", "ADI", "ANI", "ORI", "XRI", "ACI", "SUI", "SBI", "IN", "OUT", "CPI"]
    let three_byte = ["LDA", "LXI", "STA", "JMP", "CALL", "CC", "CNC", "CP", "CM", "CPE", "CPO", "CZ", "CNZ", "LHLD", "SHLD", "JC", "JNC", "JZ", "JNZ", "JP", "JM", "JPE", "JPO"]
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
        t = "error";
        return t;
    }
}

function memory_8085() {
    console.log("-----MEMORY VIEW/EDIT-----");
    console.log("If you want to change the value, type the desired value. Otherwise hit enter.");
    memory_active_status = 'active'
    mode_memory = 0
    enter.addEventListener('click', enterMemory = () => {
        mode_memory = 1
        if (initial_enter === true) {
            address = (parseInt(address, 16) - 1).toString(16).padStart(4, '0').toUpperCase();
            address_value = memory_location_value[parseInt(address, 16)]
            initial_enter = false
        }
        memory_location_value[parseInt(address, 16)] = address_value.toUpperCase();
        address = (parseInt(address, 16) + 1).toString(16).padStart(4, '0').toUpperCase();
        address_value = memory_location_value[parseInt(address, 16)]
        textBottom.value = `${address}:${address_value}`
        old_value = address_value
        string = address_value
    })
    escapeBtn.addEventListener('click', escapeMemory = () => {
        enter.removeEventListener('click', enterMemory)
        escapeBtn.removeEventListener('click', escapeMemory)
        if (initial_mode === false && memory_active_status === 'active') {
            textTop.innerHTML = "MENU:   A,D,M,F, "
            textBottom.value = "C,G,S,R,I,E,P"
            console.log("Done!")
            initial_mode = true
            initial_enter = false
            mode_memory = 0
            memory_active_status = 'inactive'
            address_active_status = 'inactive'
            execute_active_status = 'inactive'
            single_step_active = 'inactive'
            console.log("\nPress any of the given key:\nA - Assemble    G - Go Execute    S - Single Step    M - Memory View/Edit    R - Register View");
        }
    })
}

function instruction_decoder(mnemonic) {
    let instruction = mnemonic.split(' ')[0];
    let one_byte_list = ["MOV", "ADD", "ADC", "CMP", "CMA", "INR", "INX", "DCR", "DCX", "DAD", "LDAX", "STAX", "HLT", "SUB", "SBB", "XCHG", "ANA", "ORA", "XRA", "RRC", "RLC", "RET", "RC", "RNC", "RP", "RM", "RPE", "RPO", "RZ", "RNZ", "PUSH", "POP", "NOP", "STC", "RAL", "RAR", "RST", "SPHL", "PCHL", "XTHL", "DAA", "RIM", "SIM", "EI", "DI", "CMC"]
    let two_byte_list_1 = ["ADI", "ORI", "ACI", "SUI", "SBI", "CPI", "ANI", "IN", "OUT", "ORI", "XRI"]
    let two_byte_list_2 = ["MVI"];
    let three_byte_list_1 = ["LDA", "STA", "JMP", "CALL", "CC", "CNC", "CP", "CM", "CPE", "CPO", "CZ", "CNZ", "LHLD", "SHLD", "JC", "JNC", "JZ", "JNZ", "JP", "JM", "JPE", "JPO"];
    let three_byte_list_2 = ["LXI"];
    if (one_byte_list.includes(instruction)) {
        let byte = "ONE";
        let machine_code;
        switch (mnemonic) {
            case "ADD A": machine_code = "87"; break;
            case "ADD B": machine_code = "80"; break;
            case "ADD C": machine_code = "81"; break;
            case "ADD D": machine_code = "82"; break;
            case "ADD E": machine_code = "83"; break;
            case "ADD H": machine_code = "84"; break;
            case "ADD L": machine_code = "85"; break;
            case "ADD M": machine_code = "86"; break;
            case "ADC A": machine_code = "8F"; break;
            case "ADC B": machine_code = "88"; break;
            case "ADC C": machine_code = "89"; break;
            case "ADC D": machine_code = "8A"; break;
            case "ADC E": machine_code = "8B"; break;
            case "ADC H": machine_code = "8C"; break;
            case "ADC L": machine_code = "8D"; break;
            case "ADC M": machine_code = "8E"; break;
            case "ANA A": machine_code = "A7"; break;
            case "ANA B": machine_code = "A0"; break;
            case "ANA C": machine_code = "A1"; break;
            case "ANA D": machine_code = "A2"; break;
            case "ANA E": machine_code = "A3"; break;
            case "ANA H": machine_code = "A4"; break;
            case "ANA L": machine_code = "A5"; break;
            case "ANA M": machine_code = "A6"; break;
            case "CMA": machine_code = "2F"; break;
            case "CMC": machine_code = "3F"; break;
            case "CMP A": machine_code = "BF"; break;
            case "CMP B": machine_code = "B8"; break;
            case "CMP C": machine_code = "B9"; break;
            case "CMP D": machine_code = "BA"; break;
            case "CMP E": machine_code = "BB"; break;
            case "CMP H": machine_code = "BC"; break;
            case "CMP L": machine_code = "BD"; break;
            case "CMP M": machine_code = "BE"; break;
            case "DAA": machine_code = "27"; break;
            case "DAD B": machine_code = "09"; break;
            case "DAD D": machine_code = "19"; break;
            case "DAD H": machine_code = "29"; break;
            case "DAD SP": machine_code = "39"; break;
            case "DCR A": machine_code = "3D"; break;
            case "DCR B": machine_code = "05"; break;
            case "DCR C": machine_code = "0D"; break;
            case "DCR D": machine_code = "15"; break;
            case "DCR E": machine_code = "1D"; break;
            case "DCR H": machine_code = "25"; break;
            case "DCR L": machine_code = "2D"; break;
            case "DCR M": machine_code = "35"; break;
            case "DCX B": machine_code = "0B"; break;
            case "DCX D": machine_code = "1B"; break;
            case "DCX H": machine_code = "2B"; break;
            case "DCX SP": machine_code = "3B"; break;
            case "DI": machine_code = "F3"; break;
            case "EI": machine_code = "FB"; break;
            case "HLT": machine_code = "76"; break;
            case "INR A": machine_code = "3C"; break;
            case "INR B": machine_code = "04"; break;
            case "INR C": machine_code = "0C"; break;
            case "INR D": machine_code = "14"; break;
            case "INR E": machine_code = "1C"; break;
            case "INR H": machine_code = "24"; break;
            case "INR L": machine_code = "2C"; break;
            case "INR M": machine_code = "34"; break;
            case "INX B": machine_code = "03"; break;
            case "INX D": machine_code = "13"; break;
            case "INX H": machine_code = "23"; break;
            case "INX M": machine_code = "33"; break;
            case "LDAX B": machine_code = "0A"; break;
            case "LDAX D": machine_code = "1A"; break;
            case "MOV A,A": machine_code = "7F"; break;
            case "MOV A,B": machine_code = "78"; break;
            case "MOV A,C": machine_code = "79"; break;
            case "MOV A,D": machine_code = "7A"; break;
            case "MOV A,E": machine_code = "7B"; break;
            case "MOV A,H": machine_code = "7C"; break;
            case "MOV A,L": machine_code = "7D"; break;
            case "MOV A,M": machine_code = "7E"; break;
            case "MOV B,A": machine_code = "47"; break;
            case "MOV B,B": machine_code = "40"; break;
            case "MOV B,C": machine_code = "41"; break;
            case "MOV B,D": machine_code = "42"; break;
            case "MOV B,E": machine_code = "43"; break;
            case "MOV B,H": machine_code = "44"; break;
            case "MOV B,L": machine_code = "45"; break;
            case "MOV B,M": machine_code = "46"; break;
            case "MOV C,A": machine_code = "4F"; break;
            case "MOV C,B": machine_code = "48"; break;
            case "MOV C,C": machine_code = "49"; break;
            case "MOV C,D": machine_code = "4A"; break;
            case "MOV C,E": machine_code = "4B"; break;
            case "MOV C,H": machine_code = "4C"; break;
            case "MOV C,L": machine_code = "4D"; break;
            case "MOV C,M": machine_code = "4E"; break;
            case "MOV D,A": machine_code = "57"; break;
            case "MOV D,B": machine_code = "50"; break;
            case "MOV D,C": machine_code = "51"; break;
            case "MOV D,D": machine_code = "52"; break;
            case "MOV D,E": machine_code = "53"; break;
            case "MOV D,H": machine_code = "54"; break;
            case "MOV D,L": machine_code = "55"; break;
            case "MOV D,M": machine_code = "56"; break;
            case "MOV E,A": machine_code = "5F"; break;
            case "MOV E,B": machine_code = "58"; break;
            case "MOV E,C": machine_code = "59"; break;
            case "MOV E,D": machine_code = "5A"; break;
            case "MOV E,E": machine_code = "5B"; break;
            case "MOV E,H": machine_code = "5C"; break;
            case "MOV E,L": machine_code = "5D"; break;
            case "MOV E,M": machine_code = "5E"; break;
            case "MOV H,A": machine_code = "67"; break;
            case "MOV H,B": machine_code = "60"; break;
            case "MOV H,C": machine_code = "61"; break;
            case "MOV H,D": machine_code = "62"; break;
            case "MOV H,E": machine_code = "63"; break;
            case "MOV H,H": machine_code = "64"; break;
            case "MOV H,L": machine_code = "65"; break;
            case "MOV H,M": machine_code = "66"; break;
            case "MOV L,A": machine_code = "6F"; break;
            case "MOV L,B": machine_code = "68"; break;
            case "MOV L,C": machine_code = "69"; break;
            case "MOV L,D": machine_code = "6A"; break;
            case "MOV L,E": machine_code = "6B"; break;
            case "MOV L,H": machine_code = "6C"; break;
            case "MOV L,L": machine_code = "6D"; break;
            case "MOV L,M": machine_code = "6E"; break;
            case "MOV M,A": machine_code = "77"; break;
            case "MOV M,B": machine_code = "70"; break;
            case "MOV M,C": machine_code = "71"; break;
            case "MOV M,D": machine_code = "72"; break;
            case "MOV M,E": machine_code = "73"; break;
            case "MOV M,H": machine_code = "74"; break;
            case "MOV M,L": machine_code = "75"; break;
            case "NOP": machine_code = "00"; break;
            case "ORA A": machine_code = "B7"; break;
            case "ORA B": machine_code = "B0"; break;
            case "ORA C": machine_code = "B1"; break;
            case "ORA D": machine_code = "B2"; break;
            case "ORA E": machine_code = "B3"; break;
            case "ORA H": machine_code = "B4"; break;
            case "ORA L": machine_code = "B5"; break;
            case "ORA M": machine_code = "B6"; break;
            case "PCHL": machine_code = "E9"; break;
            case "PUSH B": machine_code = "C5"; break;
            case "PUSH D": machine_code = "D5"; break;
            case "PUSH H": machine_code = "E5"; break;
            case "PUSH PSW": machine_code = "F5"; break;
            case "POP B": machine_code = "C1"; break;
            case "POP D": machine_code = "D1"; break;
            case "POP H": machine_code = "E1"; break;
            case "POP PSW": machine_code = "F1"; break;
            case "RST 0": machine_code = "C7"; break;
            case "RST 1": machine_code = "CF"; break;
            case "RST 2": machine_code = "D7"; break;
            case "RST 3": machine_code = "DF"; break;
            case "RST 4": machine_code = "E7"; break;
            case "RST 5": machine_code = "EF"; break;
            case "RST 6": machine_code = "F7"; break;
            case "RST 7": machine_code = "FF"; break;
            case "RET": machine_code = "C9"; break;
            case "RC": machine_code = "D8"; break;
            case "RNC": machine_code = "D0"; break;
            case "RP": machine_code = "F0"; break;
            case "RM": machine_code = "F8"; break;
            case "RPE": machine_code = "E8"; break;
            case "RPO": machine_code = "E0"; break;
            case "RZ": machine_code = "C8"; break;
            case "RNZ": machine_code = "C0"; break;
            case "RAL": machine_code = "17"; break;
            case "RAR": machine_code = "1F"; break;
            case "RLC": machine_code = "07"; break;
            case "RRC": machine_code = "0F"; break;
            case "RIM": machine_code = "20"; break;
            case "SIM": machine_code = "30"; break;
            case "SPHL": machine_code = "F9"; break;
            case "STAX B": machine_code = "02"; break;
            case "STAX D": machine_code = "12"; break;
            case "STC": machine_code = "37"; break;
            case "SUB A": machine_code = "97"; break;
            case "SUB B": machine_code = "90"; break;
            case "SUB C": machine_code = "91"; break;
            case "SUB D": machine_code = "92"; break;
            case "SUB E": machine_code = "93"; break;
            case "SUB H": machine_code = "94"; break;
            case "SUB L": machine_code = "95"; break;
            case "SUB M": machine_code = "96"; break;
            case "SBB A": machine_code = "9F"; break;
            case "SBB B": machine_code = "98"; break;
            case "SBB C": machine_code = "99"; break;
            case "SBB D": machine_code = "9A"; break;
            case "SBB E": machine_code = "9B"; break;
            case "SBB H": machine_code = "9C"; break;
            case "SBB L": machine_code = "9D"; break;
            case "SBB M": machine_code = "9E"; break;
            case "XCHG": machine_code = "EB"; break;
            case "XRA A": machine_code = "AF"; break;
            case "XRA B": machine_code = "A8"; break;
            case "XRA C": machine_code = "A9"; break;
            case "XRA D": machine_code = "AA"; break;
            case "XRA E": machine_code = "AB"; break;
            case "XRA H": machine_code = "AC"; break;
            case "XRA L": machine_code = "AD"; break;
            case "XRA M": machine_code = "AE"; break;
            case "XTHL": machine_code = "E3"; break;
            default:
                console.log("Unknown instruction...");
                return { byte: "Error", machine_code: null, immediate_value: null };
        }
        ret_value = [byte, machine_code, immediate_value = null]
        return ret_value
    } else if (two_byte_list_1.includes(instruction)) {
        let byte = "TWO";
        mnemonicmnemonic = mnemonic.split(" ");
        let opcode = mnemonicmnemonic[0];
        let immediate_value = mnemonicmnemonic[1];
        let machine_code;
        switch (opcode) {
            case "ADI": machine_code = "C6"; break;
            case "ACI": machine_code = "CE"; break;
            case "ANI": machine_code = "E6"; break;
            case "CPI": machine_code = "FE"; break;
            case "IN": machine_code = "DB"; break;
            case "OUT": machine_code = "D3"; break;
            case "ORI": machine_code = "F6"; break;
            case "SUI": machine_code = "D6"; break;
            case "SBI": machine_code = "DE"; break;
            case "XRI": machine_code = "EE"; break;
            default:
                console.log("Unknown instruction...");
                return { byte: "Error", machine_code: null, immediate_value: null };
        }
        ret_value = [byte, machine_code, immediate_value]
        return ret_value
    } else if (two_byte_list_2.includes(instruction)) {
        let byte = "TWO";
        mnemonicmnemonic = mnemonic.split(",");
        let opcode = mnemonicmnemonic[0];
        let immediate_value = mnemonicmnemonic[1];
        let machine_code;
        switch (opcode) {
            case "MVI A": machine_code = "3E"; break;
            case "MVI B": machine_code = "06"; break;
            case "MVI C": machine_code = "0E"; break;
            case "MVI D": machine_code = "16"; break;
            case "MVI E": machine_code = "1E"; break;
            case "MVI H": machine_code = "26"; break;
            case "MVI L": machine_code = "2E"; break;
            case "MVI M": machine_code = "36"; break;
            default:
                console.log("Unknown instruction...");
                return { byte: "Error", machine_code: null, immediate_value: null };
        }
        ret_value = [byte, machine_code, immediate_value]
        return ret_value
    } else if (three_byte_list_1.includes(instruction)) {
        let byte = "THREE";
        mnemonicmnemonic = mnemonic.split(" ");
        let opcode = mnemonicmnemonic[0];
        let memoryLocation = mnemonicmnemonic[1];
        let machine_code;
        switch (opcode) {
            case "CALL": machine_code = "CD"; break;
            case "CC": machine_code = "DC"; break;
            case "CNC": machine_code = "D4"; break;
            case "CP": machine_code = "F4"; break;
            case "CM": machine_code = "FC"; break;
            case "CPE": machine_code = "EC"; break;
            case "CPO": machine_code = "E4"; break;
            case "CZ": machine_code = "CC"; break;
            case "CNZ": machine_code = "C4"; break;
            case "LDA": machine_code = "3A"; break;
            case "STA": machine_code = "32"; break;
            case "JMP": machine_code = "C3"; break;
            case "JC": machine_code = "DA"; break;
            case "JNC": machine_code = "D2"; break;
            case "JZ": machine_code = "CA"; break;
            case "JNZ": machine_code = "C2"; break;
            case "JP": machine_code = "F2"; break;
            case "JM": machine_code = "FA"; break;
            case "JPE": machine_code = "EA"; break;
            case "JPO": machine_code = "E2"; break;
            case "LHLD": machine_code = "2A"; break;
            case "SHLD": machine_code = "22"; break;
            default:
                console.log("Unknown instruction...");
                return { byte: "Error", machine_code: null, immediate_value: null };
        }
        ret_value = [byte, machine_code, memoryLocation]
        return ret_value
    } else if (three_byte_list_2.includes(instruction)) {
        let byte = "THREE";
        mnemonicmnemonic = mnemonic.split(",");
        let opcode = mnemonicmnemonic[0];
        let memoryLocation = mnemonicmnemonic[1];
        let machine_code;
        switch (opcode) {
            case "LXI B": machine_code = "01"; break;
            case "LXI D": machine_code = "11"; break;
            case "LXI H": machine_code = "21"; break;
            case "LXI SP": machine_code = "31"; break;
            default:
                console.log("Unknown instruction...");
                return { byte: "Error", machine_code: null, immediate_value: null };
        }
        ret_value = [byte, machine_code, memoryLocation]
        return ret_value
    } else {
        console.log("Unknown instruction...");
        return { byte: "Error", machine_code: null, immediate_value: null };
    }
}

function MN_to_MC(address, mnemonic) {
    let [byte, machine_code, iv_ml] = instruction_decoder(mnemonic); // iv_ml means immediate_value or memory_location
    if (byte === "ONE") {
        machine_code = String(machine_code).padStart(2, '0').toUpperCase();
        address = String(address).toString(16).padStart(4, '0').toUpperCase();
        memory_location_value[parseInt(address, 16)] = machine_code;
        let ret_value = [machine_code, null, null];
        return ret_value
    } else if (byte === "TWO") {
        machine_code = String(machine_code).padStart(2, '0').toUpperCase();
        address = String(address).toString(16).padStart(4, '0').toUpperCase();
        memory_location_value[parseInt(address, 16)] = machine_code;
        let immediate_value = String(iv_ml).padStart(2, '0').toUpperCase();
        address = String((parseInt(address, 16) + 1).toString(16)).padStart(4, '0').toUpperCase();
        memory_location_value[parseInt(address, 16)] = immediate_value;
        let ret_value = [machine_code, immediate_value, null];
        return ret_value
    } else if (byte === "THREE") {
        machine_code = String(machine_code).padStart(2, '0').toUpperCase();
        address = String(address).toString(16).padStart(4, '0').toUpperCase();
        memory_location_value[parseInt(address, 16)] = machine_code;
        let memory_location = iv_ml;
        let [higher_byte, lower_byte] = split_address(memory_location);
        lower_byte = String(lower_byte).padStart(2, '0').toUpperCase();
        higher_byte = String(higher_byte, 16).padStart(2, '0').toUpperCase();
        address = String((parseInt(address, 16) + 1).toString(16)).padStart(4, '0').toUpperCase();
        memory_location_value[parseInt(address, 16)] = lower_byte;
        address = String((parseInt(address, 16) + 1).toString(16)).padStart(4, '0').toUpperCase();
        memory_location_value[parseInt(address, 16)] = higher_byte;
        let ret_value = [machine_code, lower_byte, higher_byte];
        return ret_value
    } else if (byte === "Error") {
        return [machine_code, null, null];
    }
}

function address_8085() {
    console.log("-----ADDRESS-----");
    mnemonic;
    mode_address = 0
    address_active_status = 'active'
    textBottom.value = "ADDR:" + address
    address = String(address).toString(16).padStart(4, '0').toUpperCase();
    enter.addEventListener('click', enterAddress = () => {
        textBottom.value = ''
        mode_address = 1
        textTop.innerHTML = `ASSEMBLE:${address}`
        textBottom.value = `${string}`
        if (string !== '') {
            mnemonic = textBottom.value
            let byte = byte_8085(mnemonic);
            if (byte !== "error") {
                let ret_value = MN_to_MC(address, mnemonic);
                let machineCode = ret_value[0]
                let nextAddress1 = ret_value[1]
                let nextAddress2 = ret_value[2]
                if (nextAddress1 === null && nextAddress2 === null) {
                    textTop.innerHTML = `${address}:${machineCode}`
                    textBottom.value = ''
                } else if (nextAddress2 === null) {
                    textTop.innerHTML = `${address}:${machineCode}:${nextAddress1}`
                    textBottom.value = ''
                } else {
                    textTop.innerHTML = `${address}:${machineCode}:${nextAddress1}:${nextAddress2}`
                    textBottom.value = ''
                }
                console.log(`${address}: ${string}`)
            } else {
                textTop.innerHTML = "SYNTAX ERROR!"
                textBottom.value = ''
            }
            if (byte === 1) {
                address = (parseInt(address, 16) + parseInt("1", 16)).toString(16).toUpperCase().padStart(4, '0')
            } else if (byte === 2) {
                address = (parseInt(address, 16) + parseInt("2", 16)).toString(16).toUpperCase().padStart(4, '0')
            } else if (byte === 3) {
                address = (parseInt(address, 16) + parseInt("3", 16)).toString(16).toUpperCase().padStart(4, '0')
            }
            string = ''
        }
    })
    escapeBtn.addEventListener('click', escapeAddress = () => {
        enter.removeEventListener('click', enterAddress)
        escapeBtn.removeEventListener('click', escapeAddress)
        if (initial_mode === false && memory_active_status !== 'active') {
            textTop.innerHTML = "MENU:   A,D,M,F, "
            textBottom.value = "C,G,S,R,I,E,P"
            initial_mode = true
            mode_address = 0
            memory_active_status = 'inactive'
            address_active_status = 'inactive'
            execute_active_status = 'inactive'
            single_step_active = 'inactive'
            console.log("\nPress any of the given key:\nA - Assemble    G - Go Execute    S - Single Step    M - Memory View/Edit    R - Register View");
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
    mnemonic = "";
    if (byte === "ONE") {
        mnemonic = mnemonic_opcode;
        console.log(`\n${address}:${mnemonic_opcode}`);
        if (single_step_active === 'active') {
            textTop.innerHTML = address + ":"
            textBottom.value = mnemonic_opcode
        }
        address = (parseInt(address, 16)).toString(16).toUpperCase().padStart(4, '0');
    } else if (byte === "TWO_1") {
        let address_1 = address;
        address = (parseInt(address, 16) + 1).toString(16).toUpperCase().padStart(4, '0');
        machine_code = memory_location_value[parseInt(address, 16)];
        mnemonic = `${mnemonic_opcode} ${String(machine_code).padStart(2, '0')}`;
        console.log(`\n${address_1}:${mnemonic}`);
        if (single_step_active === 'active') {
            textTop.innerHTML = address_1 + ":"
            textBottom.value = mnemonic
        }
    } else if (byte === "TWO_2") {
        let address_1 = address;
        address = (parseInt(address, 16) + 1).toString(16).toUpperCase().padStart(4, '0');
        machine_code = memory_location_value[parseInt(address, 16)];
        mnemonic = `${mnemonic_opcode},${String(machine_code).padStart(2, '0')}`;
        console.log(`\n${address_1}:${mnemonic}`);
        if (single_step_active === 'active') {
            textTop.innerHTML = address_1 + ":"
            textBottom.value = mnemonic
        }
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
        if (single_step_active === 'active') {
            textTop.innerHTML = address_1 + ":"
            textBottom.value = mnemonic
        }
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
        if (single_step_active === 'active') {
            textTop.innerHTML = address_1 + ":"
            textBottom.value = mnemonic
        }
        address = (parseInt(address, 16)).toString(16).toUpperCase().padStart(4, '0');
    } else if (byte === null) {
        mnemonic = "UNKNOWN MNEMONIC";
        if (single_step_active === 'active') {
            textTop.innerHTML = address + ":"
            textBottom.value = mnemonic
        }
        address = (parseInt(address, 16)).toString(16).toUpperCase().padStart(4, '0');
    }
    return [mnemonic, address];
}

function execute_8085() {
    mode_address = 0
    address_active_status = 'active'
    enter.addEventListener('click', enterExecute = () => {
        if (initial_mode === false && memory_active_status !== 'active' && execute_address === "active") {
            address = (address).toString(16).toUpperCase().padStart(4, '0');
            if (single_step_active === "inactive") {
                console.log("Executing...");
                textTop.innerHTML = "EXECUTING...."
                textBottom.value = ''
            }
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
                        console.log("-----HLT-----\nExecuted succesfully");
                        break;
                    default:
                        console.log(`The instruction "${instruction}" (${memory_location_value[parseInt(address, 16)]}) at memory location "${address}" is not provided by the developer...`);
                }
                if (opcode !== "CALL" && opcode !== "CC" && opcode !== "CNC" && opcode !== "CP" && opcode !== "CM" && opcode !== "CPE" && opcode !== "CPO" && opcode !== "CZ" && opcode !== "CNZ" && opcode !== "JMP" && opcode !== "JC" && opcode !== "JNC" && opcode !== "JZ" && opcode !== "JNZ" && opcode !== "RET" && opcode !== "RC" && opcode !== "RNC" && opcode !== "RP" && opcode !== "RM" && opcode !== "RPE" && opcode !== "RPO" && opcode !== "RZ" && opcode !== "RNZ") {
                    address = (parseInt(address, 16) + 1).toString(16).toUpperCase().padStart(4, '0');
                }
                if (opcode === "HLT" || address === "10000" || address === "10001" || address === "10002") {
                    console.log("\nProgram Terminated...")
                    let flag_bin = reg_value[1].join('');
                    let flag_hex = parseInt(flag_bin, 2).toString(16).padStart(2, '0').toUpperCase();
                    console.log(`[A]  = ${reg_value[0].toString().padStart(2, '0').toUpperCase()}   Flag  = ${flag_hex} = ${flag_bin}`);
                    console.log(`[B]  = ${reg_value[2].toString().padStart(2, '0').toUpperCase()}    [C]  = ${reg_value[3].toString().padStart(2, '0').toUpperCase()}`);
                    console.log(`[D]  = ${reg_value[4].toString().padStart(2, '0').toUpperCase()}    [E]  = ${reg_value[5].toString().padStart(2, '0').toUpperCase()}`);
                    console.log(`[H]  = ${reg_value[6].toString().padStart(2, '0').toUpperCase()}    [L]  = ${reg_value[7].toString().padStart(2, '0').toUpperCase()}`);
                    console.log(`[PC] = ${address}  [SP] = ${stack_pointer}`);
                    details.innerHTML = `<br/>[A]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;${reg_value[0].toString().padStart(2, '0').toUpperCase()}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Flag&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;${flag_hex}<br/>
                                         [B]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;${reg_value[2].toString().padStart(2, '0').toUpperCase()}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[C]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;${reg_value[3].toString().padStart(2, '0').toUpperCase()}<br/>
                                         [D]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;${reg_value[4].toString().padStart(2, '0').toUpperCase()}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[E]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;${reg_value[5].toString().padStart(2, '0').toUpperCase()}<br/>
                                         [H]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;${reg_value[6].toString().padStart(2, '0').toUpperCase()}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[L]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;${reg_value[7].toString().padStart(2, '0').toUpperCase()}<br/>
                                         [PC]&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;${address}&nbsp;&nbsp;&nbsp;&nbsp;[SP]&nbsp;&nbsp;=&nbsp;&nbsp;${stack_pointer}`
                    break;
                }
            }
        }
    })

    escapeBtn.addEventListener('click', escapeExecute = () => {
        enter.removeEventListener('click', enterExecute)
        escapeBtn.removeEventListener('click', escapeExecute)
        hexButtons.forEach(hex => { hex.removeEventListener('click', hexFunc) })
        buttons.forEach(btn => { btn.removeEventListener('click', buttonFunc) })
        flag = [0, 0, 0, 0, 0, 0, 0, 0];
        string = ''
        address = '8000'
        memory_active_status = 'inactive'
        address_active_status = 'inactive'
        execute_active_status = 'inactive'
        single_step_active = 'inactive'
        execute_address = 'inactive'
        initial_mode = true
        mode_memory = 0
        mode_address = 0
        mode_execute = 0
        details.innerHTML = ''
        textTop.innerHTML = "MENU:   A,D,M,F, "
        textBottom.value = "C,G,S,R,I,E,P"
        console.log("\nPress any of the given key:\nA - Assemble    G - Go Execute    S - Single Step    M - Memory View/Edit    R - Register View");
    })
}

function memory_address_M(mode) {
    if (mode === 0) {
        console.log("Storing the value to Memory address...");
        reg_value[6] = String(reg_value[6]).padStart(2, '0').toUpperCase();
        reg_value[7] = String(reg_value[7]).padStart(2, '0').toUpperCase();
        let M_address = reg_value[6] + reg_value[7];
        memory_location_value[parseInt(M_address, 16)] = reg_value[8];
        console.log(`[H] = ${reg_value[6]} [L] = ${reg_value[7]}`);
        console.log(`[M] = [${M_address}] = ${reg_value[8]}`);
    } else if (mode === 1) {
        console.log("Retrieving the value from Memory address...");
        reg_value[6] = String(reg_value[6]).padStart(2, '0').toUpperCase();
        reg_value[7] = String(reg_value[7]).padStart(2, '0').toUpperCase();
        let M_address = reg_value[6] + reg_value[7];
        reg_value[8] = memory_location_value[parseInt(M_address, 16)];
        console.log(`[M] = [${M_address}] = ${reg_value[8]}`);
        console.log(`[H] = ${reg_value[6]} [L] = ${reg_value[7]}`);
    }
}

reset.addEventListener('click', () => {
    setTimeout(() => {
        enter.removeEventListener('click', enterExecute)
        escapeBtn.removeEventListener('click', escapeExecute)
        hexButtons.forEach(hex => { hex.removeEventListener('click', hexFunc) })
        buttons.forEach(btn => { btn.removeEventListener('click', buttonFunc) })
        flag = [0, 0, 0, 0, 0, 0, 0, 0];
        string = ''
        address = '8000'
        memory_active_status = 'inactive'
        address_active_status = 'inactive'
        execute_active_status = 'inactive'
        single_step_active = 'inactive'
        execute_address = 'inactive'
        initial_mode = true
        mode_memory = 0
        mode_address = 0
        mode_execute = 0
        details.innerHTML = ''
        textTop.innerHTML = "SCIENTIFIC TECH"
        textBottom.value = "8085 TRAINER KIT"
        setTimeout(() => {
            textTop.innerHTML = "MENU:   A,D,M,F, "
            textBottom.value = "C,G,S,R,I,E,P"
        }, 1000)
    }, 500)
    console.log("\nPress any of the given key:\nA - Assemble    G - Go Execute    S - Single Step    M - Memory View/Edit    R - Register View");
})

buttons.forEach(btn => {
    btn.addEventListener('click', buttonFunc = () => {
        if (mode_address === 0 && initial_mode === false && address_active_status === 'active') {
            if (btn.innerHTML === '⌫') {
                address = address.substring(0, address.length - 1)
                textBottom.value = `ADDR:${address}`
            } else if (address.length < 4) {
                if (btn.innerHTML === 'Enter') {
                    textBottom.value = `ADDR:${address}`
                } else if (btn.innerHTML !== 'Enter') {
                    address += btn.innerHTML
                    textBottom.value = `ADDR:${address}`
                }
            }
        } else if (mode_address === 1 && initial_mode === false && address_active_status === 'active') {
            if (btn.innerHTML === '⌫') {
                string = string.substring(0, string.length - 1)
                display_string = string + "_"
                textBottom.value = `${display_string}`
            } else if (btn.innerHTML === 'Space') {
                string += ' '
                display_string = string + "_"
                textBottom.value = `${display_string}`
            } else if (btn.innerHTML === 'Enter') {
            } else {
                string += btn.innerHTML
                display_string = string + "_"
                textTop.innerHTML = `ASSEMBLE:${address}`
                textBottom.value = `${display_string}`
            }
        }
    })
})

hexButtons.forEach(hex => {
    hex.addEventListener('click', hexFunc = () => {
        if (mode_memory === 0 && initial_mode === false && memory_active_status === 'active') {
            if (hex.innerHTML === '⌫') {
                address = address.substring(0, address.length - 1)
                textBottom.value = `ADDR:${address}`
            } else if (address.length < 4) {
                if (hex.innerHTML === 'Enter') {
                    textBottom.value = `ADDR:${address}`
                } else if (hex.innerHTML !== 'Enter') {
                    address += hex.innerHTML
                    textBottom.value = `ADDR:${address}`
                }
            }
        } else if (mode_memory === 1 && initial_mode === false && memory_active_status === 'active') {
            if (hex.innerHTML === '⌫') {
                string = string.substring(0, string.length - 1)
                address_value = string
                textBottom.value = `${address}:${string}`
            } else if (string.length <= 2) {
                if (hex.innerHTML === 'Enter') {
                    console.log(`${address}:${old_value} ${string}`)
                    textBottom.value = `${address}:${address_value}`
                } else if (string.length < 2)  {
                    string += hex.innerHTML
                    address_value = string
                    textBottom.value = `${address}:${address_value}`
                }
            }
        }
    })
})

spclButtons.forEach(spclbtn => {
    spclbtn.addEventListener('click', spclFunc = () => {
        if (spclbtn.innerHTML === 'M' && initial_mode === true) {
            initial_mode = false
            initial_enter = true
            textTop.innerHTML = "MEMORY VIEW/EDIT"
            textBottom.value = "ADDR:" + address
            memory_8085()
        } else if (spclbtn.innerHTML === 'A' && initial_mode === true) {
            initial_mode = false
            textTop.innerHTML = "ASSEMBLE"
            textBottom.value = "ADDR:" + address
            address_8085()
        } else if (spclbtn.innerHTML === 'G' && initial_mode === true) {
            initial_mode = false
            execute_address = 'active'
            textTop.innerHTML = "GO EXECUTE"
            textBottom.value = "ADDR:" + address
            execute_8085()
        } else if (spclbtn.innerHTML === 'S' && initial_mode === true) {
            initial_mode = false
            single_step_active = 'active'
            execute_address = 'active'
            textTop.innerHTML = "SINGLE STEP"
            textBottom.value = "ADDR:" + address
            execute_8085()
        } else if (spclbtn.innerHTML === 'R' && initial_mode === true) {
            initial_mode = false
            let flag_bin = flag.join('');
            let flag_hex = parseInt(flag_bin, 2).toString(16).toUpperCase().padStart(2, '0');
            textTop.innerHTML = "REG VIEW"
            let regArray = ["PSW", "BC", "DE", "HL"]
            textBottom.value = `${regArray[0]}:${reg_value[0].toString(16).toUpperCase().padStart(2, '0') + flag_hex}`
            let i = 1
            let j = 2
            let k = 3
            enter.addEventListener('click', enterExecute = () => {
                if (i === 0) {
                    textBottom.value = `${regArray[i]}:${reg_value[j].toString(16).toUpperCase().padStart(2, '0') + flag_hex}`
                    i += 1
                    j += 2
                    k += 2
                } else {
                    textBottom.value = `${regArray[i]}:${reg_value[j].toString(16).toUpperCase().padStart(2, '0') + reg_value[k].toString(16).toUpperCase().padStart(2, '0')}`
                    i += 1
                    j += 2
                    k += 2
                    if (i > regArray.length - 1) {
                        i = 0; j = 0; k = 1;
                    }
                }
            })
            console.log(`[PSW] = ${reg_value[0].toString().padStart(2, '0').toUpperCase()}${flagHex}  [BC] = ${reg_value[2].toString().padStart(2, '0').toUpperCase()}${reg_value[3].toString().padStart(2, '0').toUpperCase()}`);
            console.log(`[DE]  = ${reg_value[4].toString().padStart(2, '0').toUpperCase()}${reg_value[5].toString().padStart(2, '0').toUpperCase()}  [HL] = ${reg_value[6].toString().padStart(2, '0').toUpperCase()}${reg_value[7].toString().padStart(2, '0').toUpperCase()}`);
            console.log(`[PC]  = ${address}  [SP] = ${stack_pointer}`);

        }
    })
})
