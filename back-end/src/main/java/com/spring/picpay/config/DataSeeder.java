package com.spring.picpay.config;

import com.spring.picpay.model.Funcionario;
import com.spring.picpay.model.StatusFuncionario;
import com.spring.picpay.repository.FuncionarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Cadastra alguns candidatos fictícios ao iniciar a aplicação,
 * apenas para facilitar os testes manuais da API.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final FuncionarioRepository repository;

    public DataSeeder(FuncionarioRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        repository.adicionarComIdControlado(new Funcionario(
                1L, "Ana Beatriz Silva", "ana.silva@email.com", "+5511987654321",
                "Desenvolvedora Backend", "Tecnologia", new BigDecimal("7500.00"),
                "São Paulo", StatusFuncionario.EM_ANALISE));

        repository.adicionarComIdControlado(new Funcionario(
                2L, "Carlos Eduardo Souza", "carlos.souza@email.com", "+5521912345678",
                "Analista Financeiro", "Financeiro", new BigDecimal("6200.00"),
                "Rio de Janeiro", StatusFuncionario.APROVADO));

        repository.adicionarComIdControlado(new Funcionario(
                3L, "Fernanda Costa", "fernanda.costa@email.com", "+5531988887777",
                "Designer de Produto", "Produto", new BigDecimal("6800.00"),
                "Belo Horizonte", StatusFuncionario.CONTRATADO));

        repository.adicionarComIdControlado(new Funcionario(
                4L, "Ricardo Almeida", "ricardo.almeida@email.com", "+5541999998888",
                "Analista de Suporte", "Tecnologia", new BigDecimal("4500.00"),
                "Curitiba", StatusFuncionario.REPROVADO));
    }
}
