package com.spring.picpay.exception;

/**
 * Lançada quando nenhum funcionário é encontrado com o ID informado.
 */
public class FuncionarioNaoEncontradoException extends RuntimeException {

    public FuncionarioNaoEncontradoException(Long id) {
        super("Funcionário não encontrado com o id: " + id);
    }
}
