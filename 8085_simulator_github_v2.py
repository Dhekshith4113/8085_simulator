global A, flag, B, C, D, E, H, L, M
global reg_list, reg_value, address_location_list, address_value_list, address_list
global program, program_counter, p_c, flag_status
A = hex(0) #b'\x00'
flag = [0, 0, 0, 0, 0, 0, 0, 0] #b'\x00'
B = hex(0) #b'\x00'
C = hex(0) #b'\x01'
D = hex(0) #b'\x00'
E = hex(0) #b'\x00'
H = hex(0) #b'\x00'
L = hex(0) #b'\x00'
M = hex(0)
reg_list = ["A", "flag", "B", "C", "D", "E", "H", "L", "M"]
reg_value = [A, flag, B, C, D, E, H, L, M]
program = []
program_counter = []
address_list = []
address_location_list = []
address_value_list = []

def ADD(mnemonic):
    print("-----ADD-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    reg_value[0] = hex(int(reg_value[0], 16) + int(reg_value[reg_1], 16))[2:]
    if hex(int(reg_value[0], 16)) > hex(int("FF", 16)):
        reg_value[0] = hex(int(reg_value[0], 16) - int("100", 16))[2:]
    print(f"[A] = {reg_value[0]}")
    check_accumulator()    
    
def ADI(mnemonic):
    print("-----ADI-----")
    mnemonic = mnemonic.split()
    immediate_value = mnemonic[1]
    if len(str(immediate_value)) == 2:
        reg_value[0] = hex(int(str(reg_value[0]), 16) + int(str(immediate_value), 16))[2:]
    else:
        print("Invalid value: Expected value is one byte hexadecimal value")
    print(f"[A] = {reg_value[0]}")    
    check_accumulator()    

def DCR(mnemonic):
    print("-----DCR-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    reg_value[0] = int("1")
    reg_value[reg_1] = hex(int(reg_value[reg_1], 16) - reg_value[0])[2:]
    reg_value[0] = reg_value[reg_1]
    print(f"[{reg_list[reg_1]}] = {reg_value[reg_1]}")    
    check_accumulator()
    
def INR(mnemonic):
    print("-----INR-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    reg_value[reg_1] = hex(int(reg_value[reg_1], 16) + int("1", 16))[2:]
    print(f"[{reg_list[reg_1]}] = {reg_value[reg_1]}")    
    check_accumulator()
        
def JMP(mnemonic):
    print("-----JMP-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    jmp_to = address_list.index(jmp_address)
    print(f"Jump to [{jmp_address}]")
    return jmp_to
    
def JC(mnemonic):
    print("-----JC-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    print(f"Jump to [{jmp_address}]")
    if flag[7] == 1:
        p_c = address_list.index(jmp_address)
        return p_c
    elif flag[7] == 0:
        return "A"    
    
def JNC(mnemonic):
    print("-----JNC-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    print(f"Jump to [{jmp_address}]")
    if flag[7] == 0:
        p_c = address_list.index(jmp_address)
        return p_c
    elif flag[7] == 1:
        return "A"    
    
def JZ(mnemonic):
    print("-----JZ-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    print(f"Jump to [{jmp_address}]")
    if flag[1] == 1:
        p_c = address_list.index(jmp_address)
        return p_c
    elif flag[1] == 0:
        return "A"   
    
def JNZ(mnemonic):
    print("-----JNZ-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    print(f"Jump to [{jmp_address}]")
    if flag[1] == 0:
        p_c = address_list.index(jmp_address)
        return p_c
    elif flag[1] == 1:
        return "A"
        
def LDA(mnemonic):
    print("-----LDA-----")
    mnemonic = mnemonic.split()
    address = mnemonic[1]
    address_index = address_location_list.index(address)
    reg_value[0] = hex(int(address_value_list[address_index], 16))[2:]
        
def MOV(mnemonic):
    print("-----MOV-----")
    mnemonic = mnemonic.split()
    mnemonic = mnemonic[1].split(",")
    reg_1 = mnemonic[0]
    reg_2 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    reg_2 = reg_list.index(reg_2)
    reg_value[reg_1] = reg_value[reg_2]

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

def STA(mnemonic):
    print("-----STA-----")
    mnemonic = mnemonic.split()
    address = mnemonic[1]
    if address in address_location_list:
        address_index = address_location_list.index(address)
        address_value_list[address_index] = reg_value[0]
    elif address not in address_location_list:
        address_location_list.append(str(address))
        address_value_list.append(reg_value[0])

def SUB(mnemonic):
    print("-----SUB-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    if int(reg_value[0], 16) > int(reg_value[reg_1], 16):
        reg_value[0] = hex(int(reg_value[0], 16) - int(reg_value[reg_1], 16))[2:]
    else:
        reg_value[0] = hex(int(reg_value[0], 16) - int(reg_value[reg_1], 16))[3:]
        flag[0] = 1
        flag[1] = 1
    print(f"[A] = {reg_value[0]}")
    
def SUI(mnemonic):
    print("-----SUI-----")
    mnemonic = mnemonic.split()
    immediate_value = mnemonic[1]
    if len(str(immediate_value)) == 2:
        if int(reg_value[0], 16) > int(str(immediate_value), 16):
            reg_value[0] = hex(int(reg_value[0], 16) - int(str(immediate_value), 16))[2:]
        else:
            reg_value[0] = hex(int(reg_value[0], 16) - int(str(immediate_value), 16))[3:]
            flag[0] = 1
            flag[1] = 1
    else:
        print("Invalid value: Expected value is one byte hexadecimal value")
    print(f"[A] = {reg_value[0]}")

def check_accumulator():
    if reg_value[0][2:] == hex(0)[2:]:
        flag[1] = 1
    elif reg_value[0][2:] != hex(0)[2:]:
        flag[1] = 0
    if hex(int(str(reg_value[0]), 16)) > hex(255):
        flag[7] = 1
    elif hex(int(str(reg_value[0]), 16)) <= hex(255):
        flag[7] = 0

def byte_8085(mnemonic):
    global one_byte
    global two_byte
    global three_byte
    t = 0
    mnemonic = mnemonic.split()
    opcode = mnemonic[0]
    one_byte = ["MOV", "ADD", "CMA", "INR", "INX", "DCR", "DCX", "LDAX", "HLT", "SUB"]
    two_byte = ["MVI", "IN", "ADI", "ORI", "ACI", "SUI"]
    three_byte = ["LDA", "LXI", "STA", "JMP","CALL", "LHLD", "JC", "JNC", "JZ", "JNZ"]
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
    mnemonic = str(input("Enter mnemonic: "))
    while True:
        address_list.append(f"{address[2:]}")
        program.append(f"{address[2:]}:{mnemonic}")
        byte = byte_8085(mnemonic)
        if byte == "error":
            address_list.pop()
            program.pop() 
        print(program)
        mnemonic = input()
        if mnemonic == "EXIT":
            break
        if byte == 1:
            address = hex(int(address, 16) + int("1",16))
        elif byte == 2:
            address = hex(int(address, 16) + int("2",16))
        elif byte == 3:
            address = hex(int(address, 16) + int("3",16))
    print(address_list)        
    return program, address_list

def memory_8085(address_location, address_value):
    print("-----MEMORY-----")
    global address_location_list
    global address_value_list
    address_location_list =[]
    address_value_list = []
    while True:
        print("Enter address: ")
        address_location = str(input())
        if address_location == "EXIT":
            print(address_location_list, address_value_list)
            return address_location_list, address_value_list
            break
        address_location_list.append(address_location)
        print("Enter value: ")
        address_value = str(input())
        address_value_list.append(address_value)

def execute_8085(program, address_list):
    print("-----EXECUTE-----")
    global p_c
    p_c = 0
    machine_cycles = len(program)
    print(f"Start address: {address_list}")
    while True:
        reg_value[1] = [0, 0, 0, 0, 0, 0, 0, 0]
        machine_code = program[p_c]
        mnemonic = machine_code.split(":")
        address_code = mnemonic[0]
        instruction = mnemonic[1]
        opcode = instruction.split()[0]
        if opcode == "ADD":
            ADD(instruction)
        elif opcode == "ADI":
            ADI(instruction)
        elif opcode == "DCR":
            DCR(instruction)    
        elif opcode == "INR":
            INR(instruction)    
        elif opcode == "JMP":
            m = JMP(instruction)
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
        elif  opcode == "MOV":
            MOV(instruction)
        elif opcode == "MVI":
            MVI(instruction, address_location_list, address_value_list)
        elif opcode == "STA":
            STA(instruction) 
        elif opcode == "SUB":
            SUB(instruction)
        elif opcode == "SUI":
            SUI(instruction)    
        elif opcode == "HLT":
            break
        if opcode != "JMP" and opcode != "JC" and opcode != "JNC" and opcode != "JZ" and opcode != "JNZ":
            p_c = p_c + 1
                
    details = input("Do you want to see more details? [Y/N] : ")
    if details == "Y":
        print(f"A = {reg_value[0]} flag = {reg_value[1]}")
        print(f"B = {reg_value[2]} C = {reg_value[3]}")
        print(f"D = {reg_value[4]} E = {reg_value[5]}")
        print(f"H = {reg_value[6]} L = {reg_value[7]}")


while True:
    print("Press any of the given key: AD - Address, EX - Execute, G - Go, M - Memory""\n""A, flag, B, C, D, E, H, L")
    key = input()
    if key == "AD":
        address_8085()
    elif key == "GO":
        execute_8085(program, address_list)
    elif key == "M":
        address_location_list, address_value_list = memory_8085(address_location=None, address_value=None)
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
