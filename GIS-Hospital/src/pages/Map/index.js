import React, { useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
// import Icon from '../../assets/image.png';
import Icon from '../../assets/hospital.svg';

import './index.css';

function GetIcon(_iconSize) {
	return L.icon({
		iconUrl: Icon,
		iconSize: _iconSize,
	});
}

const Map = ({ sites, onClickSite }) => {
	const position = [32.011261, 34.774811];

	return (
		<MapContainer
			center={position}
			zoom={9}
			scrollWheelZoom={true}
			style={{ borderRadius: '20px', boxShadow: '0 0 50px 0 grey', margin: '1rem auto' }}
		>
			<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{sites?.map((site) => {
				const capacityColor = site.capacity < 40 ? 'free' : site.capacity < 80 ? 'partial' : 'full';
				return (
					<Marker position={site.position} key={site.id} icon={GetIcon(28)}>
						<Popup>
							<div className="description-wrapper">
								<span className="title" onClick={() => onClickSite(site)}>
									{site.name}
								</span>
								<span className="description">{site.description}</span>
								{site.website && (
									<span>
										Website: {' '}
										<a href={site.website} target="_blank">
											Click here
										</a>
									</span>
								)}
								<span className={capacityColor}>
									Capacity{' '}
									{site.capacity}%
								</span>
							</div>
						</Popup>
					</Marker>
				);
			})}
		</MapContainer>
	);
};

export default Map;
