package com.spring.picpay.repository;

import com.spring.picpay.model.Funcionario;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Armazena os funcionários em uma ArrayList em memória, conforme pedido
 * pelo desafio (sem uso de banco de dados).
 *
 * Os métodos são sincronizados para evitar condições de corrida caso a
 * API receba requisições concorrentes.
 */
@Repository
public class FuncionarioRepository {

    private final List<Funcionario> funcionarios = new ArrayList<>();
    private final AtomicLong sequencialId = new AtomicLong(0);

    public synchronized Funcionario salvar(Funcionario funcionario) {
        funcionario.setId(sequencialId.incrementAndGet());
        funcionarios.add(funcionario);
        return funcionario;
    }

    public synchronized List<Funcionario> listarTodos() {
        return new ArrayList<>(funcionarios);
    }

    public synchronized Optional<Funcionario> buscarPorId(Long id) {
        return funcionarios.stream()
                .filter(f -> f.getId().equals(id))
                .findFirst();
    }

    public synchronized boolean removerPorId(Long id) {
        return funcionarios.removeIf(f -> f.getId().equals(id));
    }

    /**
     * Usado apenas na inicialização, para cadastrar funcionários fictícios
     * sem passar pela geração automática de id ligada ao sequencial normal
     * de cadastro via API.
     */
    public synchronized void adicionarComIdControlado(Funcionario funcionario) {
        if (funcionario.getId() == null) {
            funcionario.setId(sequencialId.incrementAndGet());
        } else {
            // garante que o próximo id gerado pela API nunca colida com os
            // ids fictícios inseridos manualmente
            sequencialId.updateAndGet(atual -> Math.max(atual, funcionario.getId()));
        }
        funcionarios.add(funcionario);
    }
}
