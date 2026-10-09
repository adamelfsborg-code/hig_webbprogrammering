document.addEventListener("DOMContentLoaded", () => {
	const body = document.querySelector('body');
	const dummy = document.getElementById('dummy')
	const input = document.querySelector('input[name="färger"]')
	
	
	const bg = localStorage.getItem("bg")
	if (bg && isHex(bg)) {
		body.style.backgroundColor = bg;
		dummy.style.backgroundColor = bg;
		input.value = bg;
	}
	
	
	
	input.addEventListener('input', (e) => {
		const hex = e.target.value;
		body.style.backgroundColor = hex;
		dummy.style.backgroundColor = hex;
		saveBG(hex)
	})
})

const isHex = (str) => {
	if (str === '') return false;
	
	if (str[0] !== '#') return false;
	
	if (str.length !== 4 && str.length !== 7) return false;
	
	return true;
}

const saveBG = (hex) => {
	if (!isHex(hex)) return;
	localStorage.setItem("bg", hex);
}