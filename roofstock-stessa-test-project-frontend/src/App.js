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

const Formfield = ({ formName, label, placeholder, value, type="text", onChange }) => {
	return (
		<div className="formfield">
			<label htmlFor={formName} className="formfield--label">{label}</label>
			<input type={type} name={formName} id={formName} placeholder={placeholder} value={value} className="formfield--input" onChange={onChange}/>
		</div>
	)
}

const App = () => {
	const [fromAddressForm, setFromAddressForm] = React.useState({
		name: {
			label: "Name: ",
			value: "",
			placeholder: "John Smith",
		},
		company: {
			label: "Company: ",
			value: "",
			placeholder: "EasyPost",
		},
		street1: {
			label: "Street 1: ",
			value: "",
			placeholder: "417 MONTGOMERY ST",
		},
    street2: {
			label: "Street 2: ",
			value: "",
			placeholder: "FLOOR 5",
		},
    city: {
			label: "City: ",
			value: "",
			placeholder: "SAN FRANCISCO",
		},
    state: {
			label: "State: ",
			value: "",
			placeholder: "CA",
		},
    zip: {
			label: "ZIP: ",
			value: "",
			placeholder: "94104",
		},
    country: {
			label: "Country: ",
			value: "",
			placeholder: "US",
		},
    phone: {
			label: "Phone: ",
			value: "",
			placeholder: "4151234567",
		},
		email: {
			label: "Email Address: ",
			value: "",
			placeholder: "johnsmith@easypost.com",
		},
	});
	const [toAddressForm, setToAddressForm] = React.useState({
		name: {
			label: "Name: ",
			value: "",
			placeholder: "Jane Smith",
		},
		company: {
			label: "Company: ",
			value: "",
			placeholder: "Roofstock",
		},
		street1: {
			label: "Street 1: ",
			value: "",
			placeholder: "179 N Harbor Dr",
		},
    street2: {
			label: "Street 2: ",
			value: "",
			placeholder: "Apt 3",
		},
    city: {
			label: "City: ",
			value: "",
			placeholder: "Redondo Beach",
		},
    state: {
			label: "State: ",
			value: "",
			placeholder: "CA",
		},
    zip: {
			label: "ZIP: ",
			value: "",
			placeholder: "90277",
		},
    country: {
			label: "Country: ",
			value: "",
			placeholder: "US",
		},
    phone: {
			label: "Phone: ",
			value: "",
			placeholder: "4155559999",
		},
		email: {
			label: "Email Address: ",
			value: "",
			placeholder: "janesmith@roofstock.com",
		},
	});
	const [parcelForm, setParcelForm] = React.useState({
		length: {
			label: "Length (in inches): ",
			value: 0,
			placeholder: 8,
		},
    width: {
			label: "Width (in inches): ",
			value: 0,
			placeholder: 5,
		},
    height: {
			label: "Height (in inches): ",
			value: 0,
			placeholder: 5,
		},
    weight: {
			label: "Weight (in lbs): ",
			value: 0,
			placeholder: 5,
		},
	});
	const [labelUrl, setLabelUrl] = React.useState("");
	const [trackingNumber, setTrackingNumber] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);

	const labelSectionRef = useRef(null)

	useEffect(() => {
		isLoading && handleGetRate()
	}, [isLoading])

	useEffect(() => {
		trackingNumber && handleScroll()
	}, [trackingNumber])

	const handleUpdateFormfield = (event, setStateFn, fieldName) => {
		const { value } = event.target
		setStateFn(prevState => ({
			...prevState,
			[fieldName]: {
				...prevState[fieldName],
				value: value
			}
		}))
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
			setLabelUrl(responseJSON.labelUrl)
			setTrackingNumber(responseJSON.trackingNumber)
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
				value: prevState[fieldName].placeholder
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
							onChange={e => handleUpdateFormfield(e, setFromAddressForm, fieldName)}
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
							onChange={e => handleUpdateFormfield(e, setToAddressForm, fieldName)}
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
							onChange={e => handleUpdateFormfield(e, setParcelForm, fieldName)}
							unit={parcelForm[fieldName].unit}
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