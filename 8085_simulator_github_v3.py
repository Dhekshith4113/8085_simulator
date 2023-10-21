import random

global A, flag, B, C, D, E, H, L, M
global reg_list, reg_value, address_location_list, address_value_list, address_list, machine_code_list, machine_code_list_1
global program, program_counter, p_c, flag_status, memory_location_list, memory_location_value 
A = hex(0)[2:]
flag = [0, 0, 0, 0, 0, 0, 0, 0]
B = hex(0)[2:]
C = hex(0)[2:]
D = hex(0)[2:]
E = hex(0)[2:]
H = hex(255)[2:]
L = hex(255)[2:]
M = hex(0)[2:]
reg_list = ["A", "flag", "B", "C", "D", "E", "H", "L", "M"]
address_list = []
address_location_list = []
address_value_list = []
machine_code_list = []
machine_code_list_1 = [] # To display the machine code as a list
reg_value = [A, flag, B, C, D, E, H, L, M]
M_address = str(reg_value[6]) + str(reg_value[7])
program = []

memory_location_list = []
n = 0
for i in range(65535):
    n = int(str(n), 16) + 1
    n = hex(n)[2:]
    memory_location_list.append(n)
    
memory_location_value = []
n = 0
for i in range(65535):
    n = random.randint(0, 255)
    n = hex(n)[2:]
    if int(n, 16) < 16:
        n = str(n).zfill(2)
    memory_location_value.append(n)
    
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
    reg_value[0] = fill_zero(reg_value[0])

