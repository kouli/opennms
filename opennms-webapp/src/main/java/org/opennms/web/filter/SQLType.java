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
package org.opennms.web.filter;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Date;

/**
 * <p>SQLType interface.</p>
 *
 * @author ranger
 * @version $Id: $
 * @since 1.8.1
 */
public interface SQLType<T> {
    
    /** Constant <code>INT</code> */
    public static final SQLType<Integer> INT = new IntegerSqlType();
    /** Constant <code>STRING</code> */
    public static final SQLType<String> STRING = new StringSqlType();
    /** Constant <code>DATE</code> */
    public static final SQLType<Date> DATE = new DateSqlType();
    
    /**
     * <p>getValueAsString</p>
     *
     * @param value a T object.
     * @param <T> a T object.
     * @return a {@link java.lang.String} object.
     */
    public String getValueAsString(T value);
    
    /**
     * <p>formatValue</p>
     *
     * @param value a T object.
     * @return a {@link java.lang.String} object.
     */
    public String formatValue(T value);

    /**
     * <p>bindParam</p>
     *
     * @param ps a {@link java.sql.PreparedStatement} object.
     * @param parameterIndex a int.
     * @param value a T object.
     * @throws java.sql.SQLException if any.
     */
    public void bindParam(PreparedStatement ps, int parameterIndex, T value) throws SQLException;
    
    /**
     * <p>createArray</p>
     *
     * @param value1 a T object.
     * @param value2 a T object.
     * @return an array of T objects.
     */
    public T[] createArray(T value1, T value2);
    
}
