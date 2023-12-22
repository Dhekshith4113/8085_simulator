
# 8085 Simulator Kit

This is a simulator that simulates the 8085 microprocessor. There are two versions of this project; one done in Python and another one in JavaScript. JavaScript version has two types LCD and SSD (Seven Segment Display). The simulator is built for educational purposes and helps students understand Assembly Language Programming. Keep in mind that this simulator is more focused towards mobile phone users. 

## How to use it?
As mentioned before there are 2 versions, Python & JavaScript. Although the methods are the same, each one is slightly different.
### 01. Python
To use the Python version you could download it and run it from a code editor or terminal. _Make sure to turn ON your Caps Lock._ It's simple to understand. There are 5 options: _ASSEMBLE, REGISTER VIEW, SINGLE STEP, GO EXECUTE and MEMORY VIEW/EDIT._

**ASSEMBLE:** To write an Assembly Language Program (ALP) first, type '_A_' and hit '_Enter_'. You'll be asked to enter the starting address. Type the desired starting address and hit '_Enter_'. Type in the mnemonics and hit '_Enter_'. After you've completed typing your code on the next address type '_EXIT_' to exit from writing the ALP.

**MEMORY VIEW/EDIT:** To write data to or read data from the RAM type '_M_' and hit '_Enter_'. After that, you'll be asked to enter the desired memory address, type that in and hit '_Enter_'. If you want to change a value type that in and hit '_Enter_' or if you want to keep it as such hit '_Enter_'. After you've completed writing data or reading data, on the next address type '_EXIT_' to exit.

**REGISTER VIEW:** To view what values your registers hold, type '_R_' and hit '_Enter_'. The values of registers will appear. In the beginning, all registers will have zero as their values.

**GO EXECUTE:** To execute/run your program, type '_G_' and hit '_Enter_'. You'll be asked to enter the starting address,  type it and hit '_Enter_'. You can see the program is built and executed till it finds an 'HLT' or reaches the address 'FFFF'. After that, you'll asked whether you need additional details, if you type '_Y_' it'll show the register, program counter and stack contents.

**SINGLE STEP:** This option allows you to execute/run your program instruction-by-instruction. Hit '_Enter_' to execute the subsequent instruction and so on. To exit either press the '_Esc_' button or the '_RESET_' button. If it finds '_HLT_' it's the same as that of '_GO EXECUTE_'.

And that's it. That's what all you need to know to write and execute an ALP.

Please note that you can  also type machine codes if you want to. For that, go to '_MEMORY VIEW/EDIT_', type the starting address and enter your opcodes.

Also note when typing '_JMP_', '_CALL_', etc..., type the address where you want to execute the next instruction. For example, if you're at address '_410A_' and you would like to execute another instruction at the address '_8000_' if there is a carry generated due to the previous instruction, type '_JC 8000_'.

As usual, the values must be given as '_hexadecimal_'.

### 02. JavaScript
There are 2 versions for JavaScript, LCD and SSD. The link to the website is given below. It is the same as that on the left side... https://dhekshith4113.github.io/8085_simulator/
#### a) LCD simulator kit
It might look like there are many options available, but only '_A_', '_G_', '_M_', '_R_', and '_S_' are functional. They work in the same way as the Python version but to exit from an option hit the '_Esc_' button. To enter an address and a hexadecimal value you have to hit '_BackSpace_' and then type the values. After hitting '_Enter_' for '_GO EXECUTE_' press the '_RESET_' button. You can press '_RESET_' anytime and it won't reset your register or RAM values. If you are running the website on a PC, press '_Ctrl + Shift +I_' or '_Settings > Developer Tools_' and go to '_console_' to see the program doing its things.
### b) SSD simulator kit
Here only '_SUB_', '_REG_', '_GO_', '_EXEC_', '_NEXT_' and '_RST_' are functional. 

