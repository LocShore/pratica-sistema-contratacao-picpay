package com.spring.picpay.service;

import com.spring.picpay.dto.FuncionarioPatchRequest;
import com.spring.picpay.dto.FuncionarioRequest;
import com.spring.picpay.exception.DadosInvalidosException;
import com.spring.picpay.exception.FuncionarioNaoEncontradoException;
import com.spring.picpay.model.Funcionario;
import com.spring.picpay.model.StatusFuncionario;
import com.spring.picpay.repository.FuncionarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuncionarioService {

    private final FuncionarioRepository repository;

    public FuncionarioService(FuncionarioRepository repository) {
        this.repository = repository;
    }

    // ---------- POST ----------
    public Funcionario cadastrar(FuncionarioRequest request) {
        validarCamposObrigatorios(request.getNome(), request.getEmail(), request.getCargo());

        Funcionario funcionario = new Funcionario();
        funcionario.setNome(request.getNome());
        funcionario.setEmail(request.getEmail());
        funcionario.setTelefone(request.getTelefone());
        funcionario.setCargo(request.getCargo());
        funcionario.setDepartamento(request.getDepartamento());
        funcionario.setSalario(request.getSalario());
        funcionario.setCidade(request.getCidade());
        funcionario.setStatus(request.getStatus() != null ? request.getStatus() : StatusFuncionario.EM_ANALISE);

        // o id é sempre gerado pelo sistema, garantindo unicidade
        return repository.salvar(funcionario);
    }

    // ---------- GET (todos) ----------
    public List<Funcionario> listarTodos() {
        return repository.listarTodos();
    }

    // ---------- GET (por id) ----------
    public Funcionario buscarPorId(Long id) {
        return repository.buscarPorId(id)
                .orElseThrow(() -> new FuncionarioNaoEncontradoException(id));
    }

    // ---------- GET (busca por nome, cargo ou status) ----------
    public List<Funcionario> buscar(String nome, String cargo, StatusFuncionario status) {
        return repository.listarTodos().stream()
                .filter(f -> nome == null || (f.getNome() != null
                        && f.getNome().toLowerCase().contains(nome.toLowerCase())))
                .filter(f -> cargo == null || (f.getCargo() != null
                        && f.getCargo().toLowerCase().contains(cargo.toLowerCase())))
                .filter(f -> status == null || status.equals(f.getStatus()))
                .toList();
    }

    // ---------- PUT (atualização completa) ----------
    public Funcionario atualizarCompleto(Long id, FuncionarioRequest request) {
        Funcionario existente = buscarPorId(id);

        validarCamposObrigatorios(request.getNome(), request.getEmail(), request.getCargo());

        existente.setNome(request.getNome());
        existente.setEmail(request.getEmail());
        existente.setTelefone(request.getTelefone());
        existente.setCargo(request.getCargo());
        existente.setDepartamento(request.getDepartamento());
        existente.setSalario(request.getSalario());
        existente.setCidade(request.getCidade());
        existente.setStatus(request.getStatus() != null ? request.getStatus() : existente.getStatus());

        return existente;
    }

    // ---------- PATCH (atualização parcial) ----------
    public Funcionario atualizarParcial(Long id, FuncionarioPatchRequest request) {
        Funcionario existente = buscarPorId(id);

        if (request.getNome() != null) {
            if (request.getNome().isBlank()) {
                throw new DadosInvalidosException("O nome não pode ser vazio.");
            }
            existente.setNome(request.getNome());
        }
        if (request.getEmail() != null) {
            if (request.getEmail().isBlank()) {
                throw new DadosInvalidosException("O e-mail não pode ser vazio.");
            }
            existente.setEmail(request.getEmail());
        }
        if (request.getTelefone() != null) {
            existente.setTelefone(request.getTelefone());
        }
        if (request.getCargo() != null) {
            if (request.getCargo().isBlank()) {
                throw new DadosInvalidosException("O cargo não pode ser vazio.");
            }
            existente.setCargo(request.getCargo());
        }
        if (request.getDepartamento() != null) {
            existente.setDepartamento(request.getDepartamento());
        }
        if (request.getSalario() != null) {
            existente.setSalario(request.getSalario());
        }
        if (request.getCidade() != null) {
            existente.setCidade(request.getCidade());
        }
        if (request.getStatus() != null) {
            existente.setStatus(request.getStatus());
        }

        return existente;
    }

    // ---------- DELETE ----------
    public void excluir(Long id) {
        boolean removido = repository.removerPorId(id);
        if (!removido) {
            throw new FuncionarioNaoEncontradoException(id);
        }
    }

    // ---------- Indicadores (diferencial do desafio) ----------
    public java.util.Map<String, Long> indicadores() {
        List<Funcionario> todos = repository.listarTodos();
        java.util.Map<String, Long> resultado = new java.util.LinkedHashMap<>();
        resultado.put("total", (long) todos.size());
        for (StatusFuncionario status : StatusFuncionario.values()) {
            long quantidade = todos.stream().filter(f -> status.equals(f.getStatus())).count();
            resultado.put(status.name(), quantidade);
        }
        return resultado;
    }

    private void validarCamposObrigatorios(String nome, String email, String cargo) {
        if (nome == null || nome.isBlank()) {
            throw new DadosInvalidosException("O campo 'nome' é obrigatório.");
        }
        if (email == null || email.isBlank()) {
            throw new DadosInvalidosException("O campo 'email' é obrigatório.");
        }
        if (cargo == null || cargo.isBlank()) {
            throw new DadosInvalidosException("O campo 'cargo' é obrigatório.");
        }
    }
}
