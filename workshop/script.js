document.addEventListener("DOMContentLoaded", async (event) => {
	console.log("Jag körs när sidan laddas in!")
	alert("Hejsan, gud vad jobbig jag är! Detta stannar inläsningen av html sidan")
	
	const data = await fetch(`https://www.student.hig.se/~25adel02/workshops`);
	
	const html = await data.text();
	
	console.log(html);
})