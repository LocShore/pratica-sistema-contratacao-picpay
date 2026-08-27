package com.spring.picpay.exception;

import java.time.LocalDateTime;

/**
 * Formato padronizado de resposta de erro devolvido pela API.
 */
public class ApiErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private String erro;
    private String mensagem;

    public ApiErrorResponse(int status, String erro, String mensagem) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.erro = erro;
        this.mensagem = mensagem;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getErro() {
        return erro;
    }

    public String getMensagem() {
        return mensagem;
    }
}