To enter an ALP you should press '_SUB_' and type your starting address and press '_NEXT_'. Enter your opcode and press '_NEXT_' and so on. After you've entered your opcodes press '_RST_' to exit. The procedure is the same if you want to write data to or read data from the RAM.

To execute/run a program press '_GO_' and type your starting address and press '_EXEC_'. And then '_RST_'. As with the LCD simulator, if you're running the website on a PC, press '_Ctrl + Shift +I_' or '_Settings > Developer Tools_' and go to '_console_' to see the program doing its things.

To view register contents, press the '_REG_' button and press the bottom buttons which have '_A_', '_B_', '_C_', '_D_', '_E_', '_H_', '_L_'. Press on each one to see their contents.

And that's it. 

## Things to remember
Pressing '_RESET_' or '_RST_' will reset the contents of registers or RAM but refreshing the website will. 

There are 246 opcodes for the 8085 microprocessor out of which only 232 opcodes can be used. The remaining 14 opcodes are '_IN_', '_OUT_', '_EI_', '_DI_', '_RIM_', '_SIM_', '_RST 0 to 7_'. They're not implemented since they require interrupts or peripheral devices. You could still write it and if the program encounters one while executing, it will show '_The instruction "{instruction}" ({opcode}) at memory location "{address}" is not provided by the developer..._'.

## Project Progress
Started on 27/09/2023 Wednesday.

Updated on 01/10/2023 Sunday.

Updated on 05/10/2023 Thursday.

Updated on 10/10/2023 Tuesday ( Jump instructions do not work yet ).

Updated on 10/10/2023 Tuesday ( JNZ instruction works ).

Updated on 11/10/2023 Wednesday ( Jump instructions, increment, decrement works. Added LDA, STA, SUB, SUI instructions ).

Updated on 12/10/2023 Thursday ( Added LXI, STAX, LHLD, SHLD instructions ).

Updated on 16/10/2023 Monday ( Added CMA, compare instructions, logical instructions, LDAX instruction. SUB instruction works as expected. There are problems with jump instructions ).

Updated on 16/10/2023 Monday ( Added RRC and RLC instructions. Jump instruction's problem fixed. There are problems with SHLD instruction ).

Updated on 17/10/2023 Tuesday ( Made a new version V3. It can convert mnemonics to machine code. The memory/edit function does not work yet ).

Updated on 18/10/2023 Wednesday ( Made some changes to V3. The memory/edit function works. In V2, SHLD and DAD work as expected ).

Updated on 19/10/2023 Thursday ( Made some changes to memory function ).

Updated on 21/10/2023 Saturday ( All instructions work in the 8085_simulator_v3. Some instructions like stack pointer, CALL, RET, interrupts, etc... are not added yet. Now I'll make an app that simulates the 8085 microprocessor with displays, keypads, etc... ).

Updated on 02/11/2023 Thursday (Added CALL and RET instructions and their conditional counterparts. I've saved these changes in 8085_simulator.py And added stack pointer and LXI SP instruction ).

Updated on 03/11/2023 Friday ( Added PUSH and POP instructions. I've saved these changes in 8085_simulator.py . PSW operand is now available ).

Updated on 02/12/2023 Saturday ( Completed the entire simulator website using HTML, CSS and JavaScript. Note: Only A, M, G, and R operations are available ).

Updated on 14/12/2023 Thursday ( Optimized the Python and JavaScript Program. I also made a Seven Segment Display version of the LCD simulator. Made the  UI as elegant and accurate as the 8085 kits in my college lab. Added some functions like Single Step. Now I might complete the instruction set and add some additional functions ).

Updated on 21/12/2023 Thursday ( Optimized the code a little more and changed the stack handling to a better one. Added more instructions like PCHL, DAA, XTHL and SPHL. Completed the instruction set and left a few instructions like EI, DI, RST, IN and OUT since they require interrupts or peripheral devices. Also made the UI a bit more user-friendly. )
