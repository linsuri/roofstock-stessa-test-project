import React, { useEffect, useRef } from 'react';
import loadingSpinner from './loading-spinner.gif';
import './App.css';

const LoadingSpinner = () => {
	return (
		<div className="loading-spinner--overlay">
			<img className="loading-spinner--image" src={loadingSpinner} alt="Loading" width="200" />
		</div>
	)
}

const Formfield = ({ formName, label, placeholder, value, type="text", onChange, isError, errorMessage }) => {
	return (
		<div className="formfield">
			<label htmlFor={formName} className="formfield--label">{label}</label>
			<input type={type} name={formName} id={formName} placeholder={placeholder} value={value} className={`formfield--input${isError ? ' error' : ''}`} onChange={onChange} aria-describedby={`error-${formName}`} />
			{isError && <span id={`error-${formName}`} className="formfield--error-message">{errorMessage}</span>}
		</div>
	)
}

const App = () => {
	const [fromAddressForm, setFromAddressForm] = React.useState({
		name: {
			label: "Name: ",
			value: "",
			placeholder: "John Smith",
			errorMessage: "Required",
			isError: false,
		},
		company: {
			label: "Company: ",
			value: "",
			placeholder: "EasyPost",
			errorMessage: "Required",
			isError: false,
		},
		street1: {
			label: "Street 1: ",
			value: "",
			placeholder: "417 MONTGOMERY ST",
			errorMessage: "Required",
			isError: false,
		},
    street2: {
			label: "Street 2: ",
			value: "",
			placeholder: "FLOOR 5",
			errorMessage: "Required",
			isError: false,
		},
    city: {
			label: "City: ",
			value: "",
			placeholder: "SAN FRANCISCO",
			errorMessage: "Required",
			isError: false,
		},
    state: {
			label: "State: ",
			value: "",
			placeholder: "CA",
			errorMessage: "Required",
			isError: false,
		},
    zip: {
			label: "ZIP: ",
			value: "",
			placeholder: "94104",
			errorMessage: "Required",
			isError: false,
		},
    country: {
			label: "Country: ",
			value: "",
			placeholder: "US",
			errorMessage: "Required",
			isError: false,
		},
    phone: {
			label: "Phone: ",
			value: "",
			placeholder: "4151234567",
			errorMessage: "Required",
			isError: false,
		},
		email: {
			label: "Email Address: ",
			value: "",
			placeholder: "johnsmith@easypost.com",
			errorMessage: "Required",
			isError: false,
		},
	});
	const [toAddressForm, setToAddressForm] = React.useState({
		name: {
			label: "Name: ",
			value: "",
			placeholder: "Jane Smith",
			errorMessage: "Required",
			isError: false,
		},
		company: {
			label: "Company: ",
			value: "",
			placeholder: "Roofstock",
			errorMessage: "Required",
			isError: false,
		},
		street1: {
			label: "Street 1: ",
			value: "",
			placeholder: "179 N Harbor Dr",
			errorMessage: "Required",
			isError: false,
		},
    street2: {
			label: "Street 2: ",
			value: "",
			placeholder: "Apt 3",
			errorMessage: "Required",
			isError: false,
		},
    city: {
			label: "City: ",
			value: "",
			placeholder: "Redondo Beach",
			errorMessage: "Required",
			isError: false,
		},
    state: {
			label: "State: ",
			value: "",
			placeholder: "CA",
			errorMessage: "Required",
			isError: false,
		},
    zip: {
			label: "ZIP: ",
			value: "",
			placeholder: "90277",
			errorMessage: "Required",
			isError: false,
		},
    country: {
			label: "Country: ",
			value: "",
			placeholder: "US",
			errorMessage: "Required",
			isError: false,
		},
    phone: {
			label: "Phone: ",
			value: "",
			placeholder: "4155559999",
			errorMessage: "Required",
			isError: false,
		},
		email: {
			label: "Email Address: ",
			value: "",
			placeholder: "janesmith@roofstock.com",
			errorMessage: "Required",
			isError: false,
		},
	});
	const [parcelForm, setParcelForm] = React.useState({
		length: {
			label: "Length (in inches): ",
			value: parseFloat(0).toFixed(1),
			placeholder: parseFloat(8).toFixed(1),
			errorMessage: "Must be greater than 0",
			isError: false,
		},
    width: {
			label: "Width (in inches): ",
			value: parseFloat(0).toFixed(1),
			placeholder: parseFloat(5).toFixed(1),
			errorMessage: "Must be greater than 0",
			isError: false,
		},
    height: {
			label: "Height (in inches): ",
			value: parseFloat(0).toFixed(1),
			placeholder: parseFloat(5).toFixed(1),
			errorMessage: "Must be greater than 0",
			isError: false,
		},
    weight: {
			label: "Weight (in ounces): ",
			value: parseFloat(0).toFixed(1),
			placeholder: parseFloat(5).toFixed(1),
			errorMessage: "Must be greater than 0",
			isError: false,
		},
	});
	const [labelUrl, setLabelUrl] = React.useState("");
	const [trackingNumber, setTrackingNumber] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);

	const labelSectionRef = useRef(null)

	useEffect(() => {
		isLoading && handleValidate()
	}, [isLoading])

	useEffect(() => {
		trackingNumber && handleScroll()
	}, [trackingNumber])

	const handleUpdateFormfieldValue = (event, setStateFn, fieldName, validation) => {
		const { value } = event.target
		setStateFn(prevState => ({
			...prevState,
			[fieldName]: {
				...prevState[fieldName],
				value: !isNaN(Number(value)) ? parseFloat(value).toFixed(1) : value,
				isError: validation
			}
		}))
	}

	const handleUpdateFormfieldIsError = (value, setStateFn, fieldName) => {
		setStateFn(prevState => ({
			...prevState,
			[fieldName]: {
				...prevState[fieldName],
				isError: value
			}
		}))
	}

	const handleValidate = () => {
		if (
			Object.values(fromAddressForm).every(field => field.value.trim() !== "") &&
			Object.values(toAddressForm).every(field => field.value.trim() !== "") &&
			Object.values(parcelForm).every(field => field.value > 0)
		) {
			handleGetRate()
		} else {
			setIsLoading(false)

			Object.keys(fromAddressForm).forEach(fieldName => handleUpdateFormfieldIsError(fromAddressForm[fieldName].value.trim() === "", setFromAddressForm, fieldName))
			
			Object.keys(toAddressForm).forEach(fieldName => handleUpdateFormfieldIsError(toAddressForm[fieldName].value.trim() === "", setToAddressForm, fieldName))
			
			Object.keys(parcelForm).forEach(fieldName => handleUpdateFormfieldIsError(parcelForm[fieldName].value <= 0, setParcelForm, fieldName))
		}
	}

	const handleGetRate = async () => {
		const data = {
			from_address: {},
			to_address: {},
			parcel: {},
		}

		const handleFillData = (form, dataKeyName) => Object.keys(form).forEach(fieldName => data[dataKeyName][fieldName] = form[fieldName].value)

		handleFillData(fromAddressForm, "from_address")
		handleFillData(toAddressForm, "to_address")
		handleFillData(parcelForm, "parcel")

		try {
			const response = await fetch("/label", {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json'
				},
				redirect: 'follow',
				referrerPolicy: 'no-referrer',
				body: JSON.stringify(data)
			})
			const responseJSON = await response.json();
			if (responseJSON.labelUrl && responseJSON.trackingNumber) {
				setLabelUrl(responseJSON.labelUrl)
				setTrackingNumber(responseJSON.trackingNumber)
			} else {
				alert(`${responseJSON.status}: ${Object.values(responseJSON.errors).join(", ")}`)
			}
		} catch (err) {
			alert(err)
		}

		setIsLoading(false)
	}

	const handlePrefill = () => {
		const universalPrefill = (prevState) => {
			const filled = {}
			Object.keys(prevState).forEach(fieldName => filled[fieldName] = {
				...prevState[fieldName],
				value: prevState[fieldName].placeholder,
				isError: false,
			})
			return filled
		}
		setFromAddressForm(universalPrefill)
		setToAddressForm(universalPrefill)
		setParcelForm(universalPrefill)
	}

	const handleScroll = () => labelSectionRef.current && labelSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="app">
      <header className="app--header">
        <h1 className="app--header--title">
					Print a USPS Shipping Label
        </h1>
      </header>
			<main className="app--main">
				<form className="app--main--form from-address">
					<h2 className="app--main--form--title">From Address</h2>
					{Object.keys(fromAddressForm).map(fieldName => (
						<Formfield
							key={fieldName}
							formName={fieldName}
							label={fromAddressForm[fieldName].label}
							placeholder={fromAddressForm[fieldName].placeholder}
							value={fromAddressForm[fieldName].value}
							onChange={e => handleUpdateFormfieldValue(e, setFromAddressForm, fieldName, e.target.value.trim() === "")}
							isError={fromAddressForm[fieldName].isError}
							errorMessage={fromAddressForm[fieldName].errorMessage}
						/>
					))}
				</form>

				<form className="app--main--form to-address">
					<h2 className="app--main--form--title">To Address</h2>
					{Object.keys(toAddressForm).map(fieldName => (
						<Formfield
							key={fieldName}
							formName={fieldName}
							label={toAddressForm[fieldName].label}
							placeholder={toAddressForm[fieldName].placeholder}
							value={toAddressForm[fieldName].value}
							onChange={e => handleUpdateFormfieldValue(e, setToAddressForm, fieldName, e.target.value.trim() === "")}
							isError={toAddressForm[fieldName].isError}
							errorMessage={toAddressForm[fieldName].errorMessage}
						/>
					))}
				</form>

				<form className="app--main--form parcel">
					<h2 className="app--main--form--title">Parcel Dimensions and Weight</h2>
					{Object.keys(parcelForm).map(fieldName => (
						<Formfield
							key={fieldName}
							formName={fieldName}
							label={parcelForm[fieldName].label}
							placeholder={parcelForm[fieldName].placeholder}
							value={parcelForm[fieldName].value}
							type={"number"}
							onChange={e => handleUpdateFormfieldValue(e, setParcelForm, fieldName, e.target.value <= 0)}
							unit={parcelForm[fieldName].unit}
							isError={parcelForm[fieldName].isError}
							errorMessage={parcelForm[fieldName].errorMessage}
						/>
					))}
				</form>

				<button className="app--main--button prefill" onClick={handlePrefill}>Prefill With Test Data</button>
				<button className="app--main--button get-label" onClick={() => setIsLoading(true)}>Get Label at Lowest Rate</button>

				<div className="app--main--label-section" ref={labelSectionRef}>
					{trackingNumber && <p className="app--main--tracking-number">{`Tracking Number: ${trackingNumber}`}</p>}
					{labelUrl && <img className="app--main--label-image" src={labelUrl} alt="Your shipping label" width="500" />}
				</div>
			</main>

			{isLoading && <LoadingSpinner />}
    </div>
  );
}

export default App;