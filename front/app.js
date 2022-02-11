const name = prompt('Cual es tu name')

const socket = io('http://localhost:8010')


socket.emit('userName', name)

//PARTICIPANNTES y PTS
let usersHtml = document.getElementById('users')

socket.on('users', ({users}) => {
  console.log(users);
  usersHtml.innerHTML = ''
  for (const x in users) {
    usersHtml.innerHTML += `<p>${users[x].name}: ${users[x].pts}</p>`
    console.log(users[x].name);      
  }
})


// CHAT
const btnEnter = document.getElementById('btnEnter')
const msg = document.getElementById('msg')
const boxMsg = document.getElementById('boxMsg')

btnEnter.addEventListener('click', (e) => {
  e.preventDefault( )
  if(msg.value == '') return;

  socket.emit('msg', {msg: msg.value})
  msg.value = '' 


})

socket.on('msg', ({msg, user}) => {
  boxMsg.innerHTML += `<p>${user}: ${msg}</p>`

})



// DIBUJAR
const canvas = document.getElementById('lienzo')
const ctx = canvas.getContext('2d')
let posX = 0;
let posY = 0;
let isDraw = false;

socket.on('initDraw', move => {
  ctx.beginPath()
  ctx.moveTo(move[0], move[1])
})

socket.on('draw', move => {
  
  ctx.lineTo(move[0], move[1])  
  //ctx.lineCap = "round"
  //ctx.lineJoin = "round"
  ctx.lineWidth = 7
  ctx.stroke()
  console.log('a')
})

canvas.addEventListener('mousedown', (e) => {
  isDraw = true  
  e.preventDefault()
  socket.emit('initDraw', {move: [e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop]})
})

canvas.addEventListener('mousemove', (e) => {
  if(isDraw)
  {
    socket.emit('draw', {move: [e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop]})
  }
})


canvas.addEventListener('mouseup', (e) => {
  if(isDraw)
  {
    isDraw = false

  }
})
