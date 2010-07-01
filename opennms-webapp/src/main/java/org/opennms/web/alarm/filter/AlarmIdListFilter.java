/*
 * This file is part of the OpenNMS(R) Application.
 *
 * OpenNMS(R) is Copyright (C) 2009 The OpenNMS Group, Inc.  All rights reserved.
 * OpenNMS(R) is a derivative work, containing both original code, included code and modified
 * code that was published under the GNU General Public License. Copyrights for modified
 * and included code are below.
 *
 * OpenNMS(R) is a registered trademark of The OpenNMS Group, Inc.
 *
 * Original code base Copyright (C) 1999-2001 Oculan Corp.  All rights reserved.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 *
 * For more information contact:
 * OpenNMS Licensing       <license@opennms.org>
 *     http://www.opennms.org/
 *     http://www.opennms.com/
 */
package org.opennms.web.alarm.filter;

import org.opennms.web.filter.InFilter;
import org.opennms.web.filter.SQLType;


/**
 * <p>AlarmIdListFilter class.</p>
 *
 * @author ranger
 * @version $Id: $
 * @since 1.8.1
 */
public class AlarmIdListFilter extends InFilter<Integer> {
    /** Constant <code>TYPE="alarmIdList"</code> */
    public static final String TYPE = "alarmIdList";
    
    private static Integer[] box(int[] values) {
        if (values == null) return null;
        
        Integer[] boxed = new Integer[values.length];
        for(int i = 0; i < values.length; i++) {
            boxed[i] = values[i];
        }
        
        return boxed;
    }
    
    /**
     * <p>Constructor for AlarmIdListFilter.</p>
     *
     * @param alarmIds an array of int.
     */
    public AlarmIdListFilter(int[] alarmIds) {
        super(TYPE, SQLType.INT, "ALARMID", "id", box(alarmIds));
    }

    /**
     * <p>getTextDescription</p>
     *
     * @return a {@link java.lang.String} object.
     */
    public String getTextDescription() {
        return String.format("alarmId in (%s)", getValueString());
    }
    
}
