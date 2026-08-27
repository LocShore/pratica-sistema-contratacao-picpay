package com.spring.picpay.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Centraliza o tratamento de exceções, devolvendo respostas HTTP
 * com mensagens claras em vez de stack traces.
 */
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(FuncionarioNaoEncontradoException.class)
    public ResponseEntity<ApiErrorResponse> handleNaoEncontrado(FuncionarioNaoEncontradoException ex) {
        ApiErrorResponse erro = new ApiErrorResponse(
                HttpStatus.NOT_FOUND.value(), "Funcionário não encontrado", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }

    @ExceptionHandler(DadosInvalidosException.class)
    public ResponseEntity<ApiErrorResponse> handleDadosInvalidos(DadosInvalidosException ex) {
        ApiErrorResponse erro = new ApiErrorResponse(
                HttpStatus.BAD_REQUEST.value(), "Dados inválidos", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
    }
}
