const textTop = document.getElementById("lcdTop")
const buttons = document.querySelectorAll('.btn')
const textBottom = document.getElementById('lcdBottom')

const escape = document.querySelector('.escape')
const backSpace = document.querySelector('.backspace')
const enter = document.querySelector('.enter')
const space = document.querySelector('.space')

function memory8085() {
    console.log("-----MEMORY/EDIT-----")
    textTop.innerHTML = "  MEMORY/EDIT  "
    textBottom.value = "ADDRESS: 0000"
}

function address8085() {
    console.log("-----ADDRESS-----")
    textTop.innerHTML = "ENTER STARTING"
    textBottom.value = "ADDRESS: 0000"
}

let string = ''

backSpace.addEventListener('click', () => {
    string = string.substring(0, string.length - 1)
    textBottom.value = string
})

space.addEventListener('click', () => {
    string += ' '
    textBottom.value = string
})

// string += btn.innerText
// textBottom.value = string
// console.log(string)

buttons.forEach(btn => {
    btn.addEventListener('click',(e) => {
        if (e.target.innerText === 'M') {
            memory8085()
        } else if (e.target.innerText === 'A') {
            address8085()
        }
    })
})
