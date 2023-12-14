import random

global A, flag, B, C, D, E, H, L, M
global reg_list, reg_value, single_step_active
global address, flag_status, memory_location_value
global stack, stack_value, stack_pointer
A = hex(0)[2:]
flag = [0, 0, 0, 0, 0, 0, 0, 0]
B = hex(0)[2:]
C = hex(0)[2:]
D = hex(0)[2:]
E = hex(0)[2:]
H = hex(0)[2:]
L = hex(0)[2:]
M = hex(0)[2:]
reg_list = ["A", "flag", "B", "C", "D", "E", "H", "L", "M"]
reg_value = [A, flag, B, C, D, E, H, L, M]
single_step_active = "inactive"

stack = ["0FFF"]
stack_value = []
stack_pointer = "0FFF"

memory_location_value = []
n = 0
for i in range(65536):
    n = random.randint(0, 255)
    n = hex(n)[2:]
    if int(n, 16) < 16:
        n = str(n).zfill(2)
    memory_location_value.append(n.upper())
    
def ADD(mnemonic):
    print("-----ADD-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    if reg_1 == "M":
        memory_address_M(1)
    reg_value[0] = hex(int(reg_value[0], 16) + int(reg_value[reg_1], 16))[2:]
    if int(reg_value[0], 16) > 255:
        check_accumulator()
        reg_value[0] = hex(int(reg_value[0], 16) - int("100", 16))[2:]
    reg_value[0] = str(reg_value[0]).zfill(2).upper()
    print(f"[A] = {reg_value[0]}")
    
def ADI(mnemonic):
    print("-----ADI-----")
    mnemonic = mnemonic.split()
    immediate_value = mnemonic[1]
    if len(str(immediate_value)) == 2:
        reg_value[0] = hex(int(str(reg_value[0]), 16) + int(str(immediate_value), 16))[2:]
        if int(reg_value[0], 16) > 255:
            check_accumulator()
            reg_value[0] = hex(int(reg_value[0], 16) - int("100", 16))[2:]
    else:
        print("Invalid value: Expected value is one byte hexadecimal value")
    reg_value[0] = str(reg_value[0]).zfill(2).upper()
    print(f"[A] = {reg_value[0]}")

def ANA(mnemonic):
    print("-----ANA-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    if reg_1 == "M":
        memory_address_M(1)
    reg_value[0] = int(reg_value[0], 16) & int(reg_value[reg_1], 16)
    check_accumulator()
    reg_value[0] = str(reg_value[0]).zfill(2).upper()
    print(f"[A] = {reg_value[0]}")
    
def ANI(mnemonic):
    print("-----ANI-----")
    mnemonic = mnemonic.split()
    immediate_value = mnemonic[1]
    if len(str(immediate_value)) == 2:
        reg_value[0] = hex(int(str(reg_value[0]), 16) & int(str(immediate_value), 16))[2:]
        check_accumulator()
    else:
        print("Invalid value: Expected value is one byte hexadecimal value")
    reg_value[0] = str(reg_value[0]).zfill(2).upper()
    print(f"[A] = {reg_value[0]}")

def CALL(mnemonic):
    global ret_address, stack_pointer
    global address
    print("-----CALL-----")
    mnemonic = mnemonic.split()
    call_address = mnemonic[1]
    ret_address = str(hex(int(address, 16) + 1)[2:]).zfill(4).upper()
    higher_byte, lower_byte = split_address(ret_address)
    stack_value.append(higher_byte)
    stack_pointer = str(hex(int(stack_pointer, 16) - 1)[2:]).zfill(4).upper()
    stack_value.append(lower_byte)
    address = str(hex(int(call_address, 16))[2:]).zfill(4).upper()
    print(f"Going to {call_address}")
    print(f"Stack pointer = {stack_pointer}")
    print(f"Stack = {stack}")
    print(f"Stack value = {stack_value}")
    return address
    
def CC(mnemonic):
    global ret_address, stack_pointer
    global address
    print("-----CC-----")
    if flag[7] == 1:
        mnemonic = mnemonic.split()
        call_address = mnemonic[1]
        ret_address = str(hex(int(call_address, 16) + 1)[2:]).zfill(4).upper()
        higher_byte, lower_byte = split_address(ret_address)
        if stack == []:
            stack_pointer = "0FFF"
            stack.append(stack_pointer)
            stack_value.append(higher_byte)
            stack_pointer = str(hex(int(stack_pointer, 16) - 1)[2:]).zfill(4).upper()
            stack_value.append(lower_byte)
        elif stack != []:    
            stack.append(stack_pointer)
            stack_value.append(higher_byte)
            stack_pointer = str(hex(int(stack_pointer, 16) - 1)[2:]).zfill(4).upper()
            stack_value.append(lower_byte)
        else:
            print("Stack error: Stack not initialized")    
        address = str(hex(int(call_address, 16))[2:]).zfill(4).upper()
        print(f"Going to {call_address}")
        print(f"Stack pointer = {stack_pointer}")
        print(f"Stack = {stack}")
        print(f"Stack value = {stack_value}")
        return address
    else:
        return str(address + 1).zfill(4).upper()
        
def CNC(mnemonic):
    global ret_address, stack_pointer
    global address
    print("-----CNC-----")
    if flag[7] == 0:
        mnemonic = mnemonic.split()
        call_address = mnemonic[1]
        ret_address = str(hex(int(call_address, 16) + 1)[2:]).zfill(4).upper()
        higher_byte, lower_byte = split_address(ret_address)
        if stack == []:
            stack_pointer = "0FFF"
            stack.append(stack_pointer)
            stack_value.append(higher_byte)
            stack_pointer = str(hex(int(stack_pointer, 16) - 1)[2:]).zfill(4).upper()
            stack_value.append(lower_byte)
        elif stack != []:    
            stack.append(stack_pointer)
            stack_value.append(higher_byte)
            stack_pointer = str(hex(int(stack_pointer, 16) - 1)[2:]).zfill(4).upper()
            stack_value.append(lower_byte)
        else:
            print("Stack error: Stack not initialized")    
        address = str(hex(int(call_address, 16))[2:]).zfill(4).upper()
        print(f"Going to {call_address}")
        print(f"Stack pointer = {stack_pointer}")
        print(f"Stack = {stack}")
        print(f"Stack value = {stack_value}")
        return address
    else:
        return str(address + 1).zfill(4).upper()
        
def CP(mnemonic):
    global ret_address, stack_pointer
    global address
    print("-----CP-----")
    if flag[0] == 0:
        mnemonic = mnemonic.split()
        call_address = mnemonic[1]
        ret_address = str(hex(int(call_address, 16) + 1)[2:]).zfill(4).upper()
        higher_byte, lower_byte = split_address(ret_address)
        if stack == []:
            stack_pointer = "0FFF"
            stack.append(stack_pointer)
            stack_value.append(higher_byte)
            stack_pointer = str(hex(int(stack_pointer, 16) - 1)[2:]).zfill(4).upper()
            stack_value.append(lower_byte)
        elif stack != []:    
            stack.append(stack_pointer)
            stack_value.append(higher_byte)
            stack_pointer = str(hex(int(stack_pointer, 16) - 1)[2:]).zfill(4).upper()
            stack_value.append(lower_byte)
        else:
            print("Stack error: Stack not initialized")    
        address = str(hex(int(call_address, 16))[2:]).zfill(4).upper()
        print(f"Going to {call_address}")
        print(f"Stack pointer = {stack_pointer}")
        print(f"Stack = {stack}")
        print(f"Stack value = {stack_value}")
        return address
    else:
        return str(address + 1).zfill(4).upper()
        
def CM(mnemonic):
    global ret_address, stack_pointer
    global address
    print("-----CM-----")
    if flag[0] == 1:
        mnemonic = mnemonic.split()
        call_address = mnemonic[1]
        ret_address = str(hex(int(call_address, 16) + 1)[2:]).zfill(4).upper()
        higher_byte, lower_byte = split_address(ret_address)
        if stack == []:
            stack_pointer = "0FFF"
            stack.append(stack_pointer)
            stack_value.append(higher_byte)
            stack_pointer = str(hex(int(stack_pointer, 16) - 1)[2:]).zfill(4).upper()
            stack_value.append(lower_byte)
        elif stack != []:    
            stack.append(stack_pointer)
            stack_value.append(higher_byte)
            stack_pointer = str(hex(int(stack_pointer, 16) - 1)[2:]).zfill(4).upper()
            stack_value.append(lower_byte)
        else:
            print("Stack error: Stack not initialized")    
        address = str(hex(int(call_address, 16))[2:]).zfill(4).upper()
        print(f"Going to {call_address}")
        print(f"Stack pointer = {stack_pointer}")
        print(f"Stack = {stack}")
        print(f"Stack value = {stack_value}")
        return address
    else:
        return str(address + 1).zfill(4).upper()
        
def CPE(mnemonic):
    global ret_address, stack_pointer
    global address
    print("-----CPE-----")
    if flag[5] == 1:
        mnemonic = mnemonic.split()
        call_address = mnemonic[1]
        ret_address = str(hex(int(call_address, 16) + 1)[2:]).zfill(4).upper()
        higher_byte, lower_byte = split_address(ret_address)
        if stack == []:
            stack_pointer = "0FFF"
            stack.append(stack_pointer)
            stack_value.append(higher_byte)
            stack_pointer = str(hex(int(stack_pointer, 16) - 1)[2:]).zfill(4).upper()
            stack_value.append(lower_byte)
        elif stack != []:    
            stack.append(stack_pointer)
            stack_value.append(higher_byte)
            stack_pointer = str(hex(int(stack_pointer, 16) - 1)[2:]).zfill(4).upper()
            stack_value.append(lower_byte)
        else:
            print("Stack error: Stack not initialized")    
        address = str(hex(int(call_address, 16))[2:]).zfill(4).upper()
        print(f"Going to {call_address}")
        print(f"Stack pointer = {stack_pointer}")
        print(f"Stack = {stack}")
        print(f"Stack value = {stack_value}")
        return address
    else:
        return str(address + 1).zfill(4).upper()
        
def CPO(mnemonic):
    global ret_address, stack_pointer
    global address
    print("-----CPO-----")
    if flag[5] == 0:
        mnemonic = mnemonic.split()
        call_address = mnemonic[1]
        ret_address = str(hex(int(call_address, 16) + 1)[2:]).zfill(4).upper()
        higher_byte, lower_byte = split_address(ret_address)
        if stack == []:
            stack_pointer = "0FFF"
            stack.append(stack_pointer)
            stack_value.append(higher_byte)
            stack_pointer = str(hex(int(stack_pointer, 16) - 1)[2:]).zfill(4).upper()
            stack_value.append(lower_byte)
        elif stack != []:    
            stack.append(stack_pointer)
            stack_value.append(higher_byte)
            stack_pointer = str(hex(int(stack_pointer, 16) - 1)[2:]).zfill(4).upper()
            stack_value.append(lower_byte)
        else:
            print("Stack error: Stack not initialized")    
        address = str(hex(int(call_address, 16))[2:]).zfill(4).upper()
        print(f"Going to {call_address}")
        print(f"Stack pointer = {stack_pointer}")
        print(f"Stack = {stack}")
        print(f"Stack value = {stack_value}")
        return address
    else:
        return str(address + 1).zfill(4).upper()     
    
def CMA(mnemonic):
    print("-----CMA-----")
    reg_value[0] = hex(0 - int(reg_value[0], 16))
    reg_value[0] = hex(int(reg_value[0], 16) + int("FF", 16))[2:]
    flag[0] = 1
    flag[7] = 1
    reg_value[0] = str(reg_value[0]).zfill(2).upper()
    print(f"[A] = {reg_value[0]}")
    
def CMP(mnemonic):
    print("-----CMP-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    if reg_1 == "M":
        memory_address_M(1)
    if int(reg_value[0], 16) < int(reg_value[reg_1], 16):
        flag[1] = 0
        flag[7] = 1
        print(f"[A] < [{reg_list[reg_1]}]")
    elif int(reg_value[0], 16) == int(reg_value[reg_1], 16):
        flag[1] = 1
        flag[7] = 0
        print(f"[A] = [{reg_list[reg_1]}]")
    elif int(reg_value[0], 16) > int(reg_value[reg_1], 16):
        flag[1] = 0
        flag[7] = 0
        print(f"[A] > [{reg_list[reg_1]}]")
    
def CPI(mnemonic):
    print("-----CPI-----")
    mnemonic = mnemonic.split()
    immediate_value = mnemonic[1]
    if int(reg_value[0], 16) < int(immediate_value, 16):
        flag[1] = 0
        flag[7] = 1
        print(f"[A] < {immediate_value}")
    elif int(reg_value[0], 16) == int(immediate_value, 16):
        flag[1] = 1
        flag[7] = 0
        print(f"[A] = {immediate_value}")
    elif int(reg_value[0], 16) > int(immediate_value, 16):
        flag[1] = 0
        flag[7] = 0
        print(f"[A] > {immediate_value}")
    
def DAD(mnemonic):
    print("-----DAD-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    if reg_1 == "SP":
        pass
    else:    
        reg_1_index = reg_list.index(reg_1)
        reg_2_index = reg_1_index + 1
        reg_value[7] = hex(int(reg_value[7], 16) + int(reg_value[reg_2_index], 16))[2:]
        if int(reg_value[7], 16) > 255:
            check_flag(reg_value[7])
            reg_value[7] = hex(int(reg_value[7], 16) - int("100", 16))[2:]
            reg_value[6] = hex(int(reg_value[6], 16) + int(reg_value[reg_1_index], 16) + 1)[2:]
            if int(reg_value[6], 16) > 255:
                check_flag(reg_value[6])
                reg_value[6] = hex(int(reg_value[6], 16) - int("100", 16))[2:]
        else:
            reg_value[6] = hex(int(reg_value[6], 16) + int(reg_value[reg_1_index], 16))[2:]
            if int(reg_value[6], 16) > 255:
                check_flag(reg_value[6])
                reg_value[6] = hex(int(reg_value[6], 16) - int("100", 16))[2:]
    reg_value[6] = str(reg_value[6]).zfill(2).upper()
    reg_value[7] = str(reg_value[7]).zfill(2).upper()
    print(f"[H] = {reg_value[6]}")
    print(f"[L] = {reg_value[7]}")

def DCR(mnemonic):
    print("-----DCR-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_index = reg_list.index(reg_1)
    if reg_1 == "M":
        memory_address_M(1)
    reg_value[reg_index] = hex(int(reg_value[reg_index], 16) - 1)[2:]
    if reg_1 == "M":
        memory_address_M(0)
    print(f"[{reg_list[reg_index]}] = {reg_value[reg_index]}")
    check_flag(reg_value[reg_index])
    reg_value[reg_index] = str(reg_value[reg_index]).zfill(2).upper()
    
def DCX(mnemonic):
    print("-----DCX-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1_index = reg_list.index(reg_1)
    reg_2_index = reg_1_index + 1
    if int(reg_value[reg_2_index], 16) == 0:
        reg_value[reg_1_index] = hex(int(reg_value[reg_1_index], 16) - int("1", 16))[2:]
        reg_value[reg_2_index] = hex(255)[2:]
    else:
        reg_value[reg_2_index] = hex(int(reg_value[reg_2_index], 16) - int("1", 16))[2:]
    reg_value[reg_1_index] = str(reg_value[reg_1_index]).zfill(2).upper()
    reg_value[reg_2_index] = str(reg_value[reg_2_index]).zfill(2).upper()
    print(f"[{reg_list[reg_1_index]}] = {reg_value[reg_1_index]}")
    print(f"[{reg_list[reg_2_index]}] = {reg_value[reg_2_index]}") 
    
def INR(mnemonic):
    print("-----INR-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_index = reg_list.index(reg_1)
    if reg_1 == "M":
        memory_address_M(1)
    reg_value[reg_index] = hex(int(reg_value[reg_index], 16) + 1)[2:]
    if reg_1 == "M":
        memory_address_M(0)
    print(f"[{reg_list[reg_index]}] = {reg_value[reg_index]}")    
    check_flag(reg_value[reg_index])
    reg_value[reg_index] = str(reg_value[reg_index]).zfill(2).upper()
    
def INX(mnemonic):
    print("-----INX-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1_index = reg_list.index(reg_1)
    reg_2_index = reg_1_index + 1
    if int(reg_value[reg_2_index], 16)  == 255:
        reg_value[reg_1_index] = hex(int(reg_value[reg_1_index], 16) + int("1", 16))[2:]
        reg_value[reg_2_index] = str("00").zfill(1)
    else:
        reg_value[reg_2_index] = hex(int(reg_value[reg_2_index], 16) + int("1", 16))[2:]
    reg_value[reg_1_index] = str(reg_value[reg_1_index]).zfill(2).upper()
    reg_value[reg_2_index] = str(reg_value[reg_2_index]).zfill(2).upper()
    if reg_1 == "H":
         M = str(reg_value[6]) + str(reg_value[7])
         reg_value[8] = str(memory_location_value[int(M, 16)]).zfill(2).upper()
    print(f"[{reg_list[reg_1_index]}] = {reg_value[reg_1_index]}") 
    print(f"[{reg_list[reg_2_index]}] = {reg_value[reg_2_index]}") 
        
def JMP(mnemonic):
    print("-----JMP-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    print(f"Jumping to {jmp_address}")
    return jmp_address
    
def JP(mnemonic):
    print("-----JP-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    if flag[0] == 0:
        print(f"Jumping to {jmp_address}")
        return None, jmp_address
    elif flag[0] == 1:
        print("No jumping!")
        bit = "no jump"
        return bit, None 

def JM(mnemonic):
    print("-----JM-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    if flag[0] == 1:
        print(f"Jumping to {jmp_address}")
        return None, jmp_address
    elif flag[0] == 0:
        print("No jumping!")
        bit = "no jump"
        return bit, None

def JPE(mnemonic):
    print("-----JPE-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    if flag[5] == 1:
        print(f"Jumping to {jmp_address}")
        return None, jmp_address
    elif flag[5] == 0:
        print("No jumping!")
        bit = "no jump"
        return bit, None

def JPO(mnemonic):
    print("-----JPO-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    if flag[5] == 0:
        print(f"Jumping to {jmp_address}")
        return None, jmp_address
    elif flag[5] == 1:
        print("No jumping!")
        bit = "no jump"
        return bit, None
    
def JC(mnemonic):
    print("-----JC-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    if flag[7] == 1:
        print(f"Jumping to {jmp_address}")
        return None, jmp_address
    elif flag[7] == 0:
        print("No jumping!")
        bit = "no jump"
        return bit, None    
    
def JNC(mnemonic):
    print("-----JNC-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    if flag[7] == 0:
        print(f"Jumping to {jmp_address}")
        return None, jmp_address
    elif flag[7] == 1:
        print("No jumping!")
        bit = "no jump"
        return bit, None
    
def JZ(mnemonic):
    print("-----JZ-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    if flag[1] == 1:
        print(f"Jumping to {jmp_address}")
        return None, jmp_address
    elif flag[1] == 0:
        print("No jumping!")
        bit = "no jump"
        return bit, None   
    
def JNZ(mnemonic):
    print("-----JNZ-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    if flag[1] == 0:
        print(f"Jumping to {jmp_address}")
        return None, jmp_address
    elif flag[1] == 1:
        print("No jumping!")
        bit = "no jump"
        return bit, None
        
def LDA(mnemonic):
    print("-----LDA-----")
    mnemonic = mnemonic.split()
    address = mnemonic[1]
    reg_value[0] = str(hex(int(memory_location_value[int(address, 16)], 16))[2:]).zfill(4).upper()
    print(f"[{address}] = {memory_location_value[address_index]}")
    print(f"[A] = {reg_value[0]}")
    
def LDAX(mnemonic):
    print("-----LDAX-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    higher_byte = str(reg_value[reg_1]).zfill(2).upper()
    reg_2 = reg_1 + 1
    lower_byte = str(reg_value[reg_2]).zfill(2).upper()
    address = higher_byte + lower_byte
    reg_value[0] = str(memory_location_value[int(address, 16)]).zfill(2).upper()
    print(f"[{reg_list[reg_1]}] = {reg_value[reg_1]}")
    print(f"[{reg_list[reg_2]}] = {reg_value[reg_2]}")
    print(f"[{address}] = {memory_location_value[address_index]}")
    print(f"[A] = {reg_value[0]}")    
    
def LXI(mnemonic):
    print("-----LXI-----")
    global stack_pointer
    mnemonic = mnemonic.split()
    operand = mnemonic[1].split(",")
    higher_byte, lower_byte = split_address(operand[1])
    if operand[0] == "B" or operand[0] == "D" or operand[0] == "H":
        reg_1 = reg_list.index(operand[0])
        reg_value[reg_1] = str(hex(int(higher_byte, 16))[2:]).zfill(2).upper()
        reg_2 = reg_1 + 1
        reg_value[reg_2] = str(hex(int(lower_byte, 16))[2:]).zfill(2).upper()
        print(f"Address = {operand[1]}")
        print(f"[{reg_list[reg_1]}] = {reg_value[reg_1]}")
        print(f"[{reg_list[reg_2]}] = {reg_value[reg_2]}")
    elif operand[0] == "SP":
        stack[0] = str(operand[1]).zfill(4).upper()
    else:
        print("Register invalid")
    if operand[0] == "H":
        reg_value[8] = str(memory_location_value[int(operand[1], 16)]).zfill(2).upper()
        print(f"[M] = [{operand[1]}] = {reg_value[8]}")
        
def LHLD(mnemonic):
    print("-----LHLD-----")
    mnemonic = mnemonic.split()
    address = mnemonic[1]
    reg_value[7] = str(memory_location_value[int(address, 16)]).zfill(2).upper()
    address += 1
    reg_value[6] = str(memory_location_value[int(address, 16)]).zfill(2).upper()
    print(f"[{address}] = {memory_location_value[int(address, 16)]}")
    print(f"[H] = {reg_value[6]}")
    print(f"[L] = {reg_value[7]}")
    
def SHLD(mnemonic):
    print("-----SHLD-----")
    mnemonic = mnemonic.split()
    address = mnemonic[1]
    memory_location_value[int(address, 16)] = str(reg_value[7]).zfill(2).upper()
    address += 1
    memory_location_value[int(address, 16)] = str(reg_value[6]).zfill(2).upper()
    print(f"[H] = {reg_value[6]}")
    print(f"[L] = {reg_value[7]}")
    print(f"[{address}] = {memory_location_value[int(address, 16)]}")
    
def MOV(mnemonic):
    print("-----MOV-----")
    mnemonic = mnemonic.split()
    mnemonic = mnemonic[1].split(",")
    reg_1 = mnemonic[0]
    reg_2 = mnemonic[1]
    if reg_2 == "M":
        memory_address_M(1)
    reg_1_index = reg_list.index(reg_1)
    reg_2_index = reg_list.index(reg_2)
    reg_value[reg_1_index] = reg_value[reg_2_index]
    if reg_1 == "M":
        memory_address_M(0)
    print(f"[{reg_list[reg_2_index]}] = {reg_value[reg_2_index]}")
    print(f"[{reg_list[reg_1_index]}] = {reg_value[reg_1_index]}")

def MVI(mnemonic, address_location_list=None, address_value_list=None):
    print("-----MVI-----")
    mnemonic = mnemonic.split()
    operand = mnemonic[1].split(",")
    reg_1 = reg_list.index(operand[0])
    if reg_1 == "M":
        memory_address_M(0)
    reg_value[reg_1] = str(hex(int(operand[1], 16))[2:]).zfill(2).upper()
    print(f"[{reg_list[reg_1]}] = {reg_value[reg_1]}")
        
def ORA(mnemonic):
    print("-----ORA-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    if reg_1 == "M":
        memory_address_M(1)
    reg_value[0] = hex(int(reg_value[0], 16) | int(reg_value[reg_1], 16))[2:]
    print(f"[A] = {reg_value[0]}")
    check_accumulator()
    reg_value[0] = str(reg_value[0]).zfill(2).upper()
    
def ORI(mnemonic):
    print("-----ORI-----")
    mnemonic = mnemonic.split()
    immediate_value = mnemonic[1]
    if len(str(immediate_value)) == 2:
        reg_value[0] = hex(int(str(reg_value[0]), 16) | int(str(immediate_value), 16))[2:]
    else:
        print("Invalid value: Expected value is one byte hexadecimal value")
    print(f"[A] = {reg_value[0]}")
    check_accumulator()
    reg_value[0] = str(reg_value[0]).zfill(2).upper()

def PUSH(mnemonic):
    global stack, stack_pointer, stack_value
    print("-----PUSH-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    if reg_1 == "PSW":
        higher_byte = str(reg_value[0]).zfill(2).upper()
        stack_value.append(higher_byte)
        lower_byte = ''.join([str(elem) for elem in reg_value[1]])
        lower_byte = str(hex(int(lower_byte, 2))[2:]).zfill(2).upper()
        stack_pointer = str(hex(int(stack_pointer, 16) - 1)[2:]).zfill(4).upper()
        stack.append(stack_pointer)
        stack_value.append(lower_byte)
        stack_pointer = str(hex(int(stack_pointer, 16) - 1)[2:]).zfill(4).upper()
        print(f"Higher byte = [A] = {higher_byte}")
        print(f"Lower byte = flag = {lower_byte}")
    else:    
        reg_1 = reg_list.index(reg_1)
        higher_byte = str(reg_value[reg_1]).zfill(2).upper()
        reg_2 = reg_1 + 1
        lower_byte = str(reg_value[reg_2]).zfill(2).upper()
        stack_value.append(higher_byte)
        stack_pointer = str(hex(int(stack_pointer, 16) - 1)[2:]).zfill(4).upper()
        stack.append(stack_pointer)
        stack_value.append(lower_byte)
        stack_pointer = str(hex(int(stack_pointer, 16) - 1)[2:]).zfill(4).upper()
        print(f"Higher byte = [{reg_list[reg_1]}] = {higher_byte}")
        print(f"Lower byte = [{reg_list[reg_2]}] = {lower_byte}")
    print(f"Stack pointer = {stack_pointer}")
    print(f"Stack = {stack}")
    print(f"Stack value = {stack_value}")
    
def POP(mnemonic):
    global stack, stack_pointer, stack_value 
    print("-----POP-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    if reg_1 == "PSW":
        lower_byte = str(stack_value.pop()).zfill(2).upper()
        flag = bin(int(lower_byte, 16))[2:]
        flag = flag.zfill(8)
        stack.pop()
        print(f"Flag_binary = {flag}")
        reg_value[1] = [i for i in flag]
        print(f"Flag = {reg_value[1]}")
        stack_pointer = str(hex(int(str(stack_pointer), 16) + 1)[2:]).zfill(4).upper()
        reg_value[0] = str(stack_value.pop()).zfill(2).upper() # higher_byte
        stack_pointer = str(hex(int(str(stack_pointer), 16) + 1)[2:]).zfill(4).upper()
        print(f"Higher byte = [A] = {higher_byte}")
        print(f"Lower byte = flag = {lower_byte}")
    else:    
        reg_1 = reg_list.index(reg_1)
        reg_2 = reg_1 + 1
        reg_value[reg_2] = str(stack_value.pop()).zfill(2).upper() # lower_byte
        stack.pop()
        stack_pointer = str(hex(int(str(stack_pointer), 16) + 1)[2:]).zfill(4).upper()
        reg_value[reg_1] = str(stack_value.pop()).zfill(2).upper() # higher_byte
        stack_pointer = str(hex(int(str(stack_pointer), 16) + 1)[2:]).zfill(4).upper()
        print(f"Higher byte = [{reg_list[reg_1]}] = {reg_value[reg_1]}") # higher_byte
        print(f"Lower byte = [{reg_list[reg_2]}] = {reg_value[reg_2]}") # lower_byte
    print(f"Stack pointer = {stack_pointer}")
    print(f"Stack = {stack}")
    print(f"Stack value = {stack_value}")    

def RET(mnemonic):
    global ret_address, stack, stack_pointer, stack_value 
    print("-----RET-----")
    lower_byte = str(stack_value.pop()).zfill(2).upper()
    stack_pointer = str(hex(int(str(stack_pointer), 16) + 1)[2:]).zfill(4).upper()
    higher_byte = str(stack_value.pop()).zfill(2).upper()
    ret_address = str(higher_byte + lower_byte).zfill(4).upper()
    print(f"Returning to {ret_address}")
    
def RC(mnemonic):
    global ret_address, stack, stack_pointer, stack_value 
    print("-----RC-----")
    if flag[7] == 1:
        lower_byte = str(stack_value.pop()).zfill(2).upper()
        stack_pointer = str(hex(int(str(stack_pointer), 16) + 1)[2:]).zfill(4).upper()
        higher_byte = str(stack_value.pop()).zfill(2).upper()
        ret_address = str(higher_byte + lower_byte).zfill(4).upper()
        print(f"Returning to {ret_address}")
        return_value = True
    else:
        return_value = False
    return return_value    
        
def RNC(mnemonic):
    global ret_address, stack, stack_pointer, stack_value 
    print("-----RNC-----")
    if flag[7] == 0:
        lower_byte = str(stack_value.pop()).zfill(2).upper()
        stack_pointer = str(hex(int(str(stack_pointer), 16) + 1)[2:]).zfill(4).upper()
        higher_byte = str(stack_value.pop()).zfill(2).upper()
        ret_address = str(higher_byte + lower_byte).zfill(4).upper()
        print(f"Returning to {ret_address}")
        return_value = True
    else:
        return_value = False
    return return_value    
        
def RP(mnemonic):
    global ret_address, stack, stack_pointer, stack_value 
    print("-----RP-----")
    if flag[0] == 0:
        lower_byte = str(stack_value.pop()).zfill(2).upper()
        stack_pointer = str(hex(int(str(stack_pointer), 16) + 1)[2:]).zfill(4).upper()
        higher_byte = str(stack_value.pop()).zfill(2).upper()
        ret_address = str(higher_byte + lower_byte).zfill(4).upper()
        print(f"Returning to {ret_address}")
        return_value = True
    else:
        return_value = False
    return return_value    
        
def RM(mnemonic):
    global ret_address, stack, stack_pointer, stack_value 
    print("-----RM-----")
    if flag[0] == 1:
        lower_byte = str(stack_value.pop()).zfill(2).upper()
        stack_pointer = str(hex(int(str(stack_pointer), 16) + 1)[2:]).zfill(4).upper()
        higher_byte = str(stack_value.pop()).zfill(2).upper()
        ret_address = str(higher_byte + lower_byte).zfill(4).upper()
        print(f"Returning to {ret_address}")
        return_value = True
    else:
        return_value = False
    return return_value    
        
def RPE(mnemonic):
    global ret_address, stack, stack_pointer, stack_value 
    print("-----RPE-----")
    if flag[5] == 1:
        lower_byte = str(stack_value.pop()).zfill(2).upper()
        stack_pointer = str(hex(int(str(stack_pointer), 16) + 1)[2:]).zfill(4).upper()
        higher_byte = str(stack_value.pop()).zfill(2).upper()
        ret_address = str(higher_byte + lower_byte).zfill(4).upper()
        print(f"Returning to {ret_address}")
        return_value = True
    else:
        return_value = False
    return return_value    
        
def RPO(mnemonic):
    global ret_address, stack, stack_pointer, stack_value 
    print("-----RPO-----")
    if flag[5] == 0:
        lower_byte = str(stack_value.pop()).zfill(2).upper()
        stack_pointer = str(hex(int(str(stack_pointer), 16) + 1)[2:]).zfill(4).upper()
        higher_byte = str(stack_value.pop()).zfill(2).upper()
        ret_address = str(higher_byte + lower_byte).zfill(4).upper()
        print(f"Returning to {ret_address}")
        return_value = True
    else:
        return_value = False
    return return_value    
        
def RZ(mnemonic):
    global ret_address, stack, stack_pointer, stack_value 
    print("-----RZ-----")
    if flag[1] == 1:
        lower_byte = str(stack_value.pop()).zfill(2).upper()
        stack_pointer = str(hex(int(str(stack_pointer), 16) + 1)[2:]).zfill(4).upper()
        higher_byte = str(stack_value.pop()).zfill(2).upper()
        ret_address = str(higher_byte + lower_byte).zfill(4).upper()
        print(f"Returning to {ret_address}")
        return_value = True
    else:
        return_value = False
    return return_value    
        
def RNZ(mnemonic):
    global ret_address, stack, stack_pointer, stack_value 
    print("-----RNZ-----")
    if flag[1] == 0:
        lower_byte = str(stack_value.pop()).zfill(2).upper()
        stack_pointer = str(hex(int(str(stack_pointer), 16) + 1)[2:]).zfill(4).upper()
        higher_byte = str(stack_value.pop()).zfill(2).upper()
        ret_address = str(higher_byte + lower_byte).zfill(4).upper()
        print(f"Returning to {ret_address}")
        return_value = True
    else:
        return_value = False
    return return_value                                                       
    
def RLC(mnemonic):
    print("-----RLC-----")
    reg_value[0] = int(reg_value[0], 16) << 1
    reg_value[0] = str(hex(reg_value[0])[2:]).zfill(2).upper()
    print(f"[A] = {reg_value[0]}")
    
def RRC(instruction):
    print("-----RRC-----")
    reg_value[0] = int(reg_value[0], 16) >> 1
    reg_value[0] = str(hex(reg_value[0])[2:]).zfill(2).upper()
    print(f"[A] = {reg_value[0]}")          

def STA(mnemonic):
    print("-----STA-----")
    mnemonic = mnemonic.split()
    address = mnemonic[1]
    memory_location_value[int(address, 16)] = str(reg_value[0]).zfill(2).upper()
    print(f"[A] = {reg_value[0]}")    
    print(f"[{address}] = {memory_location_value[int(address, 16)]}")

def STAX(mnemonic):
    print("-----STAX-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    higher_byte = str(reg_value[reg_1]).zfill(2).upper()
    reg_2 = reg_1 + 1
    lower_byte = str(reg_value[reg_2]).zfill(2).upper()
    address = str(higher_byte) + str(lower_byte)
    memory_location_value[int(address, 16)] = reg_value[0]
    print(f"[A] = {reg_value[0]}")
    print(f"[{reg_list[reg_1]}] = {reg_value[reg_1]}")
    print(f"[{reg_list[reg_2]}] = {reg_value[reg_2]}")
    print(f"[{address}] = {memory_location_value[int(address, 16)]}")
    
def SUB(mnemonic):
    print("-----SUB-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1_index = reg_list.index(reg_1)
    if reg_1 == "M":
        memory_address_M(1)
    if int(reg_value[0], 16) > int(reg_value[reg_1_index], 16):    
        reg_value[0] = hex(int(reg_value[0], 16) - int(reg_value[reg_1_index], 16))[2:]
    elif int(reg_value[0], 16) == int(reg_value[reg_1_index], 16):    
        reg_value[0] = hex(0)[2:]
        flag[1] = 1
    elif int(reg_value[0], 16) < int(reg_value[reg_1_index], 16):
        reg_value[0] = hex(int(reg_value[0], 16) - int(reg_value[reg_1_index], 16))
        reg_value[0] = hex(int(reg_value[0], 16) + int("100", 16))[2:]
        flag[0] = 1
        flag[7] = 1
    reg_value[0] = str(reg_value[0]).zfill(2).upper()
    print(f"[A] = {reg_value[0]}")
    print(flag)
    
def SUI(mnemonic):
    print("-----SUI-----")
    mnemonic = mnemonic.split()
    immediate_value = mnemonic[1]
    if len(str(immediate_value)) == 2:
        if int(reg_value[0], 16) > int(str(immediate_value), 16):
            reg_value[0] = hex(int(reg_value[0], 16) - int(str(immediate_value), 16))[2:]
        elif int(reg_value[0], 16) == int(str(immediate_value), 16):
            reg_value[0] = hex(0)[2:]
            flag[1] = 1
        elif int(reg_value[0], 16) < int(str(immediate_value), 16):
            reg_value[0] = hex(int(reg_value[0], 16) - int(str(immediate_value), 16))
            reg_value[0] = hex(int(reg_value[0], 16) + int("100", 16))[2:]
            flag[0] = 1
            flag[7] = 1
    else:
        print("Invalid value: Expected value is one byte hexadecimal value")
    reg_value[0] = str(reg_value[0]).zfill(2).upper()    
    print(f"[A] = {reg_value[0]}")

def XCHG(mnemonic):
    print("-----XCHG-----")
    print("Before: ")
    print(f"[H] = {reg_value[6]}")
    print(f"[L] = {reg_value[7]}")
    print(f"[D] = {reg_value[4]}")
    print(f"[E] = {reg_value[5]}")
    reg_H = reg_value[6]
    reg_L = reg_value[7]
    reg_D = reg_value[4]
    reg_E = reg_value[5]
    reg_value[6] = reg_value[4]
    reg_value[7] = reg_value[5]
    reg_value[4] = reg_H
    reg_value[5] = reg_L
    reg_value[4] = str(reg_value[4]).zfill(2).upper()
    reg_value[5] = str(reg_value[5]).zfill(2).upper()
    reg_value[6] = str(reg_value[6]).zfill(2).upper()
    reg_value[7] = str(reg_value[7]).zfill(2).upper()
    print("After: ")
    print(f"[H] = {reg_value[6]}")
    print(f"[L] = {reg_value[7]}")
    print(f"[D] = {reg_value[4]}")
    print(f"[E] = {reg_value[5]}")
    
def XRA(mnemonic):
    print("-----XRA-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    if reg_1 == "M":
        memory_address_M(1)
    reg_value[0] = hex(int(reg_value[0], 16) ^ int(reg_value[reg_1], 16))[2:]
    print(f"[A] = {reg_value[0]}")
    check_accumulator()
    reg_value[0] = str(reg_value[0]).zfill(2).upper()
    
def XRI(mnemonic):
    print("-----XRI-----")
    mnemonic = mnemonic.split()
    immediate_value = mnemonic[1]
    if len(str(immediate_value)) == 2:
        reg_value[0] = hex(int(str(reg_value[0]), 16) ^ int(str(immediate_value), 16))[2:]
    else:
        print("Invalid value: Expected value is one byte hexadecimal value")
    print(f"[A] = {reg_value[0]}")
    check_accumulator()
    reg_value[0] = str(reg_value[0]).zfill(2).upper() 
    
def check_accumulator():
    print(f"Checking Accumulator...")
    if int(reg_value[0], 16) == 0:
        flag[1] = 1
    elif int(reg_value[0], 16) != 0:
        flag[1] = 0
    if int(reg_value[0], 16) > 255:
        flag[7] = 1
    elif int(reg_value[0], 16) <= 255:
        flag[7] = 0
    print(f"Flag = {flag}")
    
def check_flag(reg_name):
    print(f"Checking Flag...")
    if int(reg_name, 16) == 0:
        flag[1] = 1
    elif int(reg_name, 16) != 0:
        flag[1] = 0
    if int(reg_name, 16) > 255:
        flag[7] = 1
    elif int(reg_name, 16) <= 255:
        flag[7] = 0
    print(f"Flag = {flag}")
        
def split_address(address):
    # print("-----Split Address-----")
    higher_byte = str(address[0:len(address)//2]).zfill(2).upper()
    lower_byte = str(address[len(address)//2 if len(address)%2 == 0 else ((len(address)//2)+1):]).zfill(2).upper()
    return higher_byte, lower_byte

def byte_8085(mnemonic):
    global one_byte
    global two_byte
    global three_byte
    t = 0
    mnemonic = mnemonic.split()
    opcode = mnemonic[0]
    one_byte = ["MOV", "ADD", "CMP", "CMA", "INR", "INX", "DCR", "DCX", "DAD", "LDAX", "STAX", "HLT", "SUB", "XCHG", "ANA", "ORA", "XRA", "RRC", "RLC", "RET", "RC", "RNC", "RP", "RM", "RPE", "RPO", "RZ", "RNZ", "PUSH", "POP", "NOP"]
    two_byte = ["MVI", "ADI", "ANI", "ORI", "XRI", "ACI", "SUI", "CPI"]
    three_byte = ["LDA", "LXI", "STA", "JMP", "CALL", "CC", "CNC", "CP", "CM", "CPE", "CPO", "CZ", "CNZ", "LHLD", "SHLD", "JC", "JNC", "JZ", "JNZ", "JP", "JM", "JPE", "JPO"]
    if opcode in one_byte:
        t = 1
        return t
    elif opcode in two_byte:
        t = 2
        return t
    elif opcode in three_byte:
        t = 3
        return t
    else:
        print("Syntax Error")
        t = "error"
        return t

def memory_8085():
    global memory_location_value
    print("-----MEMORY VIEW/EDIT-----")
    print("If you want to change the value, type the desired value. Otherwise hit enter.")
    address_location = str(input("Enter address: ")).zfill(4).upper()
    while True:
        address_value = input(f"{address_location}: {memory_location_value[int(address_location, 16)]} ")
        if address_value == "EXIT":
            break
        elif len(address_value) == 2 :
            memory_location_value[int(address_location, 16)] = str(address_value).upper()
        elif len(address_value) == 0:
            address_value = memory_location_value[int(address_location, 16)]
        elif len(address_value) > 2:
            print("Invalid value: 2-byte hexadecimal value expected")
        address_location = str(hex(int(address_location, 16) + 1)[2:]).zfill(4).upper()
    
def instruction_decoder(mnemonic):
    instruction  = mnemonic.split()[0]
    one_byte_list = ["MOV", "ADD", "CMP", "CMA", "INR", "INX", "DCR", "DCX", "DAD", "LDAX", "STAX", "HLT", "SUB", "XCHG", "ANA", "ORA", "XRA", "RRC", "RLC", "RET", "RC", "RNC", "RP", "RM", "RPE", "RPO", "RZ", "RNZ", "PUSH", "POP", "NOP"]
    two_byte_list_1 = ["ADI", "ORI", "ACI", "SUI", "CPI", "ANI", "ORI", "XRI"]
    two_byte_list_2 = ["MVI"]
    three_byte_list_1 = ["LDA", "STA", "JMP", "CALL", "CC", "CNC", "CP", "CM", "CPE", "CPO", "CZ", "CNZ", "LHLD", "SHLD", "JC", "JNC", "JZ", "JNZ", "JP", "JM", "JPE", "JPO"]
    three_byte_list_2 = ["LXI"]
    if instruction in one_byte_list:
        byte = "ONE"
        if mnemonic == "ADD A":
            machine_code = "87"
        elif mnemonic == "ADD B":
            machine_code = "80"
        elif mnemonic == "ADD C":
            machine_code = "81"
        elif mnemonic == "ADD D":
            machine_code = "82"
        elif mnemonic == "ADD E":
            machine_code = "83"
        elif mnemonic == "ADD H":
            machine_code = "84"
        elif mnemonic == "ADD L":
            machine_code = "85"
        elif mnemonic == "ADD M":
            machine_code = "86"
        elif mnemonic == "ANA A":
            machine_code = "A7"
        elif mnemonic == "ANA B":
            machine_code = "A0"
        elif mnemonic == "ANA C":
            machine_code = "A1"
        elif mnemonic == "ANA D":
            machine_code = "A2"
        elif mnemonic == "ANA E":
            machine_code = "A3"
        elif mnemonic == "ANA H":
            machine_code = "A4"
        elif mnemonic == "ANA L":
            machine_code = "A5"
        elif mnemonic == "ANA M":
            machine_code = "A6"
        elif mnemonic == "CMA":
            machine_code = "2F"
        elif mnemonic == "CMP A":
            machine_code = "BF"
        elif mnemonic == "CMP B":
            machine_code = "B8"
        elif mnemonic == "CMP C":
            machine_code = "B9"
        elif mnemonic == "CMP D":
            machine_code = "BA"
        elif mnemonic == "CMP E":
            machine_code = "BB"
        elif mnemonic == "CMP H":
            machine_code = "BC"
        elif mnemonic == "CMP L":
            machine_code = "BD"
        elif mnemonic == "CMP M":
            machine_code = "BE"
        elif mnemonic == "DAD B":
            machine_code = "09"
        elif mnemonic == "DAD D":
            machine_code = "19"
        elif mnemonic == "DAD H":
            machine_code = "29"
        elif mnemonic == "DAD SP":
            machine_code = "39"
        elif mnemonic == "DCR A":
            machine_code = "3D"
        elif mnemonic == "DCR B":
            machine_code = "05"
        elif mnemonic == "DCR C":
            machine_code = "0D"
        elif mnemonic == "DCR D":
            machine_code = "15"
        elif mnemonic == "DCR E":
            machine_code = "1D"
        elif mnemonic == "DCR H":
            machine_code = "25"
        elif mnemonic == "DCR L":
            machine_code = "2D"
        elif mnemonic == "DCR M":
            machine_code = "35"
        elif mnemonic == "DCX B":
            machine_code = "0B"
        elif mnemonic == "DCX D":
            machine_code = "1B"
        elif mnemonic == "DCX H":
            machine_code = "2B"
        elif mnemonic == "DCX SP":
            machine_code = "3B"
        elif mnemonic == "HLT":
            machine_code = "76"
        elif mnemonic == "INR A":
            machine_code = "3C"
        elif mnemonic == "INR B":
            machine_code = "04"
        elif mnemonic == "INR C":
            machine_code = "0C"
        elif mnemonic == "INR D":
            machine_code = "14"
        elif mnemonic == "INR E":
            machine_code = "1C"
        elif mnemonic == "INR H":
            machine_code = "24"
        elif mnemonic == "INR L":
            machine_code = "2C"
        elif mnemonic == "INR M":
            machine_code = "34"
        elif mnemonic == "INX B":
            machine_code = "03"
        elif mnemonic == "INX D":
            machine_code = "13"
        elif mnemonic == "INX H":
            machine_code = "23"
        elif mnemonic == "INX M":
            machine_code = "33"
        elif mnemonic == "LDAX B":
            machine_code = "0A" 
        elif mnemonic == "LDAX D":
            machine_code = "1A"
        elif mnemonic == "MOV A,A":
            machine_code = "7F"
        elif mnemonic == "MOV A,B":
            machine_code = "78"
        elif mnemonic == "MOV A,C":
            machine_code = "79"
        elif mnemonic == "MOV A,D":
            machine_code = "7A"
        elif mnemonic == "MOV A,E":
            machine_code = "7B"
        elif mnemonic == "MOV A,H":
            machine_code = "7C"
        elif mnemonic == "MOV A,L":
            machine_code = "7D"
        elif mnemonic == "MOV A,M":
            machine_code = "7E"
        elif mnemonic == "MOV B,A":
            machine_code = "47"
        elif mnemonic == "MOV B,B":
            machine_code = "40"
        elif mnemonic == "MOV B,C":
            machine_code = "41"
        elif mnemonic == "MOV B,D":
            machine_code = "42"
        elif mnemonic == "MOV B,E":
            machine_code = "43"
        elif mnemonic == "MOV B,H":
            machine_code = "44"
        elif mnemonic == "MOV B,L":
            machine_code = "45"
        elif mnemonic == "MOV B,M":
            machine_code = "46"
        elif mnemonic == "MOV C,A":
            machine_code = "4F"
        elif mnemonic == "MOV C,B":
            machine_code = "48"
        elif mnemonic == "MOV C,C":
            machine_code = "49"
        elif mnemonic == "MOV C,D":
            machine_code = "4A"
        elif mnemonic == "MOV C,E":
            machine_code = "4B"
        elif mnemonic == "MOV C,H":
            machine_code = "4C"
        elif mnemonic == "MOV C,L":
            machine_code = "4D"
        elif mnemonic == "MOV C,M":
            machine_code = "4E"
        elif mnemonic == "MOV D,A":
            machine_code = "57"
        elif mnemonic == "MOV D,B":
            machine_code = "50"
        elif mnemonic == "MOV D,C":
            machine_code = "51"
        elif mnemonic == "MOV D,D":
            machine_code = "52"
        elif mnemonic == "MOV D,E":
            machine_code = "53"
        elif mnemonic == "MOV D,H":
            machine_code = "54"
        elif mnemonic == "MOV D,L":
            machine_code = "55"
        elif mnemonic == "MOV D,M":
            machine_code = "56"
        elif mnemonic == "MOV E,A":
            machine_code = "5F"
        elif mnemonic == "MOV E,B":
            machine_code = "58"
        elif mnemonic == "MOV E,C":
            machine_code = "59"
        elif mnemonic == "MOV E,D":
            machine_code = "5A"
        elif mnemonic == "MOV E,E":
            machine_code = "5B"
        elif mnemonic == "MOV E,H":
            machine_code = "5C"
        elif mnemonic == "MOV E,L":
            machine_code = "5D"
        elif mnemonic == "MOV E,M":
            machine_code = "5E"
        elif mnemonic == "MOV H,A":
            machine_code = "67"
        elif mnemonic == "MOV H,B":
            machine_code = "60"
        elif mnemonic == "MOV H,C":
            machine_code = "61"
        elif mnemonic == "MOV H,D":
            machine_code = "62"
        elif mnemonic == "MOV H,E":
            machine_code = "63"
        elif mnemonic == "MOV H,H":
            machine_code = "64"
        elif mnemonic == "MOV H,L":
            machine_code = "65"
        elif mnemonic == "MOV H,M":
            machine_code = "66"
        elif mnemonic == "MOV L,A":
            machine_code = "6F"
        elif mnemonic == "MOV L,B":
            machine_code = "68"
        elif mnemonic == "MOV L,C":
            machine_code = "69"
        elif mnemonic == "MOV L,D":
            machine_code = "6A"
        elif mnemonic == "MOV L,E":
            machine_code = "6B"
        elif mnemonic == "MOV L,H":
            machine_code = "6C"
        elif mnemonic == "MOV L,L":
            machine_code = "6D"
        elif mnemonic == "MOV L,M":
            machine_code = "6E"
        elif mnemonic == "MOV M,A":
            machine_code = "77"
        elif mnemonic == "MOV M,B":
            machine_code = "70"
        elif mnemonic == "MOV M,C":
            machine_code = "71"
        elif mnemonic == "MOV M,D":
            machine_code = "72"
        elif mnemonic == "MOV M,E":
            machine_code = "73"
        elif mnemonic == "MOV M,H":
            machine_code = "74"
        elif mnemonic == "MOV M,L":
            machine_code = "75"
        elif mnemonic == "MOV M,M":
            machine_code = "76"
        elif mnemonic == "NOP":
            machine_code = "00"
        elif mnemonic == "ORA A":
            machine_code = "B7"
        elif mnemonic == "ORA B":
            machine_code = "B0"
        elif mnemonic == "ORA C":
            machine_code = "B1"
        elif mnemonic == "ORA D":
            machine_code = "B2"
        elif mnemonic == "ORA E":
            machine_code = "B3"
        elif mnemonic == "ORA H":
            machine_code = "B4"
        elif mnemonic == "ORA L":
            machine_code = "B5"
        elif mnemonic == "ORA M":
            machine_code = "B6"
        elif mnemonic == "PUSH B":
            machine_code = "C5"
        elif mnemonic == "PUSH D":
            machine_code = "D5"
        elif mnemonic == "PUSH H":
            machine_code = "E5"
        elif mnemonic == "PUSH PSW":
            machine_code = "F5"
        elif mnemonic == "POP B":
            machine_code = "C1"
        elif mnemonic == "POP D":
            machine_code = "D1"
        elif mnemonic == "POP H":
            machine_code = "E1"
        elif mnemonic == "POP PSW":
            machine_code = "F1"        
        elif mnemonic == "RET":
            machine_code = "C9"
        elif mnemonic == "RC":
            machine_code = "D8"
        elif mnemonic == "RNC":
            machine_code = "D0"
        elif mnemonic == "RP":
            machine_code = "F0"
        elif mnemonic == "RM":
            machine_code = "F8"
        elif mnemonic == "RPE":
            machine_code = "E8"
        elif mnemonic == "RPO":
            machine_code = "E0"
        elif mnemonic == "RZ":
            machine_code = "C8"
        elif mnemonic == "RNZ":
            machine_code = "C0"                     
        elif mnemonic == "RLC":
            machine_code = "07"
        elif mnemonic == "RRC":
            machine_code = "0F"
        elif mnemonic == "STAX B":
            machine_code = "02"
        elif mnemonic == "STAX D":
            machine_code = "12"
        elif mnemonic == "SUB A":
            machine_code = "97"
        elif mnemonic == "SUB B":
            machine_code = "90"
        elif mnemonic == "SUB C":
            machine_code = "91"
        elif mnemonic == "SUB D":
            machine_code = "92"
        elif mnemonic == "SUB E":
            machine_code = "93"
        elif mnemonic == "SUB H":
            machine_code = "94"
        elif mnemonic == "SUB L":
            machine_code = "95"
        elif mnemonic == "SUB M":
            machine_code = "96"
        elif mnemonic == "XCHG":
            machine_code = "EB"
        elif mnemonic == "XRA A":
            machine_code = "AF"
        elif mnemonic == "XRA B":
            machine_code = "A8"
        elif mnemonic == "XRA C":
            machine_code = "A9"
        elif mnemonic == "XRA D":
            machine_code = "AA"
        elif mnemonic == "XRA E":
            machine_code = "AB"
        elif mnemonic == "XRA H":
            machine_code = "AC"
        elif mnemonic == "XRA L":
            machine_code = "AD"
        elif mnemonic == "XRA M":
            machine_code = "AE"
        return byte, machine_code, None   
    elif instruction in two_byte_list_1:
        byte = "TWO"
        mnemonic = mnemonic.split()
        opcode = mnemonic[0]
        immediate_value = mnemonic[1]
        if opcode == "ADI":
            machine_code = "C6"
        elif opcode == "ANI":
            machine_code = "E6"
        elif opcode == "CPI":
            machine_code = "FE"
        elif opcode == "ORI":
            machine_code = "F6"
        elif opcode == "SUI":
            machine_code = "D6" 
        elif opcode == "XRI":
            machine_code = "EE"
        return byte, machine_code, immediate_value
    elif instruction in two_byte_list_2:
        byte = "TWO"
        mnemonic = mnemonic.split(",")
        opcode = mnemonic[0]
        immediate_value = mnemonic[1]
        if opcode == "MVI A":
            machine_code = "3E"
        elif opcode == "MVI B":
            machine_code = "06"
        elif opcode == "MVI C":
            machine_code = "0E"
        elif opcode == "MVI D":
            machine_code = "16"
        elif opcode == "MVI E":
            machine_code = "1E"
        elif opcode == "MVI H":
            machine_code = "26"
        elif opcode == "MVI L":
            machine_code = "2E"
        elif opcode == "MVI M":
            machine_code = "36"
        return byte, machine_code, immediate_value   
    elif instruction in three_byte_list_1:
        byte = "THREE"
        mnemonic = mnemonic.split()
        opcode = mnemonic[0]
        memory_location = mnemonic[1]
        if opcode == "CALL":
            machine_code = "CD"
        elif opcode == "CC":
            machine_code = "DC"
        elif opcode == "CNC":
            machine_code = "D4"
        elif opcode == "CP":
            machine_code = "F4"
        elif opcode == "CM":
            machine_code = "FC"
        elif opcode == "CPE":
            machine_code = "EC"
        elif opcode == "CPO":
            machine_code = "E4"
        elif opcode == "CZ":
            machine_code = "CC"
        elif opcode == "CNZ":
            machine_code = "C4"
        elif opcode == "LDA":
            machine_code = "3A"
        elif opcode == "STA":
            machine_code = "32" 
        elif opcode == "JMP":
            machine_code = "C3"
        elif opcode == "JC":
            machine_code = "DA"
        elif opcode == "JNC":
            machine_code = "D2" 
        elif opcode == "JZ":
            machine_code = "CA"
        elif opcode == "JNZ":
            machine_code = "C2" 
        elif opcode == "JP":
            machine_code = "F2"
        elif opcode == "JM":
            machine_code = "FA" 
        elif opcode == "JPE":
            machine_code = "EA"
        elif opcode == "JPO":
            machine_code = "E2"
        elif opcode == "LHLD":
            machine_code = "2A" 
        elif opcode == "SHLD":
            machine_code = "22"
        return byte, machine_code, memory_location
    elif instruction in three_byte_list_2:
        byte = "THREE"
        mnemonic = mnemonic.split(",")
        opcode = mnemonic[0]
        memory_location = mnemonic[1]
        if opcode == "LXI B":
            machine_code = "01"
        elif opcode == "LXI D":
            machine_code = "11"
        elif opcode == "LXI H":
            machine_code = "21"
        elif opcode == "LXI SP":
            machine_code = "31"
        return byte, machine_code, memory_location
    else:
        print("Unknown instruction...")
        byte = "Error"
        return byte, None, None

def MN_to_MC(address, mnemonic):
    global memory_location_value
    byte, machine_code, iv_ml = instruction_decoder(mnemonic) # iv_ml means immediate_value or memory_location
    if byte == "ONE":
        machine_code = str(machine_code).zfill(2).upper()
        address = str(hex(int(address, 16))[2:]).zfill(4).upper()
        memory_location_value[int(address, 16)] = machine_code
        return machine_code, None, None
    elif byte == "TWO":
        machine_code = str(machine_code).zfill(2).upper()
        address = str(hex(int(address, 16))[2:]).zfill(4).upper()
        memory_location_value[int(address, 16)] = machine_code
        immediate_value = str(hex(int(iv_ml, 16))[2:]).zfill(2).upper()
        address = str(hex(int(address, 16) + 1)[2:]).zfill(4).upper()
        memory_location_value[int(address, 16)] = immediate_value
        return machine_code, immediate_value, None
    elif byte == "THREE":
        machine_code = str(machine_code).zfill(2).upper()
        address = str(hex(int(address, 16))[2:]).zfill(4).upper()
        memory_location_value[int(address, 16)] = machine_code
        memory_location = iv_ml
        higher_byte, lower_byte = split_address(memory_location)
        lower_byte = str(hex(int(lower_byte, 16))[2:]).zfill(2).upper()
        higher_byte = str(hex(int(higher_byte, 16))[2:]).zfill(2).upper()
        address = str(hex(int(address, 16) + 1)[2:]).zfill(4).upper()
        memory_location_value[int(address, 16)] = lower_byte
        address = str(hex(int(address, 16) + 1)[2:]).zfill(4).upper()
        memory_location_value[int(address, 16)] = higher_byte
        return machine_code, lower_byte, higher_byte
    elif byte == None:
        return machine_code, None, None

def address_8085():
    print("-----ADDRESS-----")
    global mnemonic
    address = input("Enter address: ")
    address = str(hex(int(address, 16))[2:]).zfill(4).upper()
    while True:
        mnemonic = input(f"{address}: ")
        if mnemonic == "EXIT":
            break
        byte = byte_8085(mnemonic)
        if byte != "error":
            machine_code, next_address_1, next_address_2 = MN_to_MC(address, mnemonic)
        if byte == 1:
            address = str(hex(int(address, 16) + int("1",16))[2:]).zfill(4).upper()
        elif byte == 2:
            address = str(hex(int(address, 16) + int("2",16))[2:]).zfill(4).upper()
        elif byte == 3:
            address = str(hex(int(address, 16) + int("3",16))[2:]).zfill(4).upper()

def instruction_encoder(machine_code):
    one_byte_list = ["00", "80", "81", "82", "83", "84", "85", "86", "87", "AO", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "2F", "B8", "B9", "BA", "BB", "BC", "BD", "BE", "BF", "09", "19", "29", "39", "05", "0D", "15", "1D", "25", "2D", "35", "3D", "0B", "1B", "2B", "3B", "76", "04", "0C", "14", "1C", "24", "2C", "34", "3C", "03", "13", "23", "33", "0A", "1A", "78", "79", "7A", "7B", "7C", "7D", "7E", "7F", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4A", "4B", "4C", "4D", "4E", "4F", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5A", "5B" ,"5C", "5D", "5E", "5F", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6A", "6B", "6C", "6D", "6E", "6F", "70", "71", "72", "73", "74", "75", "76", "77", "07", "0F", "B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "02", "12", "90", "91", "92", "93", "94", "95", "96", "97", "EB", "A8", "A9", "AA", "AB", "AC", "AD", "AE", "AF", "C9", "D8", "F8", "C0", "D0", "F0", "E8", "E0", "C8", "C1", "C5", "D1", "D5", "E1", "E5", "F1", "F5"]
    two_byte_list_1 = ["C6", "D6", "E6", "F6", "EE", "FE"]
    two_byte_list_2 = ["06", "0E", "16", "1E", "26", "2E", "36", "3E"]
    three_byte_list_1 = ["22", "2A", "32", "3A", "C2", "C3", "CA", "CD", "DC", "FC", "D4", "C4", "CC" "F4", "EC", "FE", "E4", "D2", "DA", "E2", "EA", "F2", "FA"]
    three_byte_list_2 = ["01", "11", "21", "31"]
    if machine_code in one_byte_list:
        byte = "ONE"
        if machine_code == "87":
            opcode = "ADD A"
        elif machine_code == "80":
            opcode = "ADD B"
        elif machine_code == "81":
            opcode = "ADD C"
        elif machine_code == "82":
            opcode = "ADD D"
        elif machine_code == "83":
            opcode = "ADD E"
        elif machine_code == "84":
            opcode = "ADD H"
        elif machine_code == "85":
            opcode = "ADD L"
        elif machine_code == "86":
            opcode = "ADD M"
        elif machine_code == "A7":
            opcode = "ANA A"
        elif machine_code == "A0":
            opcode = "ANA B"
        elif machine_code == "A1":
            opcode = "ANA C"
        elif machine_code == "A2":
            opcode = "ANA D"
        elif machine_code == "A3":
            opcode = "ANA E"
        elif machine_code == "A4":
            opcode = "ANA H"
        elif machine_code == "A5":
            opcode = "ANA L"
        elif machine_code == "A6":
            opcode = "ANA M"
        elif machine_code == "2F":
            opcode = "CMA"
        elif machine_code == "BF":
            opcode = "CMP A"
        elif machine_code == "B8":
            opcode = "CMP B"
        elif machine_code == "B9":
            opcode = "CMP C"
        elif machine_code == "BA":
            opcode = "CMP D"
        elif machine_code == "BB":
            opcode = "CMP E"
        elif machine_code == "BC":
            opcode = "CMP H"
        elif machine_code == "BD":
            opcode = "CMP L"
        elif machine_code == "BE":
            opcode = "CMP M"
        elif machine_code == "09":
            opcode = "DAD B"
        elif machine_code == "19":
            opcode = "DAD D"
        elif machine_code == "29":
            opcode = "DAD H"
        elif machine_code == "39":
            opcode = "DAD SP"
        elif machine_code == "3D":
            opcode = "DCR A"
        elif machine_code == "05":
            opcode = "DCR B"
        elif machine_code == "0D":
            opcode = "DCR C"
        elif machine_code == "15":
            opcode = "DCR D"
        elif machine_code == "1D":
            opcode = "DCR E"
        elif machine_code == "25":
            opcode = "DCR H"
        elif machine_code == "2D":
            opcode = "DCR L"
        elif machine_code == "35":
            opcode = "DCR M"
        elif machine_code == "0B":
            opcode = "DCX B"
        elif machine_code == "1B":
            opcode = "DCX D"
        elif machine_code == "2B":
            opcode = "DCX H"
        elif machine_code == "3B":
            opcode = "DCX SP"
        elif machine_code == "76":
            opcode = "HLT"
        elif machine_code == "3C":
            opcode = "INR A"
        elif machine_code == "04":
            opcode = "INR B"
        elif machine_code == "0C":
            opcode = "INR C"
        elif machine_code == "14":
            opcode = "INR D"
        elif machine_code == "1C":
            opcode = "INR E"
        elif machine_code == "24":
            opcode = "INR H"
        elif machine_code == "2C":
            opcode = "INR L"
        elif machine_code == "34":
            opcode = "INR M"
        elif machine_code == "03":
            opcode = "INX B"
        elif machine_code == "13":
            opcode = "INX D"
        elif machine_code == "23":
            opcode = "INX H"
        elif machine_code == "33":
            opcode = "INX M"
        elif machine_code == "0A":
            opcode = "LDAX B"
        elif machine_code == "1A":
            opcode = "LDAX D"
        elif machine_code == "7F":
            opcode = "MOV A,A"
        elif machine_code == "78":
            opcode = "MOV A,B"
        elif machine_code == "79":
            opcode = "MOV A,C"
        elif machine_code == "7A":
            opcode = "MOV A,D"
        elif machine_code == "7B":
            opcode = "MOV A,E"
        elif machine_code == "7C":
            opcode = "MOV A,H"
        elif machine_code == "7D":
            opcode = "MOV A,L"
        elif machine_code == "7E":
            opcode = "MOV A,M"
        elif machine_code == "47":
            opcode = "MOV B,A"
        elif machine_code == "40":
            opcode = "MOV B,B"
        elif machine_code == "41":
            opcode = "MOV B,C"
        elif machine_code == "42":
            opcode = "MOV B,D"
        elif machine_code == "43":
            opcode = "MOV B,E"
        elif machine_code == "44":
            opcode = "MOV B,H"
        elif machine_code == "45":
            opcode = "MOV B,L"
        elif machine_code == "46":
            opcode = "MOV B,M"
        elif machine_code == "4F":
            opcode = "MOV C,A"
        elif machine_code == "48":
            opcode = "MOV C,B"
        elif machine_code == "49":
            opcode = "MOV C,C"
        elif machine_code == "4A":
            opcode = "MOV C,D"
        elif machine_code == "4B":
            opcode = "MOV C,E"
        elif machine_code == "4C":
            opcode = "MOV C,H"
        elif machine_code == "4D":
            opcode = "MOV C,L"
        elif machine_code == "4E":
            opcode = "MOV C,M"
        elif machine_code == "57":
            opcode = "MOV D,A"
        elif machine_code == "50":
            opcode = "MOV D,B"
        elif machine_code == "51":
            opcode = "MOV D,C"
        elif machine_code == "52":
            opcode = "MOV D,D"
        elif machine_code == "53":
            opcode = "MOV D,E"
        elif machine_code == "54":
            opcode = "MOV D,H"
        elif machine_code == "55":
            opcode = "MOV D,L"
        elif machine_code == "56":
            opcode = "MOV D,M"
        elif machine_code == "5F":
            opcode = "MOV E,A"
        elif machine_code == "58":
            opcode = "MOV E,B"
        elif machine_code == "59":
            opcode = "MOV E,C"
        elif machine_code == "5A":
            opcode = "MOV E,D"
        elif machine_code == "5B":
            opcode = "MOV E,E"
        elif machine_code == "5C":
            opcode = "MOV E,H"
        elif machine_code == "5D":
            opcode = "MOV E,L"
        elif machine_code == "5E":
            opcode = "MOV E,M"
        elif machine_code == "67":
            opcode = "MOV H,A"
        elif machine_code == "60":
            opcode = "MOV H,B"
        elif machine_code == "61":
            opcode = "MOV H,C"
        elif machine_code == "62":
            opcode = "MOV H,D"
        elif machine_code == "63":
            opcode = "MOV H,E"
        elif machine_code == "64":
            opcode = "MOV H,H"
        elif machine_code == "65":
            opcode = "MOV H,L"
        elif machine_code == "66":
            opcode = "MOV H,M"
        elif machine_code == "6F":
            opcode = "MOV L,A"
        elif machine_code == "68":
            opcode = "MOV L,B"
        elif machine_code == "69":
            opcode = "MOV L,C"
        elif machine_code == "6A":
            opcode = "MOV L,D"
        elif machine_code == "6B":
            opcode = "MOV L,E"
        elif machine_code == "6C":
            opcode = "MOV L,H"
        elif machine_code == "6D":
            opcode = "MOV L,L"
        elif machine_code == "6E":
            opcode = "MOV L,M"
        elif machine_code == "77":
            opcode = "MOV M,A"
        elif machine_code == "70":
            opcode = "MOV M,B"
        elif machine_code == "71":
            opcode = "MOV M,C"
        elif machine_code == "72":
            opcode = "MOV M,D"
        elif machine_code == "73":
            opcode = "MOV M,E"
        elif machine_code == "74":
            opcode = "MOV M,H"
        elif machine_code == "75":
            opcode = "MOV M,L"
        elif machine_code == "76":
            opcode = "MOV M,M"
        elif machine_code == "00":
            opcode = "NOP"
        elif machine_code == "B7":
            opcode = "ORA A"
        elif machine_code == "B0":
            opcode = "ORA B"
        elif machine_code == "B1":
            opcode = "ORA C"
        elif machine_code == "B2":
            opcode = "ORA D"
        elif machine_code == "B3":
            opcode = "ORA E"
        elif machine_code == "B4":
            opcode = "ORA H"
        elif machine_code == "B5":
            opcode = "ORA L"
        elif machine_code == "B6":
            opcode = "ORA M"
        elif machine_code == "C5":
            opcode = "PUSH B"
        elif machine_code == "D5":
            opcode = "PUSH D"
        elif machine_code == "E5":
            opcode = "PUSH H"
        elif machine_code == "F5":
            opcode = "PUSH PSW"
        elif machine_code == "C1":
            opcode = "POP B"
        elif machine_code == "D1":
            opcode = "POP D"
        elif machine_code == "E1":
            opcode = "POP H"
        elif machine_code == "F1":
            opcode = "POP PSW"    
        elif machine_code == "C9":
            opcode = "RET"
        elif machine_code == "D8":
            opcode = "RC"
        elif machine_code == "D0":
            opcode = "RNC"
        elif machine_code == "F0":
            opcode = "RP"
        elif machine_code == "F8":
            opcode = "RM"
        elif machine_code == "E8":
            opcode = "RPE"
        elif machine_code == "E0":
            opcode = "RPO"
        elif machine_code == "C8":
            opcode = "RZ"
        elif machine_code == "C0":
            opcode = "RNZ"                       
        elif machine_code == "07":
            opcode = "RLC"
        elif machine_code == "0F":
            opcode = "RRC"
        elif machine_code == "02":
            opcode = "STAX B"
        elif machine_code == "12":
            opcode = "STAX D"
        elif machine_code == "97":
            opcode = "SUB A"
        elif machine_code == "90":
            opcode = "SUB B"
        elif machine_code == "91":
            opcode = "SUB C"
        elif machine_code == "92":
            opcode = "SUB D"
        elif machine_code == "93":
            opcode = "SUB E"
        elif machine_code == "94":
            opcode = "SUB H"
        elif machine_code == "95":
            opcode = "SUB L"
        elif machine_code == "96":
            opcode = "SUB M"
        elif machine_code == "EB":
            opcode = "XCHG"
        elif machine_code == "AF":
            opcode = "XRA A"
        elif machine_code =="A8":
            opcode = "XRA B"
        elif machine_code == "A9":
            opcode = "XRA C"
        elif machine_code == "AA":
            opcode = "XRA D"
        elif machine_code == "AB":
            opcode = "XRA E"
        elif machine_code == "AC":
            opcode = "XRA H"
        elif machine_code == "AD":
            opcode = "XRA L"
        elif machine_code == "AE":
            opcode = "XRA M"
        return byte, opcode
    elif machine_code in two_byte_list_1:
        byte = "TWO_1"
        if machine_code == "C6":
            opcode = "ADI"
        elif machine_code == "E6":
            opcode = "ANI"
        elif machine_code == "FE":
            opcode = "CPI"
        elif machine_code == "F6":
            opcode = "ORI"
        elif machine_code == "D6":
            opcode = "SUI"
        elif machine_code == "EE":
            opcode = "XRI"
        return byte, opcode  
    elif machine_code in two_byte_list_2:
        byte = "TWO_2"
        if machine_code == "3E":
            opcode = "MVI A"
        elif machine_code =="06":
            opcode = "MVI B"
        elif machine_code == "0E":
            opcode = "MVI C"
        elif machine_code == "16":
            opcode = "MVI D"
        elif machine_code == "1E":
            opcode = "MVI E"
        elif machine_code == "26":
            opcode = "MVI H"
        elif machine_code == "2E":
            opcode = "MVI L"
        elif machine_code == "36":
            opcode = "MVI M"
        return byte, opcode
    elif machine_code in three_byte_list_1:
        byte = "THREE_1"
        if machine_code == "CD":
            opcode = "CALL"
        elif machine_code == "DC":
            opcode = "CC"
        elif machine_code == "D4":
            opcode = "CNC"
        elif machine_code == "CC":
            opcode = "CZ"
        elif machine_code == "C4":
            opcode = "CNZ"
        elif machine_code == "F4":
            opcode = "CP"
        elif machine_code == "FC":
            opcode = "CM"
        elif machine_code == "EC":
            opcode = "CPE"
        elif machine_code == "E4":
            opcode = "CPO"                    
        elif machine_code == "3A":
            opcode = "LDA"
        elif machine_code == "32":
            opcode = "STA"
        elif machine_code == "C3":
            opcode = "JMP"
        elif machine_code == "DA":
            opcode = "JC"
        elif machine_code == "D2":
            opcode = "JNC"
        elif machine_code == "CA":
            opcode = "JZ"
        elif machine_code == "C2":
            opcode = "JNZ"
        elif machine_code == "F2":
            opcode = "JP"
        elif machine_code == "FA":
            opcode = "JM"
        elif machine_code == "EA":
            opcode = "JPE"
        elif machine_code == "E2":
            opcode = "JPO"
        elif machine_code == "2A":
            opcode = "LHLD"
        elif machine_code == "22":
            opcode = "SHLD"
        return byte, opcode    
    elif machine_code in three_byte_list_2:
        byte = "THREE_2"        
        if machine_code == "01":
            opcode = "LXI B"
        elif machine_code == "11":
            opcode = "LXI D"
        elif machine_code == "21":
            opcode = "LXI H"
        elif machine_code == "31":
            opcode = "LXI SP"
        return byte, opcode
    else:
        byte = None
        opcode = None
        return byte, opcode    

def MC_to_MN(address):
    machine_code = memory_location_value[int(address, 16)]
    machine_code = str(machine_code).zfill(2).upper()
    byte, mnemonic_opcode = instruction_encoder(machine_code) # iv_ml means immediate_value or memory_location
    if byte == "ONE":
        mnemonic = mnemonic_opcode
        print("\n"f"{address}:{mnemonic_opcode}")
        address = str(hex(int(address, 16))[2:]).zfill(4).upper()
    elif byte == "TWO_1":
        address = str(hex(int(address, 16) + 1)[2:]).zfill(4).upper()
        machine_code = memory_location_value[int(address, 16)]
        mnemonic = mnemonic_opcode + " " + str(machine_code).zfill(2)
        print("\n"f"{address}:{mnemonic}")
    elif byte == "TWO_2":
        address = str(hex(int(address, 16) + 1)[2:]).zfill(4).upper()
        machine_code = memory_location_value[int(address, 16)]
        mnemonic = mnemonic_opcode + "," + str(machine_code).zfill(2)
        print("\n"f"{address}:{mnemonic}")
    elif byte == "THREE_1":
        address_1 = address
        address = str(hex(int(address, 16) + 3)[2:]).zfill(4).upper()
        machine_code = memory_location_value[int(address, 16) - 1]
        mnemonic = str(machine_code).zfill(2).upper()
        address = str(hex(int(address, 16) - 1)[2:]).zfill(4).upper()
        machine_code = memory_location_value[int(address, 16) - 1]
        machine_code = str(machine_code).zfill(2).upper()
        mnemonic = mnemonic + machine_code
        mnemonic = str(hex(int(mnemonic, 16))[2:]).zfill(4).upper()
        mnemonic = mnemonic_opcode + " " + mnemonic
        print("\n"f"{address_1}:{mnemonic}")
        address = str(hex(int(address, 16))[2:]).zfill(4).upper()
    elif byte == "THREE_2":
        address_1 = address
        address = str(hex(int(address, 16) + 3)[2:]).zfill(4).upper()
        machine_code = memory_location_value[int(address, 16) - 1]
        mnemonic = str(machine_code).zfill(2).upper()
        address = str(hex(int(address, 16) - 1)[2:]).zfill(4).upper()
        machine_code = memory_location_value[int(address, 16) - 1]
        machine_code = str(machine_code).zfill(2).upper()
        mnemonic = mnemonic + machine_code
        mnemonic = str(hex(int(mnemonic, 16))[2:]).zfill(4).upper()
        mnemonic = mnemonic_opcode + "," + mnemonic
        print("\n"f"{address_1}:{mnemonic}")
        address = str(hex(int(address, 16))[2:]).zfill(4).upper()
    elif byte == None:
        mnemonic = "No Mnemonic"
        address = str(hex(int(address, 16))[2:]).zfill(4).upper()
    return mnemonic, address

def execute_8085():
    global ret_address, address, flag, single_step_active
    address = input("Start address: ")
    address = str(hex(int(address, 16))[2:]).zfill(4).upper()
    if single_step_active == "inactive":
        print("Executing...")
    while True:
        instruction, address = MC_to_MN(address)
        opcode = instruction.split()[0]
        if opcode == "ADD":
            ADD(instruction)
        elif opcode == "ADI":
            ADI(instruction)
        elif opcode == "ANA":
            ANA(instruction)
        elif opcode == "ANI":
            ANI(instruction)
        elif opcode == "CALL":
            address = CALL(instruction)
            address = str(address).zfill(4).upper()
        elif opcode == "CC":
            address = CC(instruction)
            address = str(address).zfill(4).upper()
        elif opcode == "CNC":
            address = CNC(instruction)
            address = str(address).zfill(4).upper()
        elif opcode == "CP":
            address = CP(instruction)
            address = str(address).zfill(4).upper()
        elif opcode == "CM":
            address = CM(instruction)
            address = str(address).zfill(4).upper()
        elif opcode == "CPE":
            address = CPE(instruction)
            address = str(address).zfill(4).upper()
        elif opcode == "CPO":
            address = CPO(instruction)
            address = str(address).zfill(4).upper()
        elif opcode == "CZ":
            address = CZ(instruction)
            address = str(address).zfill(4).upper()
        elif opcode == "CNZ":
            address = CNZ(instruction)
            address = str(address).zfill(4).upper()            
        elif opcode == "CMA":
            CMA(instruction)
        elif opcode == "CMP":
            CMP(instruction)
        elif opcode == "CPI":
            CPI(instruction)                  
        elif opcode == "DCR":
            DCR(instruction)
        elif opcode == "DCX":
            DCX(instruction)
        elif opcode == "DAD":
            DAD(instruction)          
        elif opcode == "INR":
            INR(instruction)
        elif opcode == "INX":
            INX(instruction)        
        elif opcode == "JMP":
            address = JMP(instruction)
            address = str(address).zfill(4).upper()
        elif opcode == "JP":
            address_1 = address
            bit, address = JP(instruction)
            address = str(address).zfill(4).upper()
            if bit == "no jump":
                address = str(hex(int(address_1, 16) + 1)[2:]).zfill(4).upper()
        elif opcode == "JM":
            address_1 = address
            bit, address = JM(instruction)
            address = str(address).zfill(4).upper()
            if bit == "no jump":
                address = str(hex(int(address_1, 16) + 1)[2:]).zfill(4).upper()
        elif opcode == "JPE":
            address_1 = address
            bit, address = JPE(instruction)
            address = str(address).zfill(4).upper()
            if bit == "no jump":
                address = str(hex(int(address_1, 16) + 1)[2:]).zfill(4).upper()
        elif opcode == "JPO":
            address_1 = address
            bit, address = JPO(instruction)
            address = str(address).zfill(4).upper()
            if bit == "no jump":
                address = str(hex(int(address_1, 16) + 1)[2:]).zfill(4).upper()
        elif opcode == "JC":
            address_1 = address
            bit, address = JC(instruction)
            address = str(address).zfill(4).upper()
            if bit == "no jump":
                address = str(hex(int(address_1, 16) + 1)[2:]).zfill(4).upper()
        elif opcode == "JNC":
            address_1 = address
            bit, address = JNC(instruction)
            address = str(address).zfill(4).upper()
            if bit == "no jump":
                address = str(hex(int(address_1, 16) + 1)[2:]).zfill(4).upper()
        elif opcode == "JZ":
            address_1 = address
            bit, address = JZ(instruction)
            address = str(address).zfill(4).upper()
            if bit == "no jump":
                address = str(hex(int(address_1, 16) + 1)[2:]).zfill(4).upper()
        elif opcode == "JNZ":
            address_1 = address
            bit, address = JNZ(instruction)
            address = str(address).zfill(4).upper()
            if bit == "no jump":
                address = str(hex(int(address_1, 16) + 1)[2:]).zfill(4).upper()
        elif opcode == "LDA":
            LDA(instruction)
        elif opcode == "LDAX":
            LDAX(instruction)    
        elif opcode == "LXI":
            LXI(instruction)
        elif opcode == "LHLD":
            LHLD(instruction)
        elif opcode == "SHLD":
            SHLD(instruction)       
        elif  opcode == "MOV":
            MOV(instruction)
        elif opcode == "MVI":
            MVI(instruction)
        elif opcode == "ORA":
            ORA(instruction)
        elif opcode == "ORI":
            ORI(instruction)
        elif opcode == "PUSH":
            PUSH(instruction)    
        elif opcode == "POP":
            POP(instruction)    
        elif opcode == "RET":
            RET(instruction)
            address = ret_address
            address = str(address).zfill(4).upper()
        elif opcode == "RC":
            return_value = RC(instruction)
            if return_value == True:
                address = ret_address
                address = str(address).zfill(4).upper()
            else:
                address = str(hex(int(address, 16) + 1)[2:]).zfill(4).upper()
        elif opcode == "RNC":
            return_value = RNC(instruction)
            if return_value == True:
                address = ret_address
                address = str(address).zfill(4).upper()
            else:
                address = str(hex(int(address, 16) + 1)[2:]).zfill(4).upper()
        elif opcode == "RP":
            return_value = RP(instruction)
            if return_value == True:
                address = ret_address
                address = str(address).zfill(4).upper()
            else:
                address = str(hex(int(address, 16) + 1)[2:]).zfill(4).upper()
        elif opcode == "RM":
            return_value = RM(instruction)
            if return_value == True:
                address = ret_address
                address = str(address).zfill(4).upper()
            else:
                address = str(hex(int(address, 16) + 1)[2:]).zfill(4).upper()
        elif opcode == "RPE":
            return_value = RPE(instruction)
            if return_value == True:
                address = ret_address
                address = str(address).zfill(4).upper()
            else:
                address = str(hex(int(address, 16) + 1)[2:]).zfill(4).upper()
        elif opcode == "RPO":
            return_value = RPO(instruction)
            if return_value == True:
                address = ret_address
                address = str(address).zfill(4).upper()
            else:
                address = str(hex(int(address, 16) + 1)[2:]).zfill(4).upper()
        elif opcode == "RZ":
            return_value = RZ(instruction)
            if return_value == True:
                address = ret_address
                address = str(address).zfill(4).upper()
            else:
                address = str(hex(int(address, 16) + 1)[2:]).zfill(4).upper()
        elif opcode == "RNZ":
            return_value = RNZ(instruction)
            if return_value == True:
                address = ret_address
                address = str(address).zfill(4).upper()
            else:
                address = str(hex(int(address, 16) + 1)[2:]).zfill(4).upper()    
        elif opcode == "RLC":
            RLC(instruction)    
        elif opcode == "RRC":
            RRC(instruction)
        elif opcode == "STA":
            STA(instruction)
        elif opcode == "STAX":
            STAX(instruction)     
        elif opcode == "SUB":
            SUB(instruction)
        elif opcode == "SUI":
            SUI(instruction)
        elif opcode == "XCHG":
            XCHG(instruction)
        elif opcode == "XRA":
            XRA(instruction)
        elif opcode == "XRI":
            XRI(instruction)           
        elif opcode == "HLT":
            print("-----HLT-----")
            break
        else:
            print(f"The instruction {instruction} at memory location {address.zfill(4).upper()} is not provided by the developer.")    
        if opcode != "CALL" and opcode != "CC" and opcode != "CNC" and opcode != "CP" and opcode != "CM" and opcode != "CPE" and opcode != "CPO" and opcode != "CZ" and opcode != "CNZ" and opcode != "JMP" and opcode != "JC" and opcode != "JNC" and opcode != "JZ" and opcode != "JNZ" and opcode != "RET" and opcode != "RC" and opcode != "RNC" and opcode != "RP" and opcode != "RM" and opcode != "RPE" and opcode != "RPO" and opcode != "RZ" and opcode != "RNZ":
            address = str(hex(int(address, 16) + 1)[2:]).zfill(4).upper()
        if single_step_active == "active":
            input()
            
    print("\n""Executed Successfully...")        
    details = input("Do you want to see more details? [Y/N] : ")
    if details == "Y":
        flag_bin= ''.join([str(elem) for elem in reg_value[1]])
        flag_hex = str(hex(int(flag_bin, 2))[2:]).zfill(2).upper()
        print(f"A = {str(reg_value[0]).zfill(2).upper()}  Flag = {flag_hex} = {flag_bin}")
        print(f"B = {str(reg_value[2]).zfill(2).upper()}     C = {str(reg_value[3]).zfill(2).upper()}")
        print(f"D = {str(reg_value[4]).zfill(2).upper()}     E = {str(reg_value[5]).zfill(2).upper()}")
        print(f"H = {str(reg_value[6]).zfill(2).upper()}     L = {str(reg_value[7]).zfill(2).upper()}")
    flag = [0, 0, 0, 0, 0, 0, 0, 0]
    single_step_active = "inactive"

def memory_address_M(mode):
    if mode == 0:
        print("Storing the value to Memory address...")
        reg_value[6] = str(reg_value[6]).zfill(2).upper()
        reg_value[7] = str(reg_value[7]).zfill(2).upper()
        M_address = str(reg_value[6]) + str(reg_value[7])
        memory_location_value[int(M_address, 16)] = reg_value[8]
        print(f"[H] = {reg_value[6]}, [L] = {reg_value[7]}")
        print(f"[M] = [{M_address}] = {reg_value[8]}")
    elif mode == 1:
        print("Retrieving the value from Memory address...")
        reg_value[6] = str(reg_value[6]).zfill(2).upper()
        reg_value[7] = str(reg_value[7]).zfill(2).upper()
        M_address = str(reg_value[6]) + str(reg_value[7])
        reg_value[8] = memory_location_value[int(M_address, 16)]
        print(f"[M] = [{M_address}] = {reg_value[8]}")
        print(f"[H] = {reg_value[6]}, [L] = {reg_value[7]}")

while True:
    print("\n""Press any of the given key: A - Address, G - Execute, S - Single Step, M - Memory, R - Register")
    key = input()
    if key == "A":
        address_8085()
    elif key == "G":
        single_step_active = "inactive"
        print("-----EXECUTE-----")
        execute_8085()
    elif key == "M":
        memory_8085()
    elif key == "S":
        single_step_active = "active"
        print("----- SINGLE STEP-----")
        execute_8085()
    elif key == "R":
        print("-----REG VIEW/EDIT-----")
        flag_bin= ''.join([str(elem) for elem in reg_value[1]])
        flag_hex = str(hex(int(flag_bin, 2))[2:]).zfill(2).upper()
        print(f"A = {str(reg_value[0]).zfill(2).upper()}  Flag = {flag_hex} = {flag_bin}")
        print(f"B = {str(reg_value[2]).zfill(2).upper()}     C = {str(reg_value[3]).zfill(2).upper()}")
        print(f"D = {str(reg_value[4]).zfill(2).upper()}     E = {str(reg_value[5]).zfill(2).upper()}")
        print(f"H = {str(reg_value[6]).zfill(2).upper()}     L = {str(reg_value[7]).zfill(2).upper()}")
