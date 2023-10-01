global A, flag, B, C, D, E, H, L
global reg_list, reg_value
A = b'\x00'
flag = b'\x00'
B = b'\x00'
C = b'\x01'
D = b'\x00'
E = b'\x00'
H = b'\x00'
L = b'\x00'
reg_list = ["A", "flag", "B", "C", "D", "E", "H", "L"]
reg_value = [A, flag, B, C, D, E, H, L]

def MOV(mnemonic):
    mnemonic = mnemonic.split()
    mnemonic = mnemonic[1].split(",")
    reg_1 = mnemonic[0]
    reg_2 = mnemonic[1]
    reg_1 = reg_list.index(reg_1)
    reg_2 = reg_list.index(reg_2)
    reg_value[reg_1] = reg_value[reg_2]

def MVI(mnemonic, address_location_list, address_value_list):
    mnemonic = mnemonic.split()
    operand = mnemonic[1].split(",")
    print(mnemonic, operand)
    reg_1 = reg_list.index(operand[0])
    print(reg_1)
    if len(operand[1]) == 2:
        operand[1] = int(operand[1])
        reg_value[reg_1] = hex(operand[1])
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
    global address
    global mnemonic
    global program
    program = []
    address = input("Enter starting address: ")
    mnemonic = input("Enter mnemonic: ")
    while True:
        program.append(f"{address}:{mnemonic}")
        print(program)
        mnemonic = input()
        if mnemonic == "exit":
            break
        byte = byte_8085(mnemonic)
        if byte == 1:
            address = int(address) + 1
        elif byte == 2:
            address = int(address) + 2
        elif byte == 3:
            address = int(address) + 3
    return program

def memory_8085(address_location, address_value):
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
    machine_cycles = len(program)
    for machine_code in program:
        mnemonic = machine_code.split(":")
        address_code = mnemonic[0]
        instruction = mnemonic[1]
        opcode = instruction.split()[0]
        print(machine_cycles, mnemonic, instruction, opcode)
        if  opcode == "MOV":
            MOV(instruction)
        elif opcode == "MVI":
            MVI(instruction, address_location_list, address_value_list)
        # elif opcode == ["HLT"]:
        #     break

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