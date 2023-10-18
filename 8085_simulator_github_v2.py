global A, flag, B, C, D, E, H, L, M
global reg_list, reg_value, address_location_list, address_value_list, address_list
global program, program_counter, p_c, flag_status
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
address_list = []
address_location_list = []
address_value_list = []
reg_value = [A, flag, B, C, D, E, H, L, M]
M = str(reg_value[6]) + str(reg_value[7])
program = []
program_counter = []

def ADD(mnemonic):
    print("-----ADD-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    reg_value[0] = hex(int(reg_value[0], 16) + int(reg_value[reg_1], 16))[2:]
    if int(reg_value[0], 16) > 255:
        check_accumulator()
        reg_value[0] = hex(int(reg_value[0], 16) - int("100", 16))[2:]
    print(f"[A] = {reg_value[0]}")
    reg_value[0] = fill_zero(reg_value[0]) 
    
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
    print(f"[A] = {reg_value[0]}")    
    check_accumulator()
    reg_value[0] = fill_zero(reg_value[0])

def ANA(mnemonic):
    print("-----ANA-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    reg_value[0] = int(reg_value[0], 16) & int(reg_value[reg_1], 16)
    check_accumulator()
    print(f"[A] = {reg_value[0]}")
    reg_value[0] = fill_zero(reg_value[0])
    
    
def ANI(mnemonic):
    print("-----ANI-----")
    mnemonic = mnemonic.split()
    immediate_value = mnemonic[1]
    if len(str(immediate_value)) == 2:
        reg_value[0] = hex(int(str(reg_value[0]), 16) & int(str(immediate_value), 16))[2:]
        check_accumulator()
    else:
        print("Invalid value: Expected value is one byte hexadecimal value")
    print(f"[A] = {reg_value[0]}")
    reg_value[0] = fill_zero(reg_value[0])
    
def CMA(mnemonic):
    print("-----CMA-----")
    reg_value[0] = hex(0 - int(reg_value[0], 16))
    reg_value[0] = hex(int(reg_value[0], 16) + int("FF", 16))[2:]
    flag[0] = 1
    flag[1] = 1
    print(f"[A] = {reg_value[0]}")
    reg_value[0] = fill_zero(reg_value[0])
    
def CMP(mnemonic):
    print("-----CMP-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
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
    print(flag)    
    
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
    print(flag)    
    
def DAD(mnemonic):
    print("-----DAD-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1_index = reg_list.index(reg_1)
    reg_2_index = reg_1_index + 1
    reg_value[7] = hex(int(reg_value[7], 16) + int(reg_value[reg_2_index], 16))[2:]
    if int(reg_value[7], 16) > 255:
        check_flag(reg_value[7])
        reg_value[7] = hex(int(reg_value[7], 16) - int("100", 16))[2:]
        reg_value[6] = hex(int(reg_value[6], 16) + int(reg_value[reg_1_index], 16))[2:]
        if int(reg_value[6], 16) > 255:
            check_flag(reg_value[6])
            reg_value[6] = hex(int(reg_value[6], 16) - int("100", 16))[2:]
    else:
        reg_value[6] = hex(int(reg_value[6], 16) + int(reg_value[reg_1_index], 16))[2:]
        if int(reg_value[6], 16) > 255:
            check_flag(reg_value[6])
            reg_value[6] = hex(int(reg_value[6], 16) - int("100", 16))[2:]
    reg_value[6] = fill_zero(reg_value[6])
    reg_value[7] = fill_zero(reg_value[7])

def DCR(mnemonic):
    print("-----DCR-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_index = reg_list.index(reg_1)
    reg_value[reg_index] = hex(int(reg_value[reg_index], 16) - int("1", 16))[2:]
    print(f"[{reg_list[reg_index]}] = {reg_value[reg_index]}")    
    check_flag(reg_value[reg_index])
    reg_value[reg_index] = fill_zero(reg_value[reg_index])
    
def DCX(mnemonic):
    print("-----DCX-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1_index = reg_list.index(reg_1)
    print(reg_value[reg_1_index])
    reg_2_index = reg_1_index + 1
    print(reg_value[reg_2_index])
    if int(reg_value[reg_2_index], 16) == 0:
        reg_value[reg_1_index] = hex(int(reg_value[reg_1_index], 16) - int("1", 16))[2:]
        reg_value[reg_2_index] = hex(255)[2:]
    else:
        reg_value[reg_2_index] = hex(int(reg_value[reg_2_index], 16) - int("1", 16))[2:]
    reg_value[reg_1_index] = fill_zero(reg_value[reg_1_index])
    reg_value[reg_2_index] = fill_zero(reg_value[reg_2_index])
    print(f"[{reg_list[reg_1_index]}] = {reg_value[reg_1_index]}")
    print(f"[{reg_list[reg_2_index]}] = {reg_value[reg_2_index]}") 
    
def INR(mnemonic):
    print("-----INR-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_index = reg_list.index(reg_1)
    reg_value[reg_index] = hex(int(reg_value[reg_index], 16) + int("1", 16))[2:]
    print(f"[{reg_list[reg_index]}] = {reg_value[reg_index]}")    
    check_flag(reg_value[reg_index])
    reg_value[reg_index] = fill_zero(reg_value[reg_index])
    
def INX(mnemonic):
    print("-----INX-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1_index = reg_list.index(reg_1)
    print(reg_value[reg_1_index])
    reg_2_index = reg_1_index + 1
    print(reg_value[reg_2_index])
    if int(reg_value[reg_2_index], 16)  == 255:
        reg_value[reg_1_index] = hex(int(reg_value[reg_1_index], 16) + int("1", 16))[2:]
        reg_value[reg_2_index] = str("00").zfill(1)
    else:
        reg_value[reg_2_index] = hex(int(reg_value[reg_2_index], 16) + int("1", 16))[2:]
    reg_value[reg_1_index] = fill_zero(reg_value[reg_1_index])
    reg_value[reg_2_index] = fill_zero(reg_value[reg_2_index])
    if reg_1 == "H":
        if address_location_list == []:
            pass
        else:
            M = str(reg_value[6]) + str(reg_value[7])
            M_index = address_location_list.index(M)
            reg_value[8] = address_value_list[M_index]
            reg_value[8] = fill_zero(reg_value[8])
    print(f"[{reg_list[reg_1_index]}] = {reg_value[reg_1_index]}") 
    print(f"[{reg_list[reg_2_index]}] = {reg_value[reg_2_index]}") 
        
def JMP(mnemonic):
    print("-----JMP-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    jmp_address = hex(int(jmp_address, 16))[2:]
    jmp_to = address_list.index(jmp_address)
    print(f"Jump to {jmp_address}")
    return jmp_to
    
def JP(mnemonic):
    print("-----JP-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    jmp_address = hex(int(jmp_address, 16))[2:]
    if flag[0] == 0:
        p_c = address_list.index(jmp_address)
        print(f"Jump to {jmp_address}")
        return p_c
    elif flag[0] == 1:
        print("Jump completed...")
        return "A"    

def JM(mnemonic):
    print("-----JM-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    jmp_address = hex(int(jmp_address, 16))[2:]
    if flag[0] == 1:
        p_c = address_list.index(jmp_address)
        print(f"Jump to {jmp_address}")
        return p_c
    elif flag[0] == 0:
        print("Jump completed...")
        return "A"

def JPE(mnemonic):
    print("-----JPE-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    jmp_address = hex(int(jmp_address, 16))[2:]
    if flag[5] == 1:
        p_c = address_list.index(jmp_address)
        print(f"Jump to {jmp_address}")
        return p_c
    elif flag[5] == 0:
        print("Jump completed...")
        return "A"

def JPO(mnemonic):
    print("-----JPO-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    jmp_address = hex(int(jmp_address, 16))[2:]
    if flag[5] == 0:
        p_c = address_list.index(jmp_address)
        print(f"Jump to {jmp_address}")
        return p_c
    elif flag[5] == 1:
        print("Jump completed...")
        return "A"
    
def JC(mnemonic):
    print("-----JC-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    jmp_address = hex(int(jmp_address, 16))[2:]
    if flag[7] == 1:
        p_c = address_list.index(jmp_address)
        print(f"Jump to {jmp_address}")
        return p_c
    elif flag[7] == 0:
        print("Jump completed...")
        return "A"    
    
def JNC(mnemonic):
    print("-----JNC-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    jmp_address = hex(int(jmp_address, 16))[2:]
    if flag[7] == 0:
        p_c = address_list.index(jmp_address)
        print(f"Jump to {jmp_address}")
        return p_c
    elif flag[7] == 1:
        print("Jump completed...")
        return "A"    
    
def JZ(mnemonic):
    print("-----JZ-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    jmp_address = hex(int(jmp_address, 16))[2:]
    if flag[1] == 1:
        p_c = address_list.index(jmp_address)
        print(f"Jump to {jmp_address}")
        return p_c
    elif flag[1] == 0:
        print("Jump completed...")
        return "A"   
    
def JNZ(mnemonic):
    print("-----JNZ-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    jmp_address = hex(int(jmp_address, 16))[2:]
    if flag[1] == 0:
        p_c = address_list.index(jmp_address)
        print(f"Jump to {jmp_address}")
        return p_c
    elif flag[1] == 1:
        print("Jump completed...")
        return "A"
        
def LDA(mnemonic):
    print("-----LDA-----")
    mnemonic = mnemonic.split()
    address = mnemonic[1]
    address_index = address_location_list.index(address)
    reg_value[0] = hex(int(address_value_list[address_index], 16))[2:]
    reg_value[0] = fill_zero(reg_value[0])
    print(f"[{address}] = {address_value_list[address_index]}")
    print(f"[A] = {reg_value[0]}")
    
def LDAX(mnemonic):
    print("-----LDAX-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    higher_byte = reg_value[reg_1]
    higher_byte = fill_zero(higher_byte)
    reg_2 = reg_1 + 1
    lower_byte = reg_value[reg_2]
    lower_byte = fill_zero(lower_byte)
    address = str(higher_byte) + str(lower_byte)
    address_index = address_location_list.index(address)
    reg_value[0] = address_value_list[address_index]
    reg_value[0] = fill_zero(reg_value[0])
    print(f"[{reg_list[reg_1]}] = {reg_value[reg_1]}")
    print(f"[{reg_list[reg_2]}] = {reg_value[reg_2]}")
    print(f"[{address}] = {address_value_list[address_index]}")
    print(f"[A] = {reg_value[0]}")    
    
def LXI(mnemonic):
    print("-----LXI-----")
    mnemonic = mnemonic.split()
    operand = mnemonic[1].split(",")
    higher_byte, lower_byte = split_address(operand[1])
    if operand[0] == "B" or operand[0] == "D" or operand[0] == "H":
        reg_1 = reg_list.index(operand[0])
        reg_value[reg_1] = hex(int(higher_byte, 16))[2:]
        reg_value[reg_1] = fill_zero(reg_value[reg_1])
        reg_2 = reg_1 + 1
        reg_value[reg_2] = hex(int(lower_byte, 16))[2:]
        reg_value[reg_2] = fill_zero(reg_value[reg_2])
        print(f"Address = {operand[1]}")
        print(f"[{reg_list[reg_1]}] = {reg_value[reg_1]}")
        print(f"[{reg_list[reg_2]}] = {reg_value[reg_2]}")
    else:
        print("Register invalid")
    if operand[0] == "H":
        if address_location_list == []:
            pass
        else:
            M = str(reg_value[6]) + str(reg_value[7])
            M_index = address_location_list.index(M)
            reg_value[8] = address_value_list[M_index]
            reg_value[8] = fill_zero(reg_value[8])
            print(f"[M] = [{operand[1]}] = {reg_value[8]}")
        
def LHLD(mnemonic):
    print("-----LHLD-----")
    mnemonic = mnemonic.split()
    address = mnemonic[1]
    address_index = address_location_list.index(address)
    reg_value[6] = address_value_list[address_index]
    reg_value[6] = fill_zero(reg_value[6])
    address_index += 1
    reg_value[7] = address_value_list[address_index]
    reg_value[7] = fill_zero(reg_value[7])
    print(f"[{address}] = {address_value_list[address_index]}")
    print(f"[H] = {reg_value[6]}")
    print(f"[L] = {reg_value[7]}")
    
def SHLD(mnemonic):
    print("-----SHLD-----")
    mnemonic = mnemonic.split()
    address = mnemonic[1]
    address_index = address_location_list.index(address)
    address_value_list[address_index] = reg_value[6]
    address_value_list[address_index] = fill_zero(address_value_list[address_index])
    address_index += 1
    address_value_list[address_index] = reg_value[7]
    address_value_list[address_index] = fill_zero(address_value_list[address_index])
    print(f"[H] = {reg_value[6]}")
    print(f"[L] = {reg_value[7]}")
    print(f"[{address}] = {address_value_list[address_index]}")
    
def MOV(mnemonic):
    print("-----MOV-----")
    mnemonic = mnemonic.split()
    mnemonic = mnemonic[1].split(",")
    reg_1 = mnemonic[0]
    reg_2 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    reg_2 = reg_list.index(reg_2)
    reg_value[reg_1] = reg_value[reg_2]
    print(f"[{reg_list[reg_2]}] = {reg_value[reg_2]}")
    print(f"[{reg_list[reg_1]}] = {reg_value[reg_1]}")

def MVI(mnemonic, address_location_list=None, address_value_list=None):
    print("-----MVI-----")
    mnemonic = mnemonic.split()
    operand = mnemonic[1].split(",")
    reg_1 = reg_list.index(operand[0])
    if len(operand[1]) == 2:
        operand[1] = hex(int(operand[1], 16))[2:]
        reg_value[reg_1] = operand[1]
    elif len(operand[1]) == 4:
        reg_temp = address_location_list.index(operand[1])
        reg_value[reg_1] = address_value_list[reg_temp]
        print(f"[{operand[1]}] = {address_value_list[reg_temp]}")
    reg_value[reg_1] = fill_zero(reg_value[reg_1])
    print(f"[{reg_list[reg_1]}] = {reg_value[reg_1]}")
        
def ORA(mnemonic):
    print("-----ORA-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    reg_value[0] = hex(int(reg_value[0], 16) | int(reg_value[reg_1], 16))[2:]
    print(f"[A] = {reg_value[0]}")
    check_accumulator()
    reg_value[0] = fill_zero(reg_value[0])
    
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
    reg_value[0] = fill_zero(reg_value[0])
    
def RLC(mnemonic):
    print("-----RLC-----")
    reg_value[0] = int(reg_value[0], 16) << 1
    reg_value[0] = hex(reg_value[0])[2:]
    reg_value[0] = fill_zero(reg_value[0])
    print(f"[A] = {reg_value[0]}")
    
def RRC(instruction):
    print("-----RRC-----")
    reg_value[0] = int(reg_value[0], 16) >> 1
    reg_value[0] = hex(reg_value[0])[2:]
    reg_value[0] = fill_zero(reg_value[0])
    print(f"[A] = {reg_value[0]}")          

def STA(mnemonic):
    print("-----STA-----")
    mnemonic = mnemonic.split()
    address = mnemonic[1]
    if address in address_location_list:
        address_index = address_location_list.index(address)
        address_value_list[address_index] = reg_value[0]
        address_value_list[address_index] = fill_zero(address_value_list[address_index])
        print(f"[A] = {reg_value[0]}")    
        print(f"[{address}] = {address_value_list[address_index]}")
    elif address not in address_location_list:
        address_location_list.append(str(address))
        reg_value[0] = fill_zero(reg_value[0])
        address_value_list.append(reg_value[0])
        print(f"[A] = {reg_value[0]}")    
        print(f"[{address}] = {reg_value[0]}")

def STAX(mnemonic):
    print("-----STAX-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    higher_byte = reg_value[reg_1]
    higher_byte = fill_zero(higher_byte)
    reg_2 = reg_1 + 1
    lower_byte = reg_value[reg_2]
    lower_byte = fill_zero(lower_byte)
    address = str(higher_byte) + str(lower_byte)
    address_index = address_location_list.index(address)
    reg_value[0] = fill_zero(reg_value[0])
    address_value_list[address_index] = reg_value[0]
    print(f"[A] = {reg_value[0]}")
    print(f"[{reg_list[reg_1]}] = {reg_value[reg_1]}")
    print(f"[{reg_list[reg_2]}] = {reg_value[reg_2]}")
    print(f"[{address}] = {address_value_list[address_index]}")

def SUB(mnemonic):
    print("-----SUB-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    if int(reg_value[0], 16) > int(reg_value[reg_1], 16):
        reg_value[0] = hex(int(reg_value[0], 16) - int(reg_value[reg_1], 16))[2:]
    else:
        reg_value[0] = hex(int(reg_value[0], 16) - int(reg_value[reg_1], 16))
        reg_value[0] = hex(int(reg_value[0], 16) + int("100", 16))[2:]
        flag[0] = 1
        flag[7] = 1
    print(f"[A] = {reg_value[0]}")
    reg_value[0] = fill_zero(reg_value[0])
    
def SUI(mnemonic):
    print("-----SUI-----")
    mnemonic = mnemonic.split()
    immediate_value = mnemonic[1]
    if len(str(immediate_value)) == 2:
        if int(reg_value[0], 16) > int(str(immediate_value), 16):
            reg_value[0] = hex(int(reg_value[0], 16) - int(str(immediate_value), 16))[2:]
        else:
            reg_value[0] = hex(int(reg_value[0], 16) - int(str(immediate_value), 16))
            reg_value[0] = hex(int(reg_value[0], 16) + int("100", 16))[2:]
            flag[0] = 1
            flag[7] = 1
    else:
        print("Invalid value: Expected value is one byte hexadecimal value")
    print(f"[A] = {reg_value[0]}")
    reg_value[0] = fill_zero(reg_value[0])

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
    reg_value[4] = fill_zero(reg_value[4])
    reg_value[5] = fill_zero(reg_value[5])
    reg_value[6] = fill_zero(reg_value[6])
    reg_value[7] = fill_zero(reg_value[7])
    print("\n""After: ")
    print(f"[H] = {reg_value[6]}")
    print(f"[L] = {reg_value[7]}")
    print(f"[D] = {reg_value[4]}")
    print(f"[E] = {reg_value[5]}")
    
def XRA(mnemonic):
    print("-----XRA-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    reg_value[0] = hex(int(reg_value[0], 16) ^ int(reg_value[reg_1], 16))[2:]
    print(f"[A] = {reg_value[0]}")
    check_accumulator()
    reg_value[0] = fill_zero(reg_value[0])
    
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
    reg_value[0] = fill_zero(reg_value[0])   
    
def check_accumulator():
    if int(reg_value[0], 16) == 0:
        flag[1] = 1
    elif int(reg_value[0], 16) != 0:
        flag[1] = 0
    if int(reg_value[0], 16) > 255:
        flag[7] = 1
    elif int(reg_value[0], 16) <= 255:
        flag[7] = 0
    print(flag)    
        
def check_flag(reg_name):
    if int(reg_name, 16) == 0:
        flag[1] = 1
    elif int(reg_name, 16) != 0:
        flag[1] = 0
    if int(reg_name, 16) > 255:
        flag[7] = 1
    elif int(reg_name, 16) <= 255:
        flag[7] = 0
    print(flag)    
        
def fill_zero(reg_name):
    if reg_name == None:
        return reg_name
    else:    
        if int(reg_name, 16) < 16:
            print(hex(int(reg_name, 16)))
            return str(reg_name).zfill(2)
        else:
            return reg_name              
        
def split_address(address):
    higher_byte = address[0:len(address)//2] 
    lower_byte = address[len(address)//2 if len(address)%2 == 0 else ((len(address)//2)+1):]
    return higher_byte, lower_byte    

def byte_8085(mnemonic):
    global one_byte
    global two_byte
    global three_byte
    t = 0
    mnemonic = mnemonic.split()
    opcode = mnemonic[0]
    one_byte = ["MOV", "ADD", "CPI", "CMP", "CMA", "INR", "INX", "DCR", "DCX", "DAD", "LDAX", "STAX", "HLT", "SUB", "XCHG", "ANA", "ANI", "ORA", "ORI", "XRA", "XRI", "RRC", "RLC"]
    two_byte = ["MVI", "ADI", "ORI", "ACI", "SUI", "CPI"]
    three_byte = ["LDA", "LXI", "STA", "JMP","CALL", "LHLD", "SHLD", "JC", "JNC", "JZ", "JNZ", "JP", "JM", "JPE", "JPO"]
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

def address_8085():
    print("-----ADDRESS-----")
    global address
    global mnemonic
    address = hex(int((input("Enter starting address: ")), 16))
    while True:
        mnemonic = input(f"{address[2:]}: ")
        if mnemonic == "EXIT":
            break
        address_list.append(f"{address[2:]}")
        program.append(f"{address[2:]}:{mnemonic}")
        byte = byte_8085(mnemonic)
        if byte == "error":
            address_list.pop()
            program.pop()
        if byte == 1:
            address = hex(int(address, 16) + int("1",16))
        elif byte == 2:
            address = hex(int(address, 16) + int("2",16))
        elif byte == 3:
            address = hex(int(address, 16) + int("3",16))
    print(address_list)

def memory_8085():
    print("-----MEMORY-----")
    global address_location_list
    global address_value_list
    address_location_list =[]
    address_value_list = []
    while True:
        print("Enter address: ")
        address_location = input()
        if address_location == "EXIT":
            print(address_location_list, address_value_list)
            break
        address_location = hex(int(address_location, 16))[2:]
        address_location_list.append(address_location)
        print("Enter value: ")
        address_value = hex(int(input(), 16))[2:]
        addrss_value = fill_zero(address_value)
        address_value_list.append(address_value)

def execute_8085():
    print("-----EXECUTE-----")
    global p_c, M
    p_c = 0
    machine_cycles = len(program)
    print(f"Start address: {address_list[0]}")
    while True:
        machine_code = program[p_c]
        mnemonic = machine_code.split(":")
        address_code = mnemonic[0]
        instruction = mnemonic[1]
        opcode = instruction.split()[0]
        if opcode == "ADD":
            ADD(instruction)
        elif opcode == "ADI":
            ADI(instruction)
        elif opcode == "ANA":
            ANA(instruction)
        elif opcode == "ANI":
            ANI(instruction)
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
            m = JMP(instruction)
        elif opcode == "JP":
            p_c = JC(instruction)
            if p_c == "A":
                p_c = address_list.index(address_code)
                p_c = p_c + 1
        elif opcode == "JM":
            p_c = JC(instruction)
            if p_c == "A":
                p_c = address_list.index(address_code)
                p_c = p_c + 1
        elif opcode == "JPE":
            p_c = JC(instruction)
            if p_c == "A":
                p_c = address_list.index(address_code)
                p_c = p_c + 1
        elif opcode == "JPO":
            p_c = JC(instruction)
            if p_c == "A":
                p_c = address_list.index(address_code)
                p_c = p_c + 1                            
        elif opcode == "JC":
            p_c = JC(instruction)
            if p_c == "A":
                p_c = address_list.index(address_code)
                p_c = p_c + 1
        elif opcode == "JNC":
            p_c = JNC(instruction)
            if p_c == "A":
                p_c = address_list.index(address_code)
                p_c = p_c + 1
        elif opcode == "JZ":
            p_c = JZ(instruction)
            if p_c == "A":
                p_c = address_list.index(address_code)
                p_c = p_c + 1
        elif opcode == "JNZ":
            p_c = JNZ(instruction)
            if p_c == "A":
                p_c = address_list.index(address_code)
                p_c = p_c + 1
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
            break
        if opcode != "JMP" and opcode != "JC" and opcode != "JNC" and opcode != "JZ" and opcode != "JNZ":
            p_c = p_c + 1
    print(flag)        
                
    details = input("Do you want to see more details? [Y/N] : ")
    if details == "Y":
        print(f"A = {reg_value[0]} flag = {reg_value[1]}")
        print(f"B = {reg_value[2]} C = {reg_value[3]}")
        print(f"D = {reg_value[4]} E = {reg_value[5]}")
        print(f"H = {reg_value[6]} L = {reg_value[7]}")
        print(f"address_location_list = {address_location_list}")
        print(f"address_value_list = {address_value_list}")

while True:
    print("\n""Press any of the given key: AD - Address, GO - Execute, M - Memory""\n""A, flag, B, C, D, E, H, L")
    key = input()
    if key == "AD":
        address_8085()
    elif key == "GO":
        execute_8085()
    elif key == "M":
        memory_8085()
    elif key == "A":
        print(reg_value[0])
    elif key == "flag":
        print(reg_value[1])    
    elif key == "B":
        print(reg_value[2])
    elif key == "C":
        print(reg_value[3])
    elif key == "D":
        print(reg_value[4])
    elif key == "E":
        print(reg_value[5])
    elif key == "H":
        print(reg_value[6])
    elif key == "L":
        print(reg_value[7])
