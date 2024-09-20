import React, { useEffect } from "react";
import { test } from "@jest/globals"
import { render } from "@testing-library/react"
import { AssistantProvicer, FormAssistant, UseUserAssistant } from './index'


test("testing button component", () => {
	render(<FormAssistant fields={[
		{
			name: "test",
			type: "Text",
		},
		{
			name: "test",
			type: "Multiline",
			lines: 2
		},
		{
			name: "dfdf"
		}
	]} />)
})

test("AssistantProvicer", () => {
	render(<AssistantProvicer>
		<div>test</div>
	</AssistantProvicer>)
})

function App() {

	console.log("log");

	return (
		<div className="App">
			<Header3 />
			<Button />
			<Header3 />
		</div>
	);
}

export default App;


const Header3 = () => {

	const { user } = UseUserAssistant()
	return <div> {user}</div>
}



const Button = () => {

	const { updateUser } = UseUserAssistant()

	useEffect(() => {
		updateUser(Date.now().toString())
	}, [])

	return <div onClick={() => updateUser(Date.now().toString())}> <button> Change </button></div>
}

