
import {html} from "lit"
import type {Signal} from "@e280/strata"
import {createRef, ref} from "lit/directives/ref.js"
import {shadow, useCss, useMount, useOnce, useSignal} from "@e280/sly"

import styleCss from "./style.css.js"
import {AssistantProgressReport, Message} from "./parts/types.js"
import {createLazyModel, getQuestionInput} from "./parts/utils.js"


export const Assistant = shadow((open: Signal<boolean>) => {
	useCss(styleCss)

	const model = useOnce(createLazyModel)
	const list = useOnce(() => createRef<HTMLElement>())

	const busy = useSignal(false)
	const minimized = useSignal(false)
	const messages = useSignal<Message[]>([])
	const progress = useSignal<AssistantProgressReport | undefined>(undefined)

	useMount(() => () => void model.dispose())

	function scrollToLatest() {
		requestAnimationFrame(() =>
			list.value?.scrollTo(0, list.value.scrollHeight)
		)
	}

	function setMessages(next: Message[]) {
		messages.value = next
		scrollToLatest()
	}

	function close() {
		open.value = false
		minimized.value = false
	}

	function toggleMinimized() {
		minimized.value = !minimized.value
	}

	async function send(event: SubmitEvent) {
		event.preventDefault()

		const input = getQuestionInput(event.currentTarget as HTMLFormElement)
		const question = input.value.trim()

		if (!question || busy.value)
			return

		input.value = ""
		busy.value = true

		const history: Message[] = [
			...messages.value,
			{role: "user", content: question},
		]

		function showAnswer(content: string) {
			setMessages([
				...history,
				{role: "assistant", content},
			])
		}

		let answer = ""
		showAnswer("")

		try {
			const assistant = await model.get()

			await assistant.ask(
				question,
				report => progress.value = report,
				token => {
					answer += token
					showAnswer(answer)
				},
			)
		}
		catch (error) {
			showAnswer(
				error instanceof Error
					? error.message
					: "The assistant could not start."
			)
		}
		finally {
			busy.value = false
			progress.value = undefined
		}
	}

	if (!open.value)
		return null


	function renderMessage({role, content}: Message) {
		return html`
			<article class=${role}>
				<strong>${role === "user" ? "You" : "Omniclip AI"}</strong>
				<p>${content || "Thinking…"}</p>
			</article>
		`
	}

	return html`
		<aside class="assistant-panel" ?data-minimized=${minimized.value}>
			<header>
				<strong><span>✦</span> Omniclip AI</strong>

				<div>
					<button
						title=${minimized.value ? "Restore" : "Minimize"}
						@click=${toggleMinimized}>
						${minimized.value ? "+" : "−"}
					</button>

					<button title="Close" @click=${close}>
						×
					</button>
				</div>
			</header>

			<section class="messages" ${ref(list)}>
				${messages.value.length
					? messages.value.map(renderMessage)
					: html`
						<div class="welcome">
							<strong>How can I help?</strong>
							<span>The first message downloads a local model.</span>
						</div>
					`
				}
			</section>

			<form @submit=${send}>
				${progress.value
					? html`
						<small>
							${progress.value.text}
							${Math.round(progress.value.progress * 100)}%
						</small>
					`
					: null
				}

				<input
					name="question"
					placeholder="Ask about Omniclip…"
					?disabled=${busy.value}
				/>

				<button
					class="send"
					title="Send"
					?disabled=${busy.value}>
					➤
				</button>
			</form>
		</aside>
	`
})

