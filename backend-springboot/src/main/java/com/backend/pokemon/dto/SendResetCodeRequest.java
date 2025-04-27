package com.backend.pokemon.dto;

public class SendResetCodeRequest {
    private String email;

    public SendResetCodeRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
