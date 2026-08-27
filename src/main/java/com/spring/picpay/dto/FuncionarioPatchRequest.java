package com.spring.picpay.dto;

import com.spring.picpay.model.StatusFuncionario;

import java.math.BigDecimal;

/**
 * Corpo esperado em PATCH (atualização parcial).
 * Todos os campos são opcionais: apenas os que vierem preenchidos
 * (não nulos) no JSON serão alterados; os demais permanecem como estavam.
 */
public class FuncionarioPatchRequest {

    private String nome;
    private String email;
    private String telefone;
    private String cargo;
    private String departamento;
    private BigDecimal salario;
    private String cidade;
    private StatusFuncionario status;

    public FuncionarioPatchRequest() {
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