def ANA(mnemonic):
    print("-----ANA-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    if reg_1 == "M":
        memory_address_M(1)
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
    flag[7] = 1
    reg_value[0] = fill_zero(reg_value[0])
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
        reg_value[6] = hex(int(reg_value[6], 16) + int(reg_value[reg_1_index], 16) + 1)[2:]
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
    if reg_1 == "M":
        memory_address_M(1)
    reg_value[reg_index] = hex(int(reg_value[reg_index], 16) + 1)[2:]
    if reg_1 == "M":
        memory_address_M(0)
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
            M_index = memory_location_list.index(M)
            reg_value[8] = memory_location_value[M_index]
            reg_value[8] = fill_zero(reg_value[8])
    print(f"[{reg_list[reg_1_index]}] = {reg_value[reg_1_index]}") 
    print(f"[{reg_list[reg_2_index]}] = {reg_value[reg_2_index]}") 
        
def JMP(mnemonic):
    print("-----JMP-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    jmp_address = hex(int(jmp_address, 16))[2:]
    p_c = program_address_list.index(jmp_address)
    print(f"Jump to {jmp_address}")
    return p_c
    
def JP(mnemonic):
    print("-----JP-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    jmp_address = hex(int(jmp_address, 16))[2:]
    if flag[0] == 0:
        p_c = program_address_list.index(jmp_address)
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
        p_c = program_address_list.index(jmp_address)
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
        p_c = program_address_list.index(jmp_address)
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
        p_c = program_address_list.index(jmp_address)
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
        p_c = program_address_list.index(jmp_address)
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
        p_c = program_address_list.index(jmp_address)
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
        p_c = program_address_list.index(jmp_address)
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
        p_c = program_address_list.index(jmp_address)
        print(f"Jump to {jmp_address}")
        return p_c
    elif flag[1] == 1:
        print("Jump completed...")
        return "A"
        
def LDA(mnemonic):
    print("-----LDA-----")
    mnemonic = mnemonic.split()
    address = mnemonic[1]
    address_index = memory_location_list.index(address)
    reg_value[0] = hex(int(memory_location_value[address_index], 16))[2:]
    reg_value[0] = fill_zero(reg_value[0])
    print(f"[{address}] = {memory_location_value[address_index]}")
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
    address_index = memory_location_list.index(address)
    reg_value[0] = memory_location_value[address_index]
    reg_value[0] = fill_zero(reg_value[0])
    print(f"[{reg_list[reg_1]}] = {reg_value[reg_1]}")
    print(f"[{reg_list[reg_2]}] = {reg_value[reg_2]}")
    print(f"[{address}] = {memory_location_value[address_index]}")
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
            M_index = memory_location_list.index(M)
            reg_value[8] = memory_location_value[M_index]
            reg_value[8] = fill_zero(reg_value[8])
            print(f"[M] = [{operand[1]}] = {reg_value[8]}")
        
def LHLD(mnemonic):
    print("-----LHLD-----")
    mnemonic = mnemonic.split()
    address = mnemonic[1]
    address_index = memory_location_list.index(address)
    reg_value[7] = memory_location_value[address_index]
    reg_value[7] = fill_zero(reg_value[7])
    address_index += 1
    reg_value[6] = memory_location_value[address_index]
    reg_value[6] = fill_zero(reg_value[6])
    print(f"[{address}] = {memory_location_value[address_index]}")
    print(f"[H] = {reg_value[6]}")
    print(f"[L] = {reg_value[7]}")
    
def SHLD(mnemonic):
    print("-----SHLD-----")
    mnemonic = mnemonic.split()
    address = mnemonic[1]
    address_index = memory_location_list.index(address)
    memory_location_value[address_index] = reg_value[7]
    memory_location_value[address_index] = fill_zero(memory_location_value[address_index])
    address_index += 1
    memory_location_value[address_index] = reg_value[6]
    memory_location_value[address_index] = fill_zero(memory_location_value[address_index])
    print(f"[H] = {reg_value[6]}")
    print(f"[L] = {reg_value[7]}")
    print(f"[{address}] = {memory_location_value[address_index]}")
    
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
    if len(operand[1]) == 2:
        operand[1] = hex(int(operand[1], 16))[2:]
        reg_value[reg_1] = operand[1]
    elif len(operand[1]) == 4:
        reg_temp = memory_location_list.index(operand[1])
        reg_value[reg_1] = memory_location__value[reg_temp]
        print(f"[{operand[1]}] = {address_value_list[reg_temp]}")
    reg_value[reg_1] = fill_zero(reg_value[reg_1])
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
    address_index = memory_location_list.index(address)
    memory_location_value[address_index] = reg_value[0]
    memory_location_value[address_index] = fill_zero(memory_location_value[address_index])
    print(f"[A] = {reg_value[0]}")    
    print(f"[{address}] = {memory_location_value[address_index]}")

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
    address_index = memory_location_list.index(address)
    reg_value[0] = fill_zero(reg_value[0])
    memory_location_value[address_index] = reg_value[0]
    print(f"[A] = {reg_value[0]}")
    print(f"[{reg_list[reg_1]}] = {reg_value[reg_1]}")
    print(f"[{reg_list[reg_2]}] = {reg_value[reg_2]}")
    print(f"[{address}] = {memory_location_value[address_index]}")
    
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
        reg_value[0] = 0
    elif int(reg_value[0], 16) < int(reg_value[reg_1_index], 16):
        reg_value[0] = hex(int(reg_value[0], 16) - int(reg_value[reg_1_index], 16))
        reg_value[0] = hex(int(reg_value[0], 16) + int("100", 16))[2:]
        flag[0] = 1
        flag[7] = 1
    reg_value[0] = fill_zero(reg_value[0])    
    print(f"[A] = {reg_value[0]}")
    print(flag)
    
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
    if reg_1 == "M":
        memory_address_M(1)
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
    print("-----Check Accumulator-----")
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
    print("-----Check Flag-----")
    if int(reg_name, 16) == 0:
        flag[1] = 1
    elif int(reg_name, 16) != 0:
        flag[1] = 0
    if int(reg_name, 16) > 255:
        flag[7] = 1
    elif int(reg_name, 16) <= 255:
        flag[7] = 0
    print(f"Flag = {flag}")    
        
def fill_zero(reg_name):
    if reg_name == None:
        return reg_name
    else:    
        if int(reg_name, 16) < 16:
            return str(reg_name).zfill(2)
        else:
            return reg_name              
        
def split_address(address):
    print("-----Split Address-----")
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
    one_byte = ["MOV", "ADD", "CMP", "CMA", "INR", "INX", "DCR", "DCX", "DAD", "LDAX", "STAX", "HLT", "SUB", "XCHG", "ANA", "ORA", "XRA", "RRC", "RLC"]
    two_byte = ["MVI", "ADI", "ANI", "ORI", "XRI", "ACI", "SUI", "CPI"]
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

def memory_8085():
    print("-----MEMORY/EDIT-----")
    print("If you want to change the value, type the desired value. Otherwise hit enter.")
    global address_location_list
    global address_value_list
    address_value_list_before = []
    address_location = input("Enter address: ")
    while True:
        address_location = hex(int(address_location, 16))[2:]
        memory_location_index = memory_location_list.index(address_location)
        address_value_list_before.append(memory_location_value[memory_location_index ])
        address_value = input(f"{address_location}: {memory_location_value[memory_location_index]} ")
        if address_value == "EXIT":
            break
        elif len(address_value) == 2 :
            memory_location_value[memory_location_index ] = address_value
        elif len(address_value) == 0:
            address_value = memory_location_value[memory_location_index]
            print(address_value)
        if len(address_value) > 2:
            print("Invalid value: 2-byte hexadecimal value expected")
        else:
            address_value = hex(int(address_value, 16))[2:]
            address_value = fill_zero(address_value)
            if address_location in address_location_list:
                address_location_index = address_location_list.index(address_location)
                address_value_list[address_location_index] = address_value
            else:
                address_value_list.append(address_value)
                address_location_list.append(address_location)
            address_location = hex(int(address_location, 16) + 1)
    print(f"Address location list = {address_location_list}")
    print(f"Address value list before = {address_value_list_before}")
    print(f"Address value list after = {address_value_list}")      
    for address in address_location_list:
        m = address_location_list.index(address)
        address_value = address_value_list[m]
        address_value = fill_zero(address_value)
        memory_location_index = memory_location_list.index(address)
        memory_location_value[memory_location_index ] = address_value
    
def instruction_decoder(mnemonic):
    print("Decoding instruction...")
    instruction  = mnemonic.split()[0]
    print(f"Mnemonic = {mnemonic}, Instruction = {instruction}")
    one_byte_list = ["MOV", "ADD", "CMP", "CMA", "INR", "INX", "DCR", "DCX", "DAD", "LDAX", "STAX", "HLT", "SUB", "XCHG", "ANA", "ORA", "XRA", "RRC", "RLC"]
    two_byte_list_1 = ["ADI", "ORI", "ACI", "SUI", "CPI", "ANI", "ORI", "XRI"]
    two_byte_list_2 = ["MVI"]
    three_byte_list_1 = ["LDA", "STA", "JMP","CALL", "LHLD", "SHLD", "JC", "JNC", "JZ", "JNZ", "JP", "JM", "JPE", "JPO"]
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
            machine_code = "N4"
        elif mnemonic == "ORA L":
            machine_code = "B5"
        elif mnemonic == "ORA M":
            machine_code = "B6"
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
        print(f"Byte = {byte}, Machine code = {machine_code}")                                               
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
        print(f"Byte = {byte}, Machine code = {machine_code}, Immediate_value = {immediate_value}")                       
        return byte, machine_code, immediate_value
    elif instruction in two_byte_list_2:
        byte = "TWO"
        mnemonic = mnemonic.split(",")
        opcode = mnemonic[0]
        print(byte)
        print(opcode)
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
        print(f"Byte = {byte}, Machine code = {machine_code}, Immediate_value = {immediate_value}")    
        return byte, machine_code, immediate_value   
    elif instruction in three_byte_list_1:
        byte = "THREE"
        mnemonic = mnemonic.split()
        opcode = mnemonic[0]
        memory_location = mnemonic[1]
        if opcode == "LDA":
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
        print(f"Byte = {byte}, Machine code = {machine_code}, Memory location = {memory_location}")    
        return byte, machine_code, memory_location
    elif instruction in three_byte_list_2:
        byte = "THREE"
        mnemonic = mnemonic.split(",")
        opcode = mnemonic[0]
        print(byte)
        print(opcode)
        memory_location = mnemonic[1]
        print(memory_location)
        if opcode == "LXI B":
            machine_code = "01"
        elif opcode == "LXI D":
            machine_code = "11"
        elif opcode == "LXI H":
            machine_code = "21"
        elif opcode == "LXI SP":
            machine_code = "31"
        print(f"Byte = {byte}, Machine code = {machine_code}, Memory location = {memory_location}")                
        return byte, machine_code, memory_location
    else:
        print("Unknown instruction...")
        byte = "Error"
        return byte, None, None

def MN_to_MC(address, mnemonic):
    print("Converting to Machine Code...")
    global machine_code_list, address_list, memory_location_list, memory_location_value
    byte, machine_code, iv_ml = instruction_decoder(mnemonic) # iv_ml means immediate_value or memory_location
    if byte == "ONE":
        machine_code = fill_zero(machine_code)
        address_list.append(f"{address}")
        machine_code_list.append(machine_code)
        machine_code_list_1.append(machine_code)
        memory_location_index = memory_location_list.index(address)
        memory_location_value[memory_location_index] = machine_code
        return machine_code, None, None
    elif byte == "TWO":
        machine_code = fill_zero(machine_code)
        address_list.append(f"{address}")
        machine_code_list.append(machine_code)
        machine_code_list_1.append(machine_code)
        memory_location_index = memory_location_list.index(address)
        memory_location_value[memory_location_index] = machine_code
        immediate_value = hex(int(iv_ml, 16))[2:]
        immediate_value = fill_zero(immediate_value)
        address = hex(int(address, 16) + 1)
        address_list.append(f"{address[2:]}")
        machine_code_list.append(immediate_value)
        machine_code_list_1.append(immediate_value)
        memory_location_index = memory_location_list.index(address[2:])
        memory_location_value[memory_location_index] = immediate_value
        return machine_code, immediate_value, None
    elif byte == "THREE":
        machine_code = fill_zero(machine_code)
        address_list.append(f"{address}")
        memory_location_index = memory_location_list.index(address)
        memory_location_value[memory_location_index] = machine_code
        machine_code_list.append(machine_code)
        machine_code_list_1.append(machine_code)
        memory_location = iv_ml
        higher_byte, lower_byte = split_address(memory_location)
        lower_byte = hex(int(lower_byte, 16))[2:]
        lower_byte = fill_zero(lower_byte)
        higher_byte = hex(int(higher_byte, 16))[2:]
        higher_byte = fill_zero(higher_byte)
        machine_code_list.append(lower_byte)
        machine_code_list_1.append(lower_byte)
        address = hex(int(address, 16) + 1)
        address_list.append(f"{address[2:]}")
        memory_location_index = memory_location_list.index(address[2:])
        memory_location_value[memory_location_index] = lower_byte
        address = hex(int(address, 16) + 1)
        address_list.append(f"{address[2:]}")
        machine_code_list.append(higher_byte)
        machine_code_list_1.append(higher_byte)
        memory_location_index = memory_location_list.index(address[2:])
        memory_location_value[memory_location_index] = higher_byte
        return machine_code, lower_byte, higher_byte
    elif byte == None:
        return machine_code, None, None

def address_8085():
    print("-----ADDRESS-----")
    global address_list
    global mnemonic
    global program_address_list
    program_address_list = []
    address = hex(int((input("Enter address: ")), 16))
    while True:
        mnemonic = input("\n"f"{address[2:]}: ")
        if mnemonic == "EXIT":
            break
        byte = byte_8085(mnemonic)
        if byte != "error":
            program_address_list.append(f"{address[2:]}")    
            program.append(f"{address[2:]}:{mnemonic}")    
            machine_code, next_address_1, next_address_2 = MN_to_MC(address[2:], mnemonic)
            print(machine_code, next_address_1, next_address_2)  
        if byte == 1:
            address = hex(int(address, 16) + int("1",16))
        elif byte == 2:
            address = hex(int(address, 16) + int("2",16))
        elif byte == 3:
            address = hex(int(address, 16) + int("3",16))
    print(f"Program = {program}")
    print(f"Address list = {address_list}")
    print(f"Machine code list = {machine_code_list_1}")
    print(f"Program address list = {program_address_list}")

def instruction_encoder(machine_code):
    print("Encoding Instruction...")
    print(f"Machine code = {machine_code}")
    one_byte_list = ["00", "80", "81", "82", "83", "84", "85", "86", "87", "AO", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "2F", "B8", "B9", "BA", "BB", "BC", "BD", "BE", "BF", "09", "19", "29", "39", "05", "0D", "15", "1D", "25", "2D", "35", "3D", "0B", "1B", "2B", "3B", "76", "04", "0C", "14", "1C", "24", "2C", "34", "3C", "03", "13", "23", "33", "0A", "1A", "78", "79", "7A", "7B", "7C", "7D", "7E", "7F", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4A", "4B", "4C", "4D", "4E", "4F", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5A", "5B" ,"5C", "5D", "5E", "5F", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6A", "6B", "6C", "6D", "6E", "6F", "70", "71", "72", "73", "74", "75", "76", "77", "07", "0F", "B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "02", "12", "90", "91", "92", "93", "94", "95", "96", "97", "EB", "A8", "A9", "AA", "AB", "AC", "AD", "AE", "AF"]
    two_byte_list_1 = ["C6", "D6", "E6", "F6", "EE", "FE"]
    two_byte_list_2 = ["06", "0E", "16", "1E", "26", "2E", "36", "3E"]
    three_byte_list_1 = ["22", "2A", "32", "3A", "C2", "C3", "CA", "D2", "DA", "E2", "EA", "F2", "FA"]
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
        if machine_code == "3A":
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

def MC_to_MN(start_address):
    print("Converting to Mnemonic...")
    global program, address_list
    program = []
    address = hex(int(start_address, 16))[2:]
    while True:
        address_index = memory_location_list.index(address)
        machine_code = memory_location_value[address_index]
        machine_code = fill_zero(machine_code)
        machine_code = machine_code.upper()
        print(f"Machine code = {machine_code}")
        byte, mnemonic_opcode = instruction_encoder(machine_code) # iv_ml means immediate_value or memory_location
        if byte == "ONE":
            address_list.append(f"{address}")
            print(f"{address}:{mnemonic_opcode}")
            program.append(f"{address}:{mnemonic_opcode}")
            address = hex(int(address, 16) + 1)[2:]
            if mnemonic_opcode == "HLT":
                break
        elif byte == "TWO_1":
            address_list.append(f"{address}")
            machine_code = memory_location_value[int(address, 16)]
            mnemonic = mnemonic_opcode + " " + str(machine_code).zfill(2)
            print(f"{address}:{mnemonic}")
            program.append(f"{address}:{mnemonic}")
            address = hex(int(address, 16) + 1)[2:]
            address_list.append(f"{address[2:]}")
            address = hex(int(address, 16) + 1)[2:]
        elif byte == "TWO_2":
            address_list.append(f"{address}")
            machine_code = memory_location_value[int(address, 16)]
            mnemonic = mnemonic_opcode + "," + str(machine_code).zfill(2)
            print(f"{address}:{mnemonic}")
            program.append(f"{address}:{mnemonic}")
            address = hex(int(address, 16) + 1)[2:]
            address_list.append(f"{address[2:]}")
            address = hex(int(address, 16) + 1)[2:]
        elif byte == "THREE_1":
            address_1 = address
            address_list.append(f"{address}")
            address = hex(int(address, 16) + 2)[2:]
            machine_code = memory_location_value[int(address, 16) - 1]
            machine_code = fill_zero(machine_code)
            machine_code = machine_code.upper()
            mnemonic = str(machine_code).zfill(2)
            address_list.append(f"{address}")
            address = hex(int(address, 16) - 1)[2:]
            machine_code = memory_location_value[int(address, 16) - 1]
            machine_code = fill_zero(machine_code)
            machine_code = machine_code.upper()
            mnemonic = mnemonic + str(machine_code).zfill(2)
            mnemonic = hex(int(mnemonic, 16))[2:]
            mnemonic = mnemonic_opcode + " " + mnemonic
            print(f"{address_1}:{mnemonic}")
            program.append(f"{address_1}:{mnemonic}")
            address = hex(int(address, 16) + 2)[2:]
        elif byte == "THREE_2":
            address_1 = address
            address_list.append(f"{address}")
            address = hex(int(address, 16) + 2)[2:]
            machine_code = memory_location_value[int(address, 16) - 1]
            machine_code = fill_zero(machine_code)
            machine_code = machine_code.upper()
            mnemonic = str(machine_code).zfill(2)
            address_list.append(f"{address}")
            address = hex(int(address, 16) - 1)[2:]
            machine_code = memory_location_value[int(address, 16) - 1]
            machine_code = fill_zero(machine_code)
            machine_code = machine_code.upper()
            mnemonic = mnemonic + str(machine_code).zfill(2)
            mnemonic = hex(int(mnemonic, 16))[2:]
            mnemonic = mnemonic_opcode + "," + mnemonic
            print(f"{address_1}:{mnemonic}")
            program.append(f"{address_1}:{mnemonic}")
            address = hex(int(address, 16) + 2)[2:]
        elif byte == None:
            address_list.append(f"{address}")
            address = hex(int(address, 16) + 1)[2:]
            
    print(f"Address List = {address_list}")
    print(f"Program = {program}")

def execute_8085():
    print("-----EXECUTE-----")
    global p_c
    start_address = input("Start address: ")
    p_c = 0
    MC_to_MN(start_address)
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
            p_c = JMP(instruction)
        elif opcode == "JP":
            p_c = JC(instruction)
            if p_c == "A":
                p_c = program_address_list.index(address_code)
                p_c = p_c + 1
        elif opcode == "JM":
            p_c = JC(instruction)
            if p_c == "A":
                p_c = program_address_list.index(address_code)
                p_c = p_c + 1
        elif opcode == "JPE":
            p_c = JC(instruction)
            if p_c == "A":
                p_c = program_address_list.index(address_code)
                p_c = p_c + 1
        elif opcode == "JPO":
            p_c = JC(instruction)
            if p_c == "A":
                p_c = program_address_list.index(address_code)
                p_c = p_c + 1                            
        elif opcode == "JC":
            p_c = JC(instruction)
            if p_c == "A":
                p_c = program_address_list.index(address_code)
                p_c = p_c + 1
        elif opcode == "JNC":
            p_c = JNC(instruction)
            if p_c == "A":
                p_c = program_address_list.index(address_code)
                p_c = p_c + 1
        elif opcode == "JZ":
            p_c = JZ(instruction)
            if p_c == "A":
                p_c = program_address_list.index(address_code)
                p_c = p_c + 1
        elif opcode == "JNZ":
            p_c = JNZ(instruction)
            if p_c == "A":
                p_c = program_address_list.index(address_code)
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
            print("-----HLT-----")
            break
        if opcode != "JMP" and opcode != "JC" and opcode != "JNC" and opcode != "JZ" and opcode != "JNZ":
            p_c = p_c + 1
                
    details = input("Do you want to see more details? [Y/N] : ")
    if details == "Y":
        print(f"A = {reg_value[0]} flag = {reg_value[1]}")
        print(f"B = {reg_value[2]} C = {reg_value[3]}")
        print(f"D = {reg_value[4]} E = {reg_value[5]}")
        print(f"H = {reg_value[6]} L = {reg_value[7]}")

def memory_address_M(mode):
    if mode == 0:
        print("Storing the value to Memory address...")
        reg_value[6] = fill_zero(reg_value[6])
        reg_value[7] = fill_zero(reg_value[7])
        M_address = str(reg_value[6]) + str(reg_value[7])
        M_index = memory_location_list.index(M_address)
        memory_location_value[M_index] = reg_value[8]
        print(f"[H] = {reg_value[6]}, [L] = {reg_value[7]}")
        print(f"[M] = [{M_address}] = {reg_value[8]}")
    elif mode == 1:
        print("Retrieving the value from Memory address...")
        reg_value[6] = fill_zero(reg_value[6])
        reg_value[7] = fill_zero(reg_value[7])
        M_address = str(reg_value[6]) + str(reg_value[7])
        M_index = memory_location_list.index(M_address)
        reg_value[8] = memory_location_value[M_index]
        print(f"[M] = [{M_address}] = {reg_value[8]}")
        print(f"[H] = {reg_value[6]}, [L] = {reg_value[7]}")

while True:
    print("\n""Press any of the given key: A - Address, G - Execute, M - Memory, R - Register")
    key = input()
    if key == "A":
        address_8085()
    elif key == "G":
        execute_8085()
    elif key == "M":
        memory_8085()
    elif key == "R":
        print(f"A = {reg_value[0]} flag = {reg_value[1]}")
        print(f"B = {reg_value[2]} C = {reg_value[3]}")
        print(f"D = {reg_value[4]} E = {reg_value[5]}")
        print(f"H = {reg_value[6]} L = {reg_value[7]}")
