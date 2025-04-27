package com.backend.pokemon.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

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
}