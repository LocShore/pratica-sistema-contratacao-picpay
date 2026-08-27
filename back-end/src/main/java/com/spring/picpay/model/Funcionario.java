package com.spring.picpay.model;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Representa um candidato/funcionário no processo de contratação do PicPay.
 * Armazenado apenas em memória (ArrayList), sem persistência em banco de dados.
 */
public class Funcionario {

    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private String cargo;
    private String departamento;
    private BigDecimal salario;
    private String cidade;
    private StatusFuncionario status;

    public Funcionario() {
    }

    public Funcionario(Long id, String nome, String email, String telefone, String cargo,
                        String departamento, BigDecimal salario, String cidade, StatusFuncionario status) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cargo = cargo;
        this.departamento = departamento;
        this.salario = salario;
        this.cidade = cidade;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Funcionario that)) return false;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
