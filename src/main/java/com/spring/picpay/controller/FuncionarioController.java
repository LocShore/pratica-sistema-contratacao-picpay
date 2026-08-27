package com.spring.picpay.controller;

import com.spring.picpay.dto.FuncionarioPatchRequest;
import com.spring.picpay.dto.FuncionarioRequest;
import com.spring.picpay.model.Funcionario;
import com.spring.picpay.model.StatusFuncionario;
import com.spring.picpay.service.FuncionarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * API REST para o processo de contratação de funcionários do PicPay.
 * Armazenamento em memória (ArrayList) — sem banco de dados.
 */
@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    private final FuncionarioService service;

    public FuncionarioController(FuncionarioService service) {
        this.service = service;
    }

    // POST /funcionarios -> cadastrar funcionário
    @PostMapping
    public ResponseEntity<Funcionario> cadastrar(@RequestBody FuncionarioRequest request) {
        Funcionario criado = service.cadastrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    // GET /funcionarios -> consultar todos (ou buscar com filtros opcionais)
    @GetMapping
    public ResponseEntity<List<Funcionario>> listarOuBuscar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cargo,
            @RequestParam(required = false) StatusFuncionario status) {

        List<Funcionario> resultado = (nome == null && cargo == null && status == null)
                ? service.listarTodos()
                : service.buscar(nome, cargo, status);

        return ResponseEntity.ok(resultado);
    }

    // GET /funcionarios/{id} -> consultar por id
    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // PUT /funcionarios/{id} -> atualização completa
    @PutMapping("/{id}")
    public ResponseEntity<Funcionario> atualizarCompleto(
            @PathVariable Long id, @RequestBody FuncionarioRequest request) {
        return ResponseEntity.ok(service.atualizarCompleto(id, request));
    }

    // PATCH /funcionarios/{id} -> atualização parcial
    @PatchMapping("/{id}")
    public ResponseEntity<Funcionario> atualizarParcial(
            @PathVariable Long id, @RequestBody FuncionarioPatchRequest request) {
        return ResponseEntity.ok(service.atualizarParcial(id, request));
    }

    // DELETE /funcionarios/{id} -> excluir
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }

    // GET /funcionarios/indicadores -> diferencial: totais por status
    @GetMapping("/indicadores")
    public ResponseEntity<Map<String, Long>> indicadores() {
        return ResponseEntity.ok(service.indicadores());
    }
}
