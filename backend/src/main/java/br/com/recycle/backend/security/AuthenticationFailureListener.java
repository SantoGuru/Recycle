package br.com.recycle.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationFailureListener implements ApplicationListener<AuthenticationFailureBadCredentialsEvent> {

    private final LoginAttemptService loginAttemptService;
    private final HttpServletRequest request;
    
    public AuthenticationFailureListener(LoginAttemptService loginAttemptService, HttpServletRequest request) {
        this.loginAttemptService = loginAttemptService;
        this.request = request;
    }

    @Override
    public void onApplicationEvent(AuthenticationFailureBadCredentialsEvent event) {
        final String ip = loginAttemptService.getClientIP(request);
        if (ip != null) {
            loginAttemptService.loginFailed(ip);
        }
    }
}