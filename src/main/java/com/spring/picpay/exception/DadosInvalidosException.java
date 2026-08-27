package com.spring.picpay.exception;

/**
 * Lançada quando campos obrigatórios (nome, email, cargo) estão ausentes
 * ou quando algum dado enviado é inválido.
 */
public class DadosInvalidosException extends RuntimeException {

    public DadosInvalidosException(String mensagem) {
        super(mensagem);
    }
}
