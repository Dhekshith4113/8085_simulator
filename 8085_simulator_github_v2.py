global A, flag, B, C, D, E, H, L, M
global reg_list, reg_value, address_location_list, address_value_list, address_list
global program, program_counter
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
M = hex(int(reg_value[6], 16) + int(reg_value[7], 16))
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
    print(f"A = {reg_value[0]}")
    if len(reg_value[0]) == 3:
        set_flag_status("CY", 1)
    elif len(reg_value[0]) == 4:
        set_flag_status("CY", 2) # not complete
    check_accumulator()    
    
def ADI(mnemonic):
    print("-----ADI-----")
    mnemonic = mnemonic.split()
    immediate_value = mnemonic[1]
    if len(str(immediate_value)) == 2:
        reg_value[0] = hex(int(reg_value[0], 16) + int(immediate_value, 16))[2:]
        print(f"A = {reg_value[0]}")
        if len(reg_value[0]) == 3:
            set_flag_status("CY", 1)
        elif len(reg_value[0]) == 4:
            set_flag_status("CY", 2) # not complete
    else:
        print("Invalid value: Expected value is one byte hexadecimal value")
    check_accumulator()    

def DCR(mnemonic): # problem
    print("-----DCR-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    reg_value[0] = hex(1)
    value = hex(int(reg_value[reg_1], 16) - int(reg_value[0], 16))
    print(flag)
    if value == "0":
        set_flag_status("Z", 1) # not complete
    print(flag)
    check_accumulator()
    
def INR(mnemonic): # problem
    print("-----INR-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    print(reg_1)
    reg_value[reg_1] = hex(int(reg_value[reg_1], 16) + int("1", 16))[2:]
    print(reg_value[reg_1][2:])
    if reg_value[reg_1][2:] > hex(int("FF", 16))[2:]:
        set_flag_status("CY", 1)
    elif reg_value[reg_1][2:] < hex(int("FFF", 16))[2:] and reg_value[reg_1][2:] > hex(int("FF", 16))[2:] :
        set_flag_status("CY", 2) # not complete
    else:
        set_flag_status("CY", 0)
    check_accumulator()
        
def JMP(mnemonic):
    print("-----JMP-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    jmp_to = address_list.index(jmp_address)
    return jmp_to
    
def JC(mnemonic): #problem
    print("-----JC-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    if flag[7] == 1 or flag[6] == 1:
        jmp_to = address_list.index(jmp_address)
        return jmp_to
    
def JNC(mnemonic): # problem
    print("-----JNC-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    if flag[7] == 0 and flag[6] == 0:
        jmp_to = address_list.index(jmp_address)
        return jmp_to
    
def JZ(mnemonic): #problem
    print("-----JZ-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    if flag[1] == 1:
        jmp_to = address_list.index(jmp_address)
        return jmp_to
    
def JNZ(mnemonic): # problem
    print("-----JNZ-----")
    mnemonic = mnemonic.split()
    jmp_address = mnemonic[1]
    flag_status = get_flag_status("Z")
    if flag_status != "1":
        jmp_to = address_list.index(jmp_address)
        return jmp_to           
        
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
    print(mnemonic, operand)
    reg_1 = reg_list.index(operand[0])
    print(reg_1)
    if len(operand[1]) == 2:
        print(operand[1])
        operand[1] = hex(int(operand[1], 16))
        reg_value[reg_1] = operand[1]
        print(reg_1)
        print(reg_value[reg_1])
    elif len(operand[1]) == 4:
        print(operand[1])
        reg_temp = address_location_list.index(operand[1])
        print(reg_temp)
        reg_value[reg_1] = address_value_list[reg_temp]
        print(reg_value[reg_1])

def check_accumulator():
    if reg_value[0] == hex(0)[2:]:
        set_flag_status("Z", 1)
    elif reg_value[0] != hex(0)[2:]:
        set_flag_status("Z", 0)
    if reg_value[0] > hex(255)[2:]:
        set_flag_status("CY", 1)
    elif reg_value[0] <= hex(255)[2:]:
        set_flag_status("CY", 0)

def byte_8085(mnemonic):
    global one_byte
    global two_byte
    global three_byte
    t = 0
    mnemonic = mnemonic.split()
    opcode = mnemonic[0]
    one_byte = ["MOV", "ADD", "CMA", "INR", "INX", "DCR", "DCX", "LDAX", "HLT"]
    two_byte = ["MVI", "IN", "ADI", "ORI", "ACI"]
    three_byte = ["LDA", "LXI", "JMP","CALL", "LHLD", "JC", "JNC", "JZ", "JNZ"]
    if opcode in one_byte:
        print(opcode)
        t = 1
        return t
    elif opcode in two_byte:
        print(opcode)
        t = 2
        return t
    elif opcode in three_byte:
        print(opcode)
        t = 3
        return t
    else:
        print("Syntax Error")

def address_8085():
    print("-----ADDRESS-----")
    global address
    global mnemonic
    address = hex(int((input("Enter starting address: ")), 16))
    mnemonic = str(input("Enter mnemonic: "))
    while True:
        address_list.append(f"{address[2:]}")
        program.append(f"{address[2:]}:{mnemonic}")
        print(program)
        mnemonic = input()
        if mnemonic == "exit":
            break
        byte = byte_8085(mnemonic)
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
        if address_location == "exit":
            print(address_location_list, address_value_list)
            return address_location_list, address_value_list
            break
        address_location_list.append(address_location)
        print("Enter value: ")
        address_value = str(input())
        address_value_list.append(address_value)

def execute_8085(program, address_list):
    print("-----EXECUTE_01-----")
    global program_counter
    n = 0
    machine_cycles = len(program)
    while True:
        program_counter = n
        machine_code = program[n]
        mnemonic = machine_code.split(":")
        address_code = mnemonic[0]
        instruction = mnemonic[1]
        opcode = instruction.split()[0]
        print(machine_cycles, mnemonic, instruction, opcode)
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
            m = JC(instruction)
        elif opcode == "JNC":
            m = JNC(instruction)
            if m == None:
                m = n
        elif opcode == "JZ":
            m = JZ(instruction)
        elif opcode == "JNZ":
            m = JNZ(instruction)
            if m == None:
                m = n
            n = m                   
        elif  opcode == "MOV":
            MOV(instruction)
        elif opcode == "MVI":
            MVI(instruction, address_location_list, address_value_list)
        elif opcode == "HLT":
            break
        n = n + 1    
    details = input("Do you want to see more details? [Y/N] : ")
    if details == "Y":
        print(f"A = {reg_value[0]} flag = {reg_value[1]}")
        print(f"B = {reg_value[2]} C = {reg_value[3]}")
        print(f"D = {reg_value[4]} E = {reg_value[5]}")
        print(f"H = {reg_value[6]} L = {reg_value[7]}")

def set_flag_status(flag_name, flag_value):
    if flag_name == "S":
        flag[0] = flag_value
    elif flag_name == "Z":
        flag[1] = flag_value
    elif flag_name == "AC":
        if flag_value == 0:
            flag[2] = 0
            flag[3] = 0
        elif flag_value == 1:
            flag[2] = 0
            flag[3] = 1
        elif flag_value == 2:
            flag[2] = 1
            flag[3] = 0
        elif flag_value == 3:
            flag[2] = 1
            flag[3] = 1
    elif flag_name == "P":
        if flag_value == 0:
            flag[4] = 0
            flag[5] = 0
        elif flag_value == 1:
            flag[4] = 0
            flag[5] = 1
        elif flag_value == 2:
            flag[4] = 1
            flag[5] = 0
        elif flag_value == 3:
            flag[4] = 1
            flag[5] = 1
    elif flag_name == "CY":
        if flag_value == 0:
            flag[6] = 0
            flag[7] = 0
        elif flag_value == 1:
            flag[6] = 0
            flag[7] = 1
        elif flag_value == 2:
            flag[6] = 1
            flag[7] = 0
        elif flag_value == 3:
            flag[6] = 1
            flag[7] = 1
    print(flag)        

def get_flag_status(flag_name):
    print(flag)
    if flag_name == "S":
        flag_status = flag[0]
    elif flag_name == "Z":
        flag_status = flag[1]
    elif flag_name == "AC":
        flag_status = flag[2] + flag[3]
    elif flag_name == "P":
        flag_status = flag[4] + flag[5]
    elif flag_name == "CY":
        flag_status = flag[6] + flag[7]
    return flag_status             

def go_8085():
    pass

while True:
    print("Press any of the given key: AD - Address, EX - Execute, G - Go, M - Memory""\n""A, flag, B, C, D, E, H, L")
    key = input()
    if key == "AD":
        address_8085()
    elif key == "EX":
        execute_8085(program, address_list)    
    elif key == "G":
        go_8085()
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
