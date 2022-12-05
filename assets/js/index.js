const subscribeForm = document.getElementById('subscribe-form')
const subscribeHeader = document.querySelector('.subscribe-header')
const successfulSubscribeMsg = document.querySelector('.subscribed-msg')
const subscribeBtn = subscribeForm.querySelector("input[type='submit']");

subscribeForm.addEventListener('submit', async (event) => {
	event.preventDefault()
	subscribeBtn.setAttribute("loading", "true");
	subscribeBtn.value = "doing some magic..."

	const formData = Object.fromEntries(new FormData(subscribeForm));
	console.log(formData)

	const response = await fetch('/.netlify/functions/add-subscriber', {
		method: 'POST',
		body: JSON.stringify({ name: formData.name, email: formData.email })
	})
		.then(response => response.json())


	subscribeBtn.setAttribute("loading", "false")
	subscribeBtn.value = "Subscribe"


	if (response.status === 200) {
		subscribeForm.reset()
		subscribeHeader.classList.add("subscribed")
		setTimeout(() => {
			subscribeHeader.classList.remove("subscribed")
		}, 3000)
		const jsConfetti = new JSConfetti()
		jsConfetti.addConfetti({
			emojis: ['🎉', '🦄', '🐸', '✨', '😮', '🍄'],
		})
		successfulSubscribeMsg.classList.remove("display-none");
	}
})
