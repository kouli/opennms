package org.opennms.container.jaas;

import java.security.Principal;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.security.auth.Subject;
import javax.security.auth.callback.CallbackHandler;
import javax.security.auth.login.LoginException;

import org.apache.karaf.jaas.boot.principal.RolePrincipal;
import org.apache.karaf.jaas.modules.AbstractKarafLoginModule;
import org.opennms.netmgt.config.api.UserConfig;
import org.opennms.web.springframework.security.LoginHandler;
import org.opennms.web.springframework.security.LoginModuleUtils;
import org.opennms.web.springframework.security.SpringSecurityUserDao;
import org.osgi.framework.BundleContext;
import org.osgi.framework.FrameworkUtil;
import org.osgi.framework.ServiceReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;

public class OpenNMSLoginModule extends AbstractKarafLoginModule implements LoginHandler {
    private static final transient Logger LOG = LoggerFactory.getLogger(OpenNMSLoginModule.class);
    private static transient volatile BundleContext m_context;

    private UserConfig m_userConfig;
    private SpringSecurityUserDao m_userDao;

    @Override
    public void initialize(final Subject subject, final CallbackHandler callbackHandler, final Map<String, ?> sharedState, final Map<String, ?> options) {
        LOG.info("OpenNMS Login Module initializing.");
        super.initialize(subject, callbackHandler, options);
    }

    @Override
    public boolean login() throws LoginException {
        return LoginModuleUtils.doLogin(this);
    }

    @Override
    public boolean abort() throws LoginException {
        LOG.debug("Aborting {} login.", user);
        clear();
        return true;
    }

    @Override
    public boolean logout() throws LoginException {
        LOG.debug("Logging out user {}.", user);
        subject.getPrincipals().removeAll(principals);
        principals.clear();
        return true;
    }

    public UserConfig getUserConfig() {
        if (m_userConfig == null) {
            m_userConfig = getFromRegistry(UserConfig.class);
        }
        return m_userConfig;
    }

    public SpringSecurityUserDao getSpringSecurityUserDao() {
        if (m_userDao == null) {
            m_userDao = getFromRegistry(SpringSecurityUserDao.class);
        }
        return m_userDao;
    }

    public <T> T getFromRegistry(final Class<T> clazz) {
        if (m_context == null) {
            LOG.warn("No bundle context.  Unable to get class {} from the registry.", clazz);
            return null;
        }
        final ServiceReference<T> ref = m_context.getServiceReference(clazz);
        return m_context.getService(ref);
    }

    public static synchronized void setContext(final BundleContext context) {
        m_context = context;
    }

    public static synchronized BundleContext getContext() {
        if (m_context == null) {
            m_context = FrameworkUtil.getBundle(OpenNMSLoginModule.class).getBundleContext();
        }
        return m_context;
    }


    public CallbackHandler callbackHandler() {
        return this.callbackHandler;
    }

    @Override
    public UserConfig userConfig() {
        return getUserConfig();
    }

    @Override
    public SpringSecurityUserDao springSecurityUserDao() {
        return getSpringSecurityUserDao();
    }

    @Override
    public String user() {
        return this.user;
    }

    @Override
    public void setUser(final String user) {
        this.user = user;
    }

    public Set<Principal> createPrincipals(final GrantedAuthority authority) {
        final String role = authority.getAuthority().toLowerCase().replaceFirst("^role_", "");
        final Set<Principal> principals = new HashSet<Principal>();
        principals.add(new RolePrincipal(role));
        principals.add(new RolePrincipal(authority.getAuthority()));
        return principals;
    }

    @Override
    public Set<Principal> principals() {
        return this.principals;
    }

    @Override
    public void setPrincipals(final Set<Principal> principals) {
        this.principals = principals;
    }
}
