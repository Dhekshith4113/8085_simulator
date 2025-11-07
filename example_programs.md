These are some example programs that you can run in the simulator. You can either write the opcode or the machine code.

### 01. Addition of two 8-bit numbers:
The 8-bit binary numbers are stored in locations 4501 and 4502. The HL pair is used as the address pointer, and register C is cleared to store the carry. The result obtained after the addition of data bytes is available in the accumulator. It is then stored in location 4503. The carry is stored in 4504.

| Memory Address | Machine Code | Mnemonics | Comments |
| --- | --- | --- | --- |
| 4100 | 21, 01, 45 | LXI H,4501 | Load the address of the first number in the HL pair |
| 4103 | 7E | MOV A,M | Move the first number to the accumulator |
| 4104 | 23 | INX H | Load the address of the second number in the HL pair |
| 4105 | 0E, 00 | MVI C,00 | Initialize register C to store the carry |
| 4107 | 86 | ADD M | Add first and second number, i.e, [A] + [M] |
| 4108 | D2, 0C, 41 | JNC 410C | If there is no carry, go to address 410C |
| 410B | OC | INR C | If there is a carry, increment register C |
| 410C | 32, 03, 45 | STA 4503 | Store the result available in the accumulator to the location 4503 |
| 410F | 79 | MOV A,C | Move content of the register C to the accumulator |
| 4110 | 32, 04, 45 | STA 4504 | Store the carry in the next location 4504 |
| 4113 | 76 | HLT | End of the program |

DATA:\
[4501] = 56\
[4502] = 40

RESULT:\
[4503] = 96\
[4504] = 00

When we add 56 in hexadecimal and 40 in hexadecimal, we get 96 in hexadecimal and no carry.

DATA:\
[4501] = 96\
[4502] = 99

RESULT:\
[4503] = 2F\
[4504] = 01

When we add 96 in hexadecimal and 99 in hexadecimal, we get 2F in hexadecimal and 01 as a carry. (96 + 99 = 12F)
