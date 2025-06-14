package com.hmpsicoterapia.controller;

import com.hmpsicoterapia.dto.AnotacaoDTO;
import com.hmpsicoterapia.dto.ExameDTO;
import com.hmpsicoterapia.dto.HistoricoMedicoDTO;
import com.hmpsicoterapia.dto.MedicacaoDTO;
import com.hmpsicoterapia.dto.ProntuarioDTO;
import com.hmpsicoterapia.dto.StatusTratamentoDTO;
import com.hmpsicoterapia.entity.Prontuario;
import com.hmpsicoterapia.service.ProntuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prontuarios")
@RequiredArgsConstructor
public class ProntuarioController {

    private final ProntuarioService prontuarioService;

    @PostMapping
    public ResponseEntity<?> criarProntuario(@Valid @RequestBody ProntuarioDTO dto,
                                             @AuthenticationPrincipal UserDetails user) {
        Prontuario p = prontuarioService.criarProntuario(dto, user.getUsername());
        return ResponseEntity.ok(p);
    }

    @GetMapping
    public ResponseEntity<List<Prontuario>> buscarProntuarios(@RequestParam(required = false, defaultValue = "") String filtro) {
        return ResponseEntity.ok(prontuarioService.buscarProntuarios(filtro));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProntuario(@PathVariable Long id) {
        return prontuarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarProntuario(@PathVariable Long id,
                                                 @Valid @RequestBody ProntuarioDTO dto,
                                                 @AuthenticationPrincipal UserDetails user) {
        try {
            Prontuario p = prontuarioService.atualizarProntuario(id, dto, user.getUsername());
            return ResponseEntity.ok(p);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Adiciona um novo registro ao histórico médico do prontuário
     * @param id ID do prontuário
     * @param dto DTO com a descrição do novo registro
     * @param user Usuário autenticado
     * @return Prontuário atualizado
     */
    @PostMapping("/{id}/historico-medico")
    public ResponseEntity<?> adicionarHistoricoMedico(@PathVariable Long id,
                                                     @Valid @RequestBody HistoricoMedicoDTO dto,
                                                     @AuthenticationPrincipal UserDetails user) {
        try {
            Prontuario p = prontuarioService.adicionarHistoricoMedico(id, dto.getDescricao(), user.getUsername());
            return ResponseEntity.ok(p);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Adiciona uma nova medicação ao prontuário
     * @param id ID do prontuário
     * @param dto DTO com os dados da medicação
     * @param user Usuário autenticado
     * @return Prontuário atualizado
     */
    @PostMapping("/{id}/medicacoes")
    public ResponseEntity<?> adicionarMedicacao(@PathVariable Long id,
                                               @Valid @RequestBody MedicacaoDTO dto,
                                               @AuthenticationPrincipal UserDetails user) {
        try {
            Prontuario p = prontuarioService.adicionarMedicacao(id, dto, user.getUsername());
            return ResponseEntity.ok(p);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Adiciona um novo exame ao prontuário
     * @param id ID do prontuário
     * @param dto DTO com os dados do exame
     * @param user Usuário autenticado
     * @return Prontuário atualizado
     */
    @PostMapping("/{id}/exames")
    public ResponseEntity<?> adicionarExame(@PathVariable Long id,
                                           @Valid @RequestBody ExameDTO dto,
                                           @AuthenticationPrincipal UserDetails user) {
        try {
            Prontuario p = prontuarioService.adicionarExame(id, dto, user.getUsername());
            return ResponseEntity.ok(p);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Adiciona uma nova anotação ao prontuário
     * @param id ID do prontuário
     * @param dto DTO com os dados da anotação
     * @param user Usuário autenticado
     * @return Prontuário atualizado
     */
    @PostMapping("/{id}/anotacoes")
    public ResponseEntity<?> adicionarAnotacao(@PathVariable Long id,
                                              @Valid @RequestBody AnotacaoDTO dto,
                                              @AuthenticationPrincipal UserDetails user) {
        try {
            Prontuario p = prontuarioService.adicionarAnotacao(id, dto, user.getUsername());
            return ResponseEntity.ok(p);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Atualiza o status do tratamento do prontuário
     * @param id ID do prontuário
     * @param dto DTO com o novo status e motivo (se aplicável)
     * @param user Usuário autenticado
     * @return Prontuário atualizado
     */
    @PatchMapping("/{id}/status-tratamento")
    public ResponseEntity<?> atualizarStatusTratamento(@PathVariable Long id,
                                                     @Valid @RequestBody StatusTratamentoDTO dto,
                                                     @AuthenticationPrincipal UserDetails user) {
        try {
            Prontuario p = prontuarioService.atualizarStatusTratamento(id, dto, user.getUsername());
            return ResponseEntity.ok(p);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
