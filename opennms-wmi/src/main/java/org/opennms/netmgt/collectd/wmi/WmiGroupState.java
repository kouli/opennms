//
// This file is part of the OpenNMS(R) Application.
//
// OpenNMS(R) is Copyright (C) 2006 The OpenNMS Group, Inc.  All rights reserved.
// OpenNMS(R) is a derivative work, containing both original code, included code and modified
// code that was published under the GNU General Public License. Copyrights for modified
// and included code are below.
//
// OpenNMS(R) is a registered trademark of The OpenNMS Group, Inc.
//
// Original code base Copyright (C) 1999-2001 Oculan Corp.  All rights reserved.
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
//
// For more information contact:
//      OpenNMS Licensing       <license@opennms.org>
//      http://www.opennms.org/
//      http://www.opennms.com/
//
package org.opennms.netmgt.collectd.wmi;

import java.util.Date;

/**
 * <p>WmiGroupState class.</p>
 *
 * @author ranger
 * @version $Id: $
 */
public class WmiGroupState {
    private boolean available = false;
    private Date lastChecked;

    /**
     * <p>Constructor for WmiGroupState.</p>
     *
     * @param isAvailable a boolean.
     */
    public WmiGroupState(boolean isAvailable) {
        this(isAvailable, new Date());
    }

    /**
     * <p>Constructor for WmiGroupState.</p>
     *
     * @param isAvailable a boolean.
     * @param lastChecked a {@link java.util.Date} object.
     */
    public WmiGroupState(boolean isAvailable, Date lastChecked) {
        this.available = isAvailable;
        this.lastChecked = lastChecked;
    }

    /**
     * <p>isAvailable</p>
     *
     * @return a boolean.
     */
    public boolean isAvailable() {
        return available;
    }

    /**
     * <p>Setter for the field <code>available</code>.</p>
     *
     * @param available a boolean.
     */
    public void setAvailable(boolean available) {
        this.available = available;
    }

    /**
     * <p>Getter for the field <code>lastChecked</code>.</p>
     *
     * @return a {@link java.util.Date} object.
     */
    public Date getLastChecked() {
        return lastChecked;
    }

    /**
     * <p>Setter for the field <code>lastChecked</code>.</p>
     *
     * @param lastChecked a {@link java.util.Date} object.
     */
    public void setLastChecked(Date lastChecked) {
        this.lastChecked = lastChecked;
    }
}
