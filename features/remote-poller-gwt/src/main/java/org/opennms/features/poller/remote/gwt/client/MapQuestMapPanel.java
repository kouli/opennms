package org.opennms.features.poller.remote.gwt.client;

import java.util.HashMap;
import java.util.Map;

import org.opennms.features.poller.remote.gwt.client.events.MapPanelBoundsChangedEvent;
import org.opennms.features.poller.remote.gwt.client.location.LocationInfo;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.logical.shared.ResizeEvent;
import com.google.gwt.event.logical.shared.ResizeHandler;
import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.SimplePanel;
import com.google.gwt.user.client.ui.Widget;
import com.googlecode.gwtmapquest.transaction.MQAIcon;
import com.googlecode.gwtmapquest.transaction.MQAInfoWindow;
import com.googlecode.gwtmapquest.transaction.MQALargeZoomControl;
import com.googlecode.gwtmapquest.transaction.MQALatLng;
import com.googlecode.gwtmapquest.transaction.MQAPoi;
import com.googlecode.gwtmapquest.transaction.MQAPoint;
import com.googlecode.gwtmapquest.transaction.MQARectLL;
import com.googlecode.gwtmapquest.transaction.MQATileMap;
import com.googlecode.gwtmapquest.transaction.event.ZoomEndEvent;
import com.googlecode.gwtmapquest.transaction.event.ZoomEndHandler;

public class MapQuestMapPanel extends Composite implements MapPanel {

    private static MapQuestMapPanelUiBinder uiBinder = GWT.create(MapQuestMapPanelUiBinder.class);
    
    @UiField
    SimplePanel m_mapHolder;
    
    private MQATileMap m_map;
    private Map<String, MQAPoi> m_markers = new HashMap<String, MQAPoi>();
    
    interface MapQuestMapPanelUiBinder extends UiBinder<Widget, MapQuestMapPanel> {}

    public MapQuestMapPanel(final HandlerManager eventBus) {
        initWidget(uiBinder.createAndBindUi(this));
        m_map = MQATileMap.newInstance(getMapHolder().getElement());
        
        initializeMap();
        
        m_map.addZoomEndHandler(new ZoomEndHandler() {
            
            public void onZoomEnd(ZoomEndEvent event) {
                eventBus.fireEvent(new MapPanelBoundsChangedEvent(getBounds()));
                
            }
        });
    }
    
    

    @Override
    protected void onLoad() {
        super.onLoad();
        syncMapSizeWithParent();
    }



    public MQATileMap getMapWidget() {
        return m_map;
    }

    public void initializeMap() {
        getMapHolder().setSize("100%", "100%");
        getMapWidget().addControl(MQALargeZoomControl.newInstance());
        getMapWidget().setZoomLevel(2);
        
        Window.addResizeHandler(new ResizeHandler() {
            public void onResize(ResizeEvent event) {
                syncMapSizeWithParent();
            }
        });
    }

    public void showLocationDetails(final Location location) {
        final MQAPoi point = getMarker(location);
    	
    	getMapWidget().setCenter(toMQALatLng(location.getLocationInfo().getLatLng()));
    	if (point != null) {
    		point.setInfoTitleHTML(location.getLocationInfo().getName() + " (" + location.getLocationInfo().getArea() + ")");
    		point.setInfoContentHTML("Status = " + location.getLocationInfo().getStatus().toString());
    		final MQAInfoWindow window = getMapWidget().getInfoWindow();
    		window.hide();
    		point.showInfoWindow();
    	}
    }

    private MQAPoi createMarker(Location location) {
        final LocationInfo locationInfo = location.getLocationInfo();
        
        final MQALatLng latLng = toMQALatLng(locationInfo.getLatLng());
        final MQAIcon icon = createIcon(locationInfo);
        final MQAPoi point = MQAPoi.newInstance(latLng, icon);
        point.setIconOffset(MQAPoint.newInstance(-16, -32));
        
        return point;
    }

    private MQAIcon createIcon(final LocationInfo locationInfo) {
        return MQAIcon.newInstance(locationInfo.getMarkerImageURL(), 32, 32);
    }

    public GWTBounds getBounds() {
        return toGWTBounds(m_map.getBounds());
    }
    
    public void setBounds(GWTBounds b) {
        m_map.zoomToRect(toMQARectLL(b));
    }
    
    @SuppressWarnings("unused")
    private static GWTLatLng toGWTLatLng(MQALatLng latLng) {
        return new GWTLatLng(latLng.getLatitude(), latLng.getLongitude());
    }
    
    private static MQALatLng toMQALatLng(GWTLatLng latLng) {
        return MQALatLng.newInstance(latLng.getLatitude(), latLng.getLongitude());
    }
    
    private static GWTBounds toGWTBounds(MQARectLL bounds) {
        BoundsBuilder bldr = new BoundsBuilder();
        bldr.extend(bounds.getUpperLeft().getLatitude(), bounds.getUpperLeft().getLongitude());
        bldr.extend(bounds.getLowerRight().getLatitude(), bounds.getLowerRight().getLongitude());
        
        return bldr.getBounds();
    }
    
    private static MQARectLL toMQARectLL(GWTBounds bounds) {
        MQALatLng latLng = toMQALatLng(bounds.getNorthEastCorner());
        
        MQARectLL mqBounds = MQARectLL.newInstance(latLng, latLng);
        mqBounds.extend(toMQALatLng(bounds.getSouthWestCorner()));
        
        return mqBounds;
    }

    private SimplePanel getMapHolder() {
        return m_mapHolder;
    }

    private void syncMapSizeWithParent() {
        getMapWidget().setSize();
        //getMapWidget().setSize(MQASize.newInstance(getMapHolder().getOffsetWidth(), getMapHolder().getOffsetHeight()));
    }

    public void placeMarker(Location location) {
        MQAPoi m = getMarker(location);
        
        if(m == null) {
            addMarker(location);
        }else {
            updateMarker(location, m);
        }
        
    }

    private void updateMarker(Location location, MQAPoi m) {
        m.setIcon(createIcon(location.getLocationInfo()));
    }

    private void addMarker(Location location) {
        MQAPoi marker = createMarker(location);
        setMarker(location, marker);
        getMapWidget().addShape(marker);
    }
    
    private MQAPoi getMarker(Location location) {
        return m_markers.get(location.getLocationInfo().getName());
    }
    
    private void setMarker(Location location, MQAPoi marker) {
        m_markers.put(location.getLocationInfo().getName(), marker);
    }
    
    public Widget getWidget() {
        return this;
    }

}
