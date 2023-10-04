global A, flag, B, C, D, E, H, L
global reg_list, reg_value, address_location_list, address_value_list
A = hex(0) #b'\x00'
flag = hex(0) #b'\x00'
B = hex(0) #b'\x00'
C = hex(1) #b'\x01'
D = hex(0) #b'\x00'
E = hex(0) #b'\x00'
H = hex(0) #b'\x00'
L = hex(0) #b'\x00'
reg_list = ["A", "flag", "B", "C", "D", "E", "H", "L"]
reg_value = [A, flag, B, C, D, E, H, L]
address_location_list = []
address_value_list = []

def ADD(mnemonic):
    print("-----ADD-----")
    mnemonic = mnemonic.split()
    reg_1 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    reg_value[0] = hex(int(reg_value[0], 16) + int(reg_value[reg_1], 16))
    print(f"A = {reg_value[0]}")
    
def ADI(mnemonic):
    print("-----ADI-----")
    mnemonic = mnemonic.split()
    immediate_value = mnemonic[1]
    if len(str(immediate_value)) == 2:
        reg_value[0] = hex(int(reg_value[0], 16) + int(immediate_value, 16))
        print(f"A = {reg_value[0]}")
    else:
        print("Invalid value: Expected value is one byte hexadecimal value")
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

def byte_8085(mnemonic):
    global one_byte
    global two_byte
    global three_byte
    t = 0
    mnemonic = mnemonic.split()
    opcode = mnemonic[0]
    one_byte = ["MOV", "ADD", "CMA", "INR", "INX", "LDAX"]
    two_byte = ["MVI", "IN", "ADI", "ORI", "ACI"]
    three_byte = ["LDA", "LXI", "JMP","CALL", "LHLD", "JNZ"]
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
    global program
    program = []
    address = str(input("Enter starting address: "))
    mnemonic = str(input("Enter mnemonic: "))
    while True:
        program.append(f"{address}:{mnemonic}")
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
    return program

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

def execute_8085(program):
    print("-----EXECUTE-----")
    machine_cycles = len(program)
    for machine_code in program:
        mnemonic = machine_code.split(":")
        address_code = mnemonic[0]
        instruction = mnemonic[1]
        opcode = instruction.split()[0]
        print(machine_cycles, mnemonic, instruction, opcode)
        if opcode == "ADD":
            ADD(instruction)
        elif opcode == "ADI":
            ADI(instruction) 
        elif  opcode == "MOV":
            MOV(instruction)
        elif opcode == "MVI":
            MVI(instruction, address_location_list, address_value_list)
        # elif opcode == ["HLT"]:
        #     break
    details = input("Do you want to see more details? [Y/N] : ")
    if details == "Y":
        print(f"A = {reg_value[0]} B = {reg_value[2]} C = {reg_value[3]}")
        print(f"D = {reg_value[4]} E = {reg_value[5]} F = {reg_value[6]}")
        print(f"flag = {reg_value[1]}")

def set_flag_status(flag, flag_name, flag_value):
    print(flag)
    
    if flag_name == "S":
        if flag_value == "1":
            flag_S = hex(128)
        else:
            flag_S = hex(0)    
    if flag_name == "Z":
        if flag_value == "1":
            flag_Z = hex(64)
        else:
            flag_Z = hex(0)
    if flag_name == "AC":
        if flag_value == "00":        
            flag_AC = hex(0)
        elif flag_value == "01":
            flag_AC = hex(16)
        elif flag_value == "10":
            flag_AC = hex(32)
        elif flag_value == "11":
            flag_AC = hex(48)
    if flag_name == "P":
        if flag_value == "00":        
            flag_P = hex(0)
        elif flag_value == "01":
            flag_P = hex(4)
        elif flag_value == "10":
            flag_P = hex(8)
        elif flag_value == "11":
            flag_P = hex(12)
    if flag_name == "CY":
        if flag_value == "00":        
            flag_CY = hex(0)
        elif flag_value == "01":
            flag_CY = hex(1)
        elif flag_value == "10":
            flag_CY = hex(2)
        elif flag_value == "11":
            flag_CY = hex(3)
    flag =  flag_S + flag_Z + flag_AC + flag_P + flag_CY
    
def get_flag_status(flag, flag_name):
    flag_string = str(flag)
    flag_hex = int(flag_string, 16)
    flag_binary = format(flag, 'b')
    print(binary_string)
    flag_sign = flag_binary
    flag_zero = flag_binary
    flag_carry = flag_binary
    S = flag_sign >> 7
    Z = flag_zero << 1
    Z = flag_zero >> 7
    C = flag_carry << 6
    C = flag_carry >> 6
    return S, Z, C

def go_8085():
    pass

while True:
    print("Press any of the given key: AD - Address, EX - Execute, G - Go, M - Memory""\n""A, flag, B, C, D, E, H, L")
    key = input()
    if key == "AD":
        address_8085()
    elif key == "EX":
        execute_8085(program)
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