let portraits = document.getElementsByClassName("portrait")
let portraitJeeper = portraits[1]
let myNameIs = document.getElementById("my-name-is")
let name = document.getElementById("name")
let surname = document.getElementById("surname")
let intro = document.getElementById("introduction")


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

function update() {

	portraitJeeper.style.opacity = ( window.innerHeight * 0.05 + 100 - window.scrollY) / 100
	if (window.scrollY > 100){
		myNameIs.textContent= "Some may know me as"
		name.textContent= "Dev"
		surname.textContent= "Jeeper"
	}else{
		myNameIs.textContent= "My name is"
		name.textContent= "Simon"
		surname.textContent= "Rahnasto"
	}

	if (window.scrollY > 800){
		intro.style.position = "absolute"
		intro.style.top = "800px"
		intro.style.width = "100%"
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
