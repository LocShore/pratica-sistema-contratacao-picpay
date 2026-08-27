package com.spring.picpay.dto;

import com.spring.picpay.model.StatusFuncionario;

import java.math.BigDecimal;

/**
 * Corpo esperado em POST (cadastro) e PUT (atualização completa).
 * Nome, e-mail e cargo são obrigatórios conforme o desafio.
 */
public class FuncionarioRequest {

    private String nome;
    private String email;
    private String telefone;
    private String cargo;
    private String departamento;
    private BigDecimal salario;
    private String cidade;
    private StatusFuncionario status;

    public FuncionarioRequest() {
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public BigDecimal getSalario() {
        return salario;
    }

    public void setSalario(BigDecimal salario) {
        this.salario = salario;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public StatusFuncionario getStatus() {
        return status;
    }

    public void setStatus(StatusFuncionario status) {
        this.status = status;
    }
}
