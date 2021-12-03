let portraits = document.getElementsByClassName("portrait")
let portraitJeeper = portraits[1]
let myNameIs = document.getElementById("my-name-is")
let name = document.getElementById("name")
let surname = document.getElementById("surname")
let intro = document.getElementById("introduction")
let scrollDown = document.getElementById("scroll-down-column")


for (var i = 0; i < portraits.length; i++) {
   portraits.item(i).animate([
	  // keyframes
		{
		  	borderWidth: '430px',
		},
		{
			borderWidth: '380px',
		},
	], {
	  // timing options
	  duration: 300,
	  iterations: 1,
	})
}
let kebab = true
function update() {
	portraitJeeper.style.opacity = (100 - window.scrollY) / 100
	if (window.scrollY > 10){
		myNameIs.textContent= "Some may know me as"
		name.textContent= "Dev"
		surname.textContent= "Jeeper"
	}else{
		myNameIs.textContent= "My name is"
		name.textContent= "Simon"
		surname.textContent= "Rahnasto"
	}

	if (window.scrollY > window.innerHeight * 0.25){
		intro.style.position = "absolute"
		intro.style.top = window.innerHeight * 0.25 + "px"
		intro.style.width = "100%"
		let scrollDownPos = scrollDown.getBoundingClientRect();
		scrollDown.style.position = "absolute"
		if(kebab){
			kebab = false
			scrollDown.style.top = scrollDownPos.top + "px"
		}

	}else{
		intro.style.position = "fixed"
		intro.style.top = "0px"
	}
}

function frame() {
  update()
  requestAnimationFrame(frame)
}

frame()
