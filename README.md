This is an 8085 simulator that simulates the 8085 microprocessor.
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
