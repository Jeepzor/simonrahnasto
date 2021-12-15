let portraits = document.getElementsByClassName("portrait")
let portraitJeeper = portraits[1]
let myNameIs = document.getElementById("my-name-is")
let name = document.getElementById("name")
let surname = document.getElementById("surname")
let intro = document.getElementById("introduction")
let scrollDown = document.getElementById("scroll-down-column")

let socialButtons = document.getElementsByClassName("social-button")
let hoverCircles = document.getElementsByClassName("hover-circle")
let socialDef = document.getElementsByClassName("social-def")
let timeline = new TimelineMax()

let socialLinks = [
	"https://github.com/Jeepzor",
	"https://youtube.com/DevJeeper",
	"https://www.linkedin.com/in/simon-rahnasto-2b0b4018a/",
	"https://windmillgames.itch.io/"
];


for (var i = 0; i < portraits.length; i++) {
	let current = portraits.item(i)
	timeline.fromTo(current, 1, {borderWidth: '430px'},
		{borderWidth: '380px', ease: Power2.easeOut})
}

class SocialButton{
	constructor(id, button, hover, def, link){
    	this.id = id
    	this.button = button
    	this.hover = hover
    	this.def = def
		this.link = link

		this.button.addEventListener('mouseenter', e => {
			document.getElementById("body").style.cursor = "pointer";
			gsap.to(this.hover, 0.2,
	 		  {width: '100px', ease: Power2.easeOut}, '-=0.2')
	 	  	gsap.to(this.def, 0.2,
	 		  {x: '90px', ease: Power2.easeOut},)
		});

		this.button.addEventListener('click', e => {
			window.open(this.link);
		});

		this.button.addEventListener('mouseleave', e => {
			document.getElementById("body").style.cursor = "initial";
			gsap.to(this.hover, 0.2,
				{width: '0px', ease: Power2.easeOut}, '-=0.2')

			gsap.to(this.def, 0.2,
				{x: '0px', ease: Power2.easeOut}, )
		});
   }
}

let activeSocialButtons = []
for (var i = 0; i < socialButtons.length; i++) {
	activeSocialButtons[i] = new SocialButton(i, socialButtons.item(i),
		hoverCircles.item(i), socialDef.item(i), socialLinks[i])
}

let kebab = true
let storedHeight = window.innerHeight
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
		let scrollDownPos = scrollDown.getBoundingClientRect();

		intro.style.position = "absolute"
		intro.style.top = window.innerHeight * 0.25 + "px"
		intro.style.width = "100%"

		if (window.scrollY > window.innerHeight * 0.5) {
			scrollDown.style.display = "none"
		}else{
			scrollDown.style.position = "absolute"
		}

		if(kebab){
			kebab = false
			scrollDown.style.display = ""
			scrollDown.style.top = scrollDownPos.top + "px"
		}

	}else{
		scrollDown.style.display = ""
		kebab = true
		intro.style.position = "fixed"
		intro.style.top = "0px"
	}
}

function frame() {
  update()
  requestAnimationFrame(frame)
}

frame()
