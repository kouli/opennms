//
// This file is part of the OpenNMS(R) Application.
//
// OpenNMS(R) is Copyright (C) 4 Blast Consulting Company.  All rights reserved.
// OpenNMS(R) is a derivative work, containing both original code, included code and modified
// code that was published under the GNU General Public License. Copyrights for modified 
// and included code are below.
//
// OpenNMS(R) is a registered trademark of Blast Internet Services, Inc.
// 
// Copyright (C) 1999-2001 Oculan Corp.  All rights reserved.
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
//      http://www.blast.com/
//

package org.opennms.core.utils;

import java.util.List;
import org.apache.log4j.Category;
import org.opennms.netmgt.notifd.NotificationStrategy;

/**Implementation of Executor strategy that instantiates a Java class.
 * 
 * @author <A HREF="mailto:david@opennms.org">David Hustace</A>
 * @author <A HREF="http://www.opennms.org/">OpenNMS</A>
 *
 */
public class ClassExecutor implements ExecutorStrategy
{
	/**This method calls the send method of the specified class in @param className.
	   @param Java className of the notification sender plug-in
	   @param arguments a list of Argument objects that need to be passed to the class
	   @return int, the return code of the send method of the plug-in
	*/
	public int execute(String className, List arguments)
	{
		int returnCode = 0;
		Category log = ThreadCategory.getInstance(getClass());
		
		log.debug("Going for the class instance: " + className);
		NotificationStrategy ns = null;
		try {
			ns = (NotificationStrategy) Class.forName(className).newInstance();
			log.debug(className + " class created: "+ ns.getClass() );
		} catch (Exception e) {
			log.error("Execption creating notification strategy class: "+className ,e);
			returnCode = 1;
		}
		
		returnCode = ns.send(arguments);
		return returnCode;
	}

}