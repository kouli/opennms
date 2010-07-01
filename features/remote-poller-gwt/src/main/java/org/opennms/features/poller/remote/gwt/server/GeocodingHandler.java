/**
 * 
 */
package org.opennms.features.poller.remote.gwt.server;

import java.util.Date;

import org.opennms.core.utils.LogUtils;
import org.opennms.features.poller.remote.gwt.client.GWTLatLng;
import org.opennms.features.poller.remote.gwt.client.remoteevents.GeocodingFinishedRemoteEvent;
import org.opennms.features.poller.remote.gwt.client.remoteevents.GeocodingUpdatingRemoteEvent;
import org.opennms.netmgt.model.OnmsMonitoringLocationDefinition;

import de.novanic.eventservice.service.EventExecutorService;

class GeocodingHandler implements LocationDefHandler {
	private final LocationDataService m_locationDataService;
	private final EventExecutorService m_eventService;
	private int m_size;
	private Date m_date;
	private int m_count;
	
	/**
	 * <p>Constructor for GeocodingHandler.</p>
	 *
	 * @param locationDataService a {@link org.opennms.features.poller.remote.gwt.server.LocationDataService} object.
	 * @param eventService a {@link de.novanic.eventservice.service.EventExecutorService} object.
	 */
	public GeocodingHandler(final LocationDataService locationDataService, final EventExecutorService eventService) {
		m_locationDataService = locationDataService;
		m_eventService = eventService;
		m_date = new Date();
		m_count = 0;
	}
	
	/** {@inheritDoc} */
	public void start(final int size) {
		m_size = size;
		m_eventService.addEventUserSpecific(new GeocodingUpdatingRemoteEvent(0, size));
	}

	/**
	 * <p>handle</p>
	 *
	 * @param def a {@link org.opennms.netmgt.model.OnmsMonitoringLocationDefinition} object.
	 */
	public void handle(final OnmsMonitoringLocationDefinition def) {
		final GWTLatLng latLng = m_locationDataService.getLatLng(def, false);
		if (latLng != null) {
			def.setCoordinates(latLng.getCoordinates());
		}
		final Date now = new Date();
		if (now.getTime() - m_date.getTime() >= 500) {
			m_eventService.addEventUserSpecific(new GeocodingUpdatingRemoteEvent(m_count, m_size));
			LogUtils.debugf(this, "initializing locations (" + m_count + "/" + m_size + ")");
			m_date = now;
		}
		m_count++;
	}
	
	/**
	 * <p>finish</p>
	 */
	public void finish() {
		m_eventService.addEventUserSpecific(new GeocodingFinishedRemoteEvent(m_size));
	}
}
