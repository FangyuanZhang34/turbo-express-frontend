import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode";
import { MAP_KEY } from '../constants.js';

Geocode.setApiKey( MAP_KEY );
Geocode.enableDebug();

export class Map extends Component{

	constructor( props ){
		super( props );
		this.state = {
            addressPU: '8116 Lincoln Way, San Francisco, CA 94122, USA',
            addressDO: '2086 Newpark Mall, Newark, CA 94560, USA',
			mapPosition: {
				lat: this.props.center.lat,
				lng: this.props.center.lng
			},
			pickUpMarkerPosition: {
				lat: this.props.center.lat,
				lng: this.props.center.lng
            },
            droppOffMarkerPosition: {
				lat: this.props.center.lat-0.03,
				lng: this.props.center.lng-0.03
            },
            zoom: 12.4
        }
        this.googleMap = React.createRef();
	}
	/**
	 * Get the current address from the default map position and set those values in the state
	 */
	// componentDidMount() {
    //     Geocode.fromLatLng( this.state.pickUpMarkerPosition.lat , this.state.pickUpMarkerPosition.lng).then(
	// 		response => {
	// 			const address = response.results[0].formatted_address;
	// 			this.setState( {
	// 				addressPU: ( address ) ? address : ''
	// 			} );
	// 		},
	// 		error => {
	// 			console.error( error );
	// 		}
    //     );
    //     Geocode.fromLatLng(this.state.droppOffMarkerPosition.lat , this.state.droppOffMarkerPosition.lng).then(
	// 		response => {
	// 			const address = response.results[0].formatted_address;

	// 			this.setState( {
	// 				addressDO: ( address ) ? address : ''
	// 			} );
	// 		},
	// 		error => {
	// 			console.error( error );
	// 		}
    //     );
	// };
	/**
	 * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
	 *
	 * @param nextProps
	 * @param nextState
	 * @return {boolean}
	 */
	shouldComponentUpdate( nextProps, nextState ){
		if (
            this.state.addressDO !== nextState.addressDO ||
            this.state.addressPU !== nextState.addressPU
		) {
			return true
		} else if ( this.props.center.lat === nextProps.center.lat ){
			return false
		}
	}

    onZoomChanged = () => {
        this.setState({
            zoom: this.googleMap.current.getZoom()
        });
      };

	/**
	 * When the marker is dragged you get the lat and long using the functions available from event object.
	 * Use geocode to get the address, city, area and state from the lat and lng positions.
	 * And then set those values in the state.
	 *
	 * @param event
	 */
	onPUMarkerDragEnd = ( event ) => {
		let newLat = event.latLng.lat(),
			newLng = event.latLng.lng();
        this.setState({
            pickUpMarkerPosition: {
                lat: newLat,
                lng: newLng
            },
            mapPosition: {
				lat: newLat,
				lng: newLng
			},
        });
		Geocode.fromLatLng( newLat , newLng ).then(
			response => {
				const address = response.results[0].formatted_address;
				this.setState( {
					addressPU: ( address ) ? address : ''
				} );
				this.props.changePULoc(address);
			},
			error => {
				console.error(error);
			}
		);
	};

    onDOMarkerDragEnd = ( event ) => {
		let newLat = event.latLng.lat(),
            newLng = event.latLng.lng();
        this.setState({
            droppOffMarkerPosition: {
                lat: newLat,
                lng: newLng
            },
            mapPosition: {
				lat: newLat,
				lng: newLng
			},
        });
		Geocode.fromLatLng( newLat , newLng ).then(
			response => {
				const address = response.results[0].formatted_address;
				this.setState( {
					addressDO: ( address ) ? address : ''
				} );
				this.props.changeFOLoc(address);
			},
			error => {
				console.error(error);
			}
        );
        this.props.needChangePageOffset(window.pageXOffset, window.pageYOffset);
    };


	render(){
		const AsyncMap = withScriptjs(
			withGoogleMap(
				props => (
					<GoogleMap google={ this.props.google }
					           defaultZoom={ this.state.zoom }
                               defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng}}
                               defaultOptions={{
                                mapTypeControl: false,
                                streetViewControl: false,
                                zoomControl: false,
                                fullscreenControl: false,
                              }}
                              center={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng}}
                              onZoomChanged={this.onZoomChanged}
                              ref={this.googleMap}
					>
						{/* InfoWindow on top of marker */}
						<InfoWindow
							onClose={this.onInfoWindowClose}
							position={{ lat: ( this.state.pickUpMarkerPosition.lat + 0.02/this.state.zoom), lng: this.state.pickUpMarkerPosition.lng }}
						>
							<div>
								<span style={{ padding: 0, margin: 0 }}>{ "Pickup: "+this.state.addressPU }</span>
							</div>
                        </InfoWindow>
                        <InfoWindow
							onClose={this.onInfoWindowClose}
							position={{ lat: ( this.state.droppOffMarkerPosition.lat + 0.02/this.state.zoom), lng: this.state.droppOffMarkerPosition.lng }}
						>
							<div>
								<span style={{ padding: 0, margin: 0 }}>{ "Droppoff: "+this.state.addressDO }</span>
							</div>
						</InfoWindow>
						{/*Marker*/}
                        <Marker 
                            google={this.props.google}
                            name={'pickup'}
                            draggable={true}
                            onDragEnd={ this.onPUMarkerDragEnd }
                            position={{ lat: this.state.pickUpMarkerPosition.lat, lng: this.state.pickUpMarkerPosition.lng }}
						/>
                        <Marker />
                        <Marker 
                            google={this.props.google}
                            name={'droppoff'}
                            draggable={true}
                            onDragEnd={ this.onDOMarkerDragEnd }
                            position={{ lat: this.state.droppOffMarkerPosition.lat, lng: this.state.droppOffMarkerPosition.lng }}
						/>
                        <Marker />

                        
					</GoogleMap>
				)
			)
		);
		let map;
		if( this.props.center.lat !== undefined ) {
            map = <div> 
				<AsyncMap
					googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}&libraries=places`}
					loadingElement={
						<div style={{ height: `100%` }} />
					}
					containerElement={
						<div style={{ height: this.props.height }} />
					}
					mapElement={
						<div style={{ height: `100%` }} />
                    }
				/>
			</div>
		} else {
			map = <div style={{height: this.props.height}} />
		}
		return( map )
	}
}
// https://medium.com/@imranhsayed/google-maps-in-react-autocomplete-location-search-draggable-marker-marker-infobox-565ab8e8cf22