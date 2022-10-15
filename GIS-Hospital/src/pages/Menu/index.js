import React, { useState, useEffect } from 'react';
import { getDistance, convertDistance } from 'geolib';

import Map from '../Map';
import Data from '../../data/data.json';

import Symbol from '../../assets/hospital.png';
import './index.css';

const Menu = () => {
	const [searchValue, setSearchValue] = useState('');
	const [choosenSite, setChooseSite] = useState(null);
	const [availableSites, setAvailableSites] = useState([]);
	const [currentPosition, setCurrentPosition] = useState(null);
	const [distanceFromSite, setDistanceFromSite] = useState(null);
	const [openingHours, setOpeningHours] = useState([]);
	const [selectedOpeningHours, setSelectedOpeningHours] = useState('');
	const [cities, setCities] = useState([]);
	const [selectedCity, setSelectedCity] = useState('');
	const [areas, setAreas] = useState([]);
	const [selectedArea, setSelecteArea] = useState('');
	const [currentFilter, setCurrentFilter] = useState('name');

	/**
	 * @description Initialized opening departments & cities & areas
	 */
	useEffect(() => {
		let availableDepartments = [];
		let cities = [];
		let areas = [];

		for (let hospital of Data) {
			
			for (let department of hospital.departments) {
				if (!availableDepartments.includes(department)) {
					availableDepartments.push(department);
				}
			}
			if (!cities.includes(hospital.city)) {
				cities.push(hospital.city);
			}
			if (!areas.includes(hospital.area)) {
				areas.push(hospital.area);
			}
		}

		setOpeningHours(availableDepartments.sort());
		setCities(cities.sort());
		setAreas(areas.sort());

	}, [Data]);

	/**
	 * @description Setting the user's current position
	 */
	useEffect(() => {
		navigator.geolocation.getCurrentPosition((position) =>
			setCurrentPosition([position.coords.latitude, position.coords.longitude])
		);
	}, []);

	/**
	 * @description Once searchValue changes, getting and setting the relevant available sites
	 */
	useEffect(() => {
		if (searchValue) {
			let newAvailableSites = [];

			for (const site of Data) {
				if (site.name.includes(searchValue)) {
					newAvailableSites.push(site);
				}
			}
			setAvailableSites(newAvailableSites);

			if (newAvailableSites.length) {
				setDistanceFromSite(
					parseInt(
						convertDistance(getDistance(currentPosition, newAvailableSites[0].position), 'km')
					)
				);
				setChooseSite(newAvailableSites[0]);
			}
		} else {
			setAvailableSites(Data);
		}
	}, [searchValue]);

	/**
	 * @description Setting the new search value
	 * @param {Event} e HTMLInputChange event
	 */
	const onChangeSearchValue = (e) => {
		setSearchValue(e.target.value);
	};

	/**
	 * @description Changes the opening hours & getting the new available sites according to chosen opening hours
	 * @param {Event} e HTMLInputChange event
	 */
	const onChangeOpeningHours = (e) => {
		setSelectedOpeningHours(e.target.value);
		let newAvailableSites = [];

		if (e.target.value) {
			for (const site of Data) {
				if (site.departments.includes(e.target.value)) {
					newAvailableSites.push(site);
				}
			}
		}

		if (newAvailableSites.length) {
			setDistanceFromSite(
				parseInt(convertDistance(getDistance(currentPosition, newAvailableSites[0].position), 'km'))
			);
			setChooseSite(newAvailableSites[0]);
		}

		setAvailableSites(newAvailableSites);
	};

		/**
	 * @description Changes the area & getting the new available hospital according to chosen area
	 * @param {Event} e HTMLInputChange event
	 */
		 const onChangeArea = (e) => {
			setSelecteArea(e.target.value);
			let newAvailableSites = [];
	
			if (e.target.value) {
				for (const site of Data) {
					if (site.area === e.target.value) {
						newAvailableSites.push(site);
					}
				}
			}
	
			if (newAvailableSites.length) {
				setDistanceFromSite(
					parseInt(convertDistance(getDistance(currentPosition, newAvailableSites[0].position), 'km'))
				);
				setChooseSite(newAvailableSites[0]);
			}
	
			setAvailableSites(newAvailableSites);
		};

	/**
	 * @description Getting the distance from site (between the user current position & the site's position)
	 * @param {Object} site Chosen site
	 */
	const onClickSite = (site) => {
		setDistanceFromSite(
			parseInt(convertDistance(getDistance(currentPosition, site.position), 'km'))
		);
		setChooseSite(site);
	};

	/**
	 * @description Changes the selected city & getting the new available sites according to chosen city
	 * @param {Event} e HTMLInputChange event
	 */
	const onChangeCity = (e) => {
		setSelectedCity(e.target.value);
		let newAvailableSites = [];

		for (const site of Data) {
			if (site.city === e.target.value) {
				newAvailableSites.push(site);
			}
		}

		if (newAvailableSites.length) {
			setDistanceFromSite(
				parseInt(convertDistance(getDistance(currentPosition, newAvailableSites[0].position), 'km'))
			);
			setChooseSite(newAvailableSites[0]);
		}

		setAvailableSites(newAvailableSites);
	};

	/**
	 * @description Changed the main filter
	 * @param {Event} e HTMLInputChange event
	 */
	const onChangeFilter = (e) => {
		setCurrentFilter(e.target.value);
	};

	return (
		<div className="menu__container">
			<div className="menu__search-bar">
				<div className="search-selector">

					<div className="symbol">
						<img src={Symbol} alt="symbol" className="symbol-img" />
					</div>
					<div className="symbol1-img">
						<img src={Symbol} alt="symbol1" className="symbol1-img" />
					</div>
					<span>אנא בחר את הסינון הרלוונטי על פיו תרצה למצוא את בית החולים :</span>
					<select defaultValue="name" className="main-filter" onChange={onChangeFilter}>
						<option value="name">שם בית החולים</option>
						<option value="openingHours">מחלקה</option>
						<option value="city">עיר</option>
						<option value="area">אזור</option>
					</select>
					{currentFilter === 'name' ? (
						<input
							type="text"
							placeholder="הקלד את הבית חולים המבוקש"
							onChange={onChangeSearchValue}
							value={searchValue}
						/>
					) :  currentFilter === 'area' ? (
						<div className="opening-hours-wrapper">
							<select
								name="areas"
								onChange={onChangeArea}
								defaultValue=""
								value={selectedArea}
							>
								<option value={''}>בחר אזור</option>
								{areas?.map((site, index) => {
									return (
										<option value={site} key={index}>
											{site}
										</option>
									);
								})}
							</select>
						</div>):
						currentFilter === 'openingHours' ? (
						<div className="opening-hours-wrapper">
							<select
								name="openingHours"
								onChange={onChangeOpeningHours}
								defaultValue=""
								value={selectedOpeningHours}
							>
								<option value={''}>בחר מחלקה</option>
								{openingHours?.map((site, index) => {
									return (
										<option value={site} key={index}>
											{site}
										</option>
									);
								})}
							</select>
						</div>
					) : (
						<div className="cities-wrapper">
							<select name="city" onChange={onChangeCity} defaultValue="" value={selectedCity}>
								<option value="">בחר עיר</option>
								{cities?.map((site, index) => {
									return (
										<option value={site} key={index}>
											{site}
										</option>
									);
								})}
							</select>
						</div>
					)}
					<div className="menu__search-results">
						<b>{choosenSite && `${choosenSite.name} נמצא במרחק ${distanceFromSite} ק"מ ממך`}</b>
					</div>
				</div>
			</div>
			<Map sites={availableSites} onClickSite={onClickSite} />
		</div>
	);
};

export default Menu;
