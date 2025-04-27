package com.backend.pokemon.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /*
     * Sends verification code through email
     * 
     * @param to - the receiver of the email, code - the code that will be sent
     */
    public void sendVerificationCode(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Verification Code");
        message.setText("""
                Hi,

                You requested a new password.
                Your request code is: %s.
                Please note that this email is for notifications only. Any replies will not be answered.
                Best regards, Your Service Team.
                """.formatted(code));
        mailSender.send(message);
    }

    /*
     * Sends welcome through email
     * 
     * @param to - the receiver of the email
     */
    public void singUpEmail(String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Welcome to Pokemon Battle Arena");
        message.setText("""
                Hi,

                Welcome to Pokemon Battle Arena!
                Please note that this email is for notifications only. Any replies will not be answered.
                Best regards, Your Service Team.
                """);
        mailSender.send(message);
    }
}